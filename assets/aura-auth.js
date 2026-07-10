/* AURA PRINT & PROMO - shared customer auth + data layer.
   Requires: config.js, then https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2

   Everything here is safe to run in the browser. The publishable key can only
   do what row-level security allows: read sell prices, submit an enquiry, and
   read/write the signed-in customer's OWN profile, addresses, orders and
   artwork. Wholesale costs, other customers' data, order status transitions
   and order pricing are all enforced in the database, not here. */
(function (w) {
  var CFG = w.AURA_CONFIG || {};
  var sb = null;

  function client() {
    if (sb) return sb;
    if (!w.supabase || !CFG.supabaseUrl || !CFG.supabaseKey) return null;
    sb = w.supabase.createClient(CFG.supabaseUrl, CFG.supabaseKey);
    return sb;
  }

  function money(cents) {
    return '$' + (cents / 100).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  var STATUS_LABEL = {
    draft: 'Draft',
    submitted: 'Artwork received',
    proofing: 'Proof being prepared',
    changes_requested: 'Changes requested',
    proof_approved: 'Proof approved - awaiting payment',
    paid: 'Paid - queued for production',
    in_production: 'In production',
    shipped: 'Shipped',
    cancelled: 'Cancelled'
  };

  var AuraAuth = {
    client: client,
    money: money,
    statusLabel: function (s) { return STATUS_LABEL[s] || s; },

    async user() {
      var c = client(); if (!c) return null;
      var { data } = await c.auth.getUser();
      return data ? data.user : null;
    },

    /* GUEST CHECKOUT.
       Nobody should have to create an account to buy business cards. A guest
       gets a real but anonymous identity, so every row-level-security rule
       (own orders, own artwork, server-locked price) applies to them exactly
       as it does to a registered customer. They can convert to a full account
       later WITHOUT losing this order, because the user id never changes. */
    async ensureSession() {
      var c = client(); if (!c) throw new Error('Auth unavailable');
      var u = await this.user();
      if (u) return u;
      var { data, error } = await c.auth.signInAnonymously();
      if (error) {
        var e = new Error('Guest checkout is not enabled on this project.');
        e.code = error.code || 'anonymous_provider_disabled';
        throw e;
      }
      return data.user;
    },

    async isGuest() {
      var u = await this.user();
      return !!(u && u.is_anonymous);
    },

    /* Turn the current guest into a permanent account, keeping their orders.
       Same auth.users row, so order history follows them. */
    async convertToAccount(email, password, meta) {
      var c = client(); if (!c) throw new Error('Auth unavailable');
      var u = await this.user();
      if (!u) throw new Error('No session to convert');
      if (!u.is_anonymous) throw new Error('Already a registered account');

      var { error } = await c.auth.updateUser({ email: email, password: password });
      if (error) throw error;

      var p = { email: email };
      if (meta) { p.full_name = meta.full_name || null; p.phone = meta.phone || null; p.company = meta.company || null; }
      await c.from('profiles').update(p).eq('id', u.id);
      return true;
    },

    async profile() {
      var c = client(); var u = await this.user(); if (!c || !u) return null;
      var { data } = await c.from('profiles').select('*').eq('id', u.id).maybeSingle();
      return data;
    },

    async isStaff() {
      var p = await this.profile();
      return !!(p && p.is_staff);
    },

    async signUp(email, password, meta) {
      var c = client(); if (!c) throw new Error('Auth unavailable');
      var { data, error } = await c.auth.signUp({ email: email, password: password });
      if (error) throw error;
      // The DB trigger creates the profile row. Fill in the extra details.
      if (data.user && meta) {
        await c.from('profiles').update({
          full_name: meta.full_name || null,
          phone: meta.phone || null,
          company: meta.company || null
        }).eq('id', data.user.id);
      }
      return data;
    },

    async signIn(email, password) {
      var c = client(); if (!c) throw new Error('Auth unavailable');
      var { data, error } = await c.auth.signInWithPassword({ email: email, password: password });
      if (error) throw error;
      return data;
    },

    async signOut() { var c = client(); if (c) await c.auth.signOut(); },

    async resetPassword(email) {
      var c = client(); if (!c) throw new Error('Auth unavailable');
      var { error } = await c.auth.resetPasswordForEmail(email, { redirectTo: location.origin + '/account.html' });
      if (error) throw error;
    },

    /* ---- addresses ---- */
    async addresses() {
      var c = client(); if (!c) return [];
      var { data } = await c.from('addresses').select('*').order('is_default', { ascending: false });
      return data || [];
    },

    async saveAddress(a) {
      var c = client(); var u = await this.user(); if (!c || !u) throw new Error('Sign in first');
      a.user_id = u.id;
      var q = a.id ? c.from('addresses').update(a).eq('id', a.id) : c.from('addresses').insert(a);
      var { data, error } = await q.select().single();
      if (error) throw error;
      return data;
    },

    /* ---- prices (read-only, public) ---- */
    async price(stock, sides, qty) {
      var c = client(); if (!c) return null;
      var { data, error } = await c.from('bc_prices').select('price_cents,source')
        .eq('stock', stock).eq('sides', sides).eq('qty', qty).eq('turnaround', 'standard').maybeSingle();
      if (error) return null;
      return data;
    },

    /* ---- orders ---- */
    async createOrder(o) {
      var c = client(); if (!c) throw new Error('Auth unavailable');
      var u = await this.ensureSession();   // guests included
      o.user_id = u.id;
      // price_cents is deliberately NOT sent: the database computes it.
      delete o.price_cents; delete o.status;
      var { data, error } = await c.from('orders').insert(o).select().single();
      if (error) throw error;
      return data;
    },

    async submitOrder(orderId) {
      var c = client(); if (!c) throw new Error('Auth unavailable');
      var { data, error } = await c.from('orders').update({ status: 'submitted' }).eq('id', orderId).select().single();
      if (error) throw error;
      return data;
    },

    async myOrders() {
      var c = client(); if (!c) return [];
      var { data } = await c.from('orders').select('*').order('created_at', { ascending: false });
      return data || [];
    },

    /* ---- artwork ---- */
    async uploadArtwork(orderId, file) {
      var c = client(); if (!c) throw new Error('Auth unavailable');
      var u = await this.ensureSession();   // guests included
      if (file.type !== 'application/pdf') throw new Error('Artwork must be a PDF.');
      if (file.size > 52428800) throw new Error('That PDF is larger than 50MB.');

      var safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      var path = u.id + '/' + orderId + '/' + Date.now() + '-' + safe;

      var up = await c.storage.from('artwork').upload(path, file, { contentType: 'application/pdf', upsert: false });
      if (up.error) throw up.error;

      var { error } = await c.from('order_files').insert({
        order_id: orderId, storage_path: path, filename: file.name,
        mime_type: 'application/pdf', size_bytes: file.size, kind: 'artwork', uploaded_by: u.id
      });
      if (error) throw error;
      return path;
    },

    async orderFiles(orderId) {
      var c = client(); if (!c) return [];
      var { data } = await c.from('order_files').select('*').eq('order_id', orderId).order('created_at');
      return data || [];
    },

    async fileUrl(path) {
      var c = client(); if (!c) return null;
      var { data } = await c.storage.from('artwork').createSignedUrl(path, 3600);
      return data ? data.signedUrl : null;
    }
  };

  w.AuraAuth = AuraAuth;
})(window);
