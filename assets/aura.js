/* AURA PRINT & PROMO - shared behaviour: mobile drawer, forms, newsletter, analytics.
   The nav and footer MARKUP now lives in each page's HTML. The copies below are a
   fallback for any page not yet rebuilt - keep the two in step if you edit either. */
(function(){
const HEADER = `
<div class="util">
  <div class="wrap">
    <div class="left">
      <a href="tel:1300291277"><b>1300 291 277</b></a>
      <a href="quote.html">Upload artwork</a>
    </div>
    <div class="right">
      <span class="tag">Sunshine Coast owned. Australia-wide delivery.</span>
    </div>
  </div>
</div>
<nav class="main">
  <div class="wrap">
    <a class="logo" href="index.html">AURA<span>PRINT</span></a>
    <button class="nav-burger" id="navBurger" aria-label="Open menu" aria-expanded="false" aria-controls="navDrawer">
      <span></span><span></span><span></span>
    </button>
    <div class="navlinks">
      <div><a href="print.html">Print ▾</a>
        <div class="mega">
          <div><h4>Cards &amp; Stationery</h4><ul><li><a href="business-cards.html">Business Cards</a></li><li><a href="nv-velvet-business-cards.html">NV Velvet Cards</a></li><li><a href="letterheads.html">Letterheads</a></li><li><a href="envelopes.html">Envelopes</a></li><li><a href="loyalty-cards.html">Loyalty Cards</a></li></ul></div>
          <div><h4>Marketing</h4><ul><li><a href="flyers.html">Flyers</a></li><li><a href="brochures.html">Brochures</a></li><li><a href="postcards.html">Postcards</a></li><li><a href="presentation-folders.html">Presentation Folders</a></li><li><a href="menus.html">Menus</a></li></ul></div>
          <div><h4>Fast &amp; Industry</h4><ul><li><a href="same-day-printing.html">Fast Turnaround Printing</a></li><li><a href="stationery-same-day.html">Fast Stationery</a></li><li><a href="real-estate-print-signage.html">Real Estate Print &amp; Signage</a></li><li><a href="budget-business-cards.html">Budget Business Cards</a></li><li><a href="artwork-templates.html">Artwork Templates</a></li></ul></div>
          <div><h4>Books &amp; Booklets</h4><ul><li><a href="booklets.html">Saddle Stitched Booklets</a></li><li><a href="perfect-bound-books.html">Perfect Bound Books</a></li><li><a href="invoice-books.html">Invoice Books (NCR)</a></li><li><a href="notepads.html">Notepads</a></li><li><a href="calendars.html">Calendars</a></li></ul></div>
        </div>
      </div>
      <div><a href="signage.html">Signage &amp; Display ▾</a>
        <div class="mega">
          <div><h4>Signs</h4><ul><li><a href="corflute-signs.html">Corflute Signs</a></li><li><a href="a-frames.html">A-Frames</a></li><li><a href="posters.html">Posters</a></li><li><a href="safety-signs.html">Safety Signs</a></li><li><a href="construction-signs.html">Construction Signs</a></li><li><a href="acrylic-signs.html">Acrylic Signs</a></li><li><a href="aluminium-signs.html">Aluminium Signs</a></li><li><a href="foam-pvc-signs.html">Foam PVC Signs</a></li></ul></div>
          <div><h4>Banners &amp; Flags</h4><ul><li><a href="pull-up-banners.html">Pull Up Banners</a></li><li><a href="outdoor-banners.html">Outdoor Banners</a></li><li><a href="teardrop-flags.html">Teardrop Flags</a></li><li><a href="fence-mesh.html">Fence Mesh</a></li></ul></div>
          <div><h4>Events &amp; Display</h4><ul><li><a href="exhibition-displays.html">Exhibition Displays</a></li><li><a href="media-walls.html">Media Walls</a></li><li><a href="marquees.html">Marquees</a></li><li><a href="tablecloths.html">Printed Tablecloths</a></li></ul></div>
        </div>
      </div>
      <div><a href="stickers.html">Stickers &amp; Labels ▾</a>
        <div class="mega">
          <div><h4>Stickers</h4><ul><li><a href="stickers.html">Kiss-Cut Roll Stickers</a></li><li><a href="custom-stickers.html">Custom Stickers</a></li><li><a href="vinyl-stickers.html">Vinyl Stickers</a></li><li><a href="bumper-stickers.html">Bumper Stickers</a></li><li><a href="outdoor-custom-stickers.html">Outdoor Stickers</a></li><li><a href="floor-stickers.html">Floor Stickers</a></li></ul></div>
          <div><h4>Labels &amp; Speciality</h4><ul><li><a href="roll-labels.html">Roll Labels</a></li><li><a href="custom-label-rolls.html">Custom Label Rolls</a></li><li><a href="large-format-stickers-sav.html">Large Format (SAV)</a></li><li><a href="electrostatic-stickers.html">Electrostatic Stickers</a></li></ul></div>
        </div>
      </div>
      <div><a href="promo.html">Promo &amp; Apparel ▾</a>
        <div class="mega">
          <div><h4>Drinkware &amp; Gifts</h4><ul><li><a href="promo.html">Mugs &amp; Cups</a></li><li><a href="promo.html">Bottles &amp; Tumblers</a></li><li><a href="promo.html">Stubby Coolers</a></li><li><a href="promo.html">Tote Bags</a></li></ul></div>
          <div><h4>Apparel</h4><ul><li><a href="promo.html">Tees &amp; Polos</a></li><li><a href="promo.html">Hoodies</a></li><li><a href="promo.html">Hi-Vis &amp; Workwear</a></li><li><a href="promo.html">Caps &amp; Hats</a></li></ul></div>
          <div><h4>Office &amp; Tech</h4><ul><li><a href="promo.html">Pens</a></li><li><a href="promo.html">Notebooks</a></li><li><a href="promo.html">Lanyards</a></li><li><a href="promo.html">Eco Range</a></li></ul></div>
          <div><h4>Magnets</h4><ul><li><a href="magnets.html">All Fridge Magnets →</a></li><li><a href="magnets.html">Business Card Magnets</a></li><li><a href="magnets.html">Photo Frame Magnets</a></li><li><a href="magnets.html">Whiteboard Magnets</a></li><li><a href="vehicle-magnets.html">Vehicle Magnets</a></li></ul></div>
        </div>
      </div>
      <div><a href="index.html#quoter">Instant Price</a></div>
      <div><a href="about.html">About</a></div>
      <div><a href="contact.html">Contact</a></div>
    </div>
    <div class="nav-cta">
      <a class="btn btn-aura" href="quote.html" style="padding:10px 22px">Get a Quote</a>
    </div>
  </div>
</nav>
<div class="drawer-backdrop" id="drawerBackdrop" hidden></div>
<aside class="drawer" id="navDrawer" aria-label="Site menu" hidden>
  <div class="drawer-head">
    <a class="logo" href="index.html">AURA<span>PRINT</span></a>
    <button class="drawer-close" id="drawerClose" aria-label="Close menu">✕</button>
  </div>
  <nav class="drawer-nav">
    <div class="drawer-group">
      <button class="drawer-toggle" aria-expanded="false">Print <span>▾</span></button>
      <ul class="drawer-sub" hidden>
        <li><a href="print.html"><b>All print products →</b></a></li>
        <li><a href="business-cards.html">Business Cards</a></li>
        <li><a href="flyers.html">Flyers</a></li>
        <li><a href="brochures.html">Brochures</a></li>
        <li><a href="postcards.html">Postcards</a></li>
        <li><a href="letterheads.html">Letterheads</a></li>
        <li><a href="posters.html">Posters</a></li>
        <li><a href="booklets.html">Booklets</a></li>
      </ul>
    </div>
    <div class="drawer-group">
      <button class="drawer-toggle" aria-expanded="false">Signage &amp; Display <span>▾</span></button>
      <ul class="drawer-sub" hidden>
        <li><a href="signage.html"><b>All signage &amp; display →</b></a></li>
        <li><a href="corflute-signs.html">Corflute Signs</a></li>
        <li><a href="pull-up-banners.html">Pull Up Banners</a></li>
        <li><a href="a-frames.html">A-Frames</a></li>
        <li><a href="teardrop-flags.html">Teardrop Flags</a></li>
        <li><a href="outdoor-banners.html">Outdoor Banners</a></li>
      </ul>
    </div>
    <div class="drawer-group">
      <button class="drawer-toggle" aria-expanded="false">Stickers &amp; Labels <span>▾</span></button>
      <ul class="drawer-sub" hidden>
        <li><a href="stickers.html"><b>Kiss-cut stickers - price online →</b></a></li>
        <li><a href="custom-stickers.html">Custom Stickers</a></li>
        <li><a href="vinyl-stickers.html">Vinyl Stickers</a></li>
        <li><a href="bumper-stickers.html">Bumper Stickers</a></li>
        <li><a href="outdoor-custom-stickers.html">Outdoor Stickers</a></li>
        <li><a href="floor-stickers.html">Floor Stickers</a></li>
        <li><a href="roll-labels.html">Roll Labels</a></li>
        <li><a href="custom-label-rolls.html">Custom Label Rolls</a></li>
      </ul>
    </div>
    <div class="drawer-group">
      <a class="drawer-link" href="promo.html">Promo &amp; Apparel</a>
    </div>
    <div class="drawer-group">
      <a class="drawer-link" href="magnets.html">Fridge Magnets</a>
    </div>
    <div class="drawer-group"><a class="drawer-link" href="index.html#quoter">Instant Price</a></div>
    <div class="drawer-group"><a class="drawer-link" href="about.html">About</a></div>
    <div class="drawer-group"><a class="drawer-link" href="contact.html">Contact</a></div>
  </nav>
  <div class="drawer-foot">
    <a class="btn btn-aura" href="quote.html" style="width:100%;text-align:center">Get a Quote</a>
    <a href="tel:1300291277" class="drawer-phone">📞 1300 291 277</a>
  </div>
</aside>`;

const FOOTER = `
<footer>
  <div class="wrap">
    <div class="cols">
      <div>
        <a class="logo" href="index.html" style="color:#fff">AURA<span>PRINT</span></a>
        <p style="color:#b8b2ab;font-size:14px;margin-top:14px">Bold print and promotional products from the Sunshine Coast, delivered Australia-wide.</p>
        <p style="margin-top:16px;font-size:14px"><a href="art-setup.html" style="color:#fff;font-weight:700;text-decoration:underline">Preparing your artwork? Read our print-ready guide →</a></p>
        <h4 style="margin-top:24px">Print offers &amp; tips, straight to your inbox</h4>
        <div class="newsletter"><input type="email" id="nl-email" placeholder="Your email address" aria-label="Email address for newsletter"><button class="btn btn-aura" id="nl-join" style="padding:12px 22px">Join</button></div>
        <p id="nl-status" style="font-size:13px;min-height:18px;margin-top:8px"></p>
      </div>
      <div><h4>Products</h4><ul><li><a href="business-cards.html">Business Cards</a></li><li><a href="flyers.html">Flyers</a></li><li><a href="corflute-signs.html">Corflute Signs</a></li><li><a href="pull-up-banners.html">Pull Up Banners</a></li><li><a href="stickers.html">Stickers</a></li><li><a href="promo.html">Promo Products</a></li><li><a href="promo.html">Workwear</a></li><li><a href="same-day-printing.html">Fast Turnaround Printing</a></li><li><a href="real-estate-print-signage.html">Real Estate Signage</a></li></ul></div>
      <div><h4>Company</h4><ul><li><a href="about.html">About</a></li><li><a href="blog.html">Blog</a></li><li><a href="art-setup.html">Artwork Setup Guide</a></li><li><a href="artwork-templates.html">Artwork Templates</a></li><li><a href="trade-terms.html">Terms of Trade</a></li><li><a href="privacy-policy.html">Privacy Policy</a></li><li><a href="refund-policy.html">Refunds &amp; Reprints</a></li></ul></div>
      <div><h4>Contact</h4><ul>
        <li>4/1 Packer Road, Baringa QLD 4551</li>
        <li><a href="tel:1300291277">1300 291 277</a></li>
        <li><a class="email-link" data-u="admin" data-d="auraprint.com.au"></a></li>
        <li>Mon-Fri 8:30am - 5pm</li>
        <li style="margin-top:10px"><b style="color:#fff">Need it fast? Ask about express options.</b></li>
      </ul></div>
    </div>
    <div class="legal">
      <span>© 2026 Aura Print &amp; Promo | ABN 75 642 501 493 | 100% Australian owned.</span>
      <span>Sunshine Coast, QLD | Australia-wide delivery</span>
    </div>
  </div>
</footer>`;

/* Spam-resistant email links: assembled in JS so the address never appears in the HTML source */
function fillEmails(){
  document.querySelectorAll('a.email-link').forEach(function(a){
    var em = (a.dataset.u || 'admin') + String.fromCharCode(64) + (a.dataset.d || 'auraprint.com.au');
    a.href = 'mai' + 'lto:' + em;
    if (!a.textContent.trim()) a.textContent = em;
  });
}

/* Enquiry + quote forms -> Web3Forms (emails admin@auraprint.com.au on every submit).
   Any <form data-aura-form> is wired automatically. Requires AURA_CONFIG.web3formsKey.
   Free tier has no file attachments, so artwork is captured as a link/description here
   and the real upload happens once the full backend is built. */
/* Map a form's fields to the leads table columns. */
function collectLead(form){
  var g = function(n){ var el = form.querySelector('[name="'+n+'"]'); return el ? String(el.value||'').trim() : null; };
  var page = (location.pathname.split('/').pop() || '');
  var lead = {
    name:                g('name'),
    email:               g('email'),
    phone:               g('phone'),
    company:             g('company'),
    category:            g('product') || g('category'),
    quantity:            g('quantity'),
    job_details:         g('job_details') || g('message'),
    artwork_link:        g('artwork_link'),
    source_form:         page.indexOf('contact') > -1 ? 'contact' : 'quote',
    source_page:         g('source_page') || page,
    source_product_code: g('source_product_code'),
    user_agent:          navigator.userAgent
  };
  Object.keys(lead).forEach(function(k){ if (lead[k] == null || lead[k] === '') delete lead[k]; });
  return lead;
}

/* Store the enquiry in the Supabase leads table. Resolves {ok|skipped}. */
function saveLead(CFG, lead){
  if (!CFG.supabaseUrl || !CFG.supabaseKey) return Promise.resolve({ skipped:true });
  return fetch(CFG.supabaseUrl + '/rest/v1/leads', {
    method: 'POST',
    headers: {
      'apikey':        CFG.supabaseKey,
      'Authorization': 'Bearer ' + CFG.supabaseKey,
      'Content-Type':  'application/json',
      'Prefer':        'return=minimal'
    },
    body: JSON.stringify(lead)
  }).then(function(r){ return { ok:r.ok, status:r.status }; })
    .catch(function(){ return { ok:false }; });
}

function wireForms(){
  var CFG = (window.AURA_CONFIG || {});
  var ENDPOINT = 'https://api.web3forms.com/submit';
  document.querySelectorAll('form[data-aura-form]').forEach(function(form){
    var status = form.querySelector('.form-status');
    if (!status){ status = document.createElement('p'); status.className = 'form-status'; status.style.cssText = 'margin-top:14px;font-size:14px;min-height:20px'; form.appendChild(status); }
    form.addEventListener('submit', function(e){
      e.preventDefault();
      /* honeypot: bots fill hidden field, humans never do */
      var hp = form.querySelector('input[name="botcheck"]');
      if (hp && hp.checked) return;
      /* required-field guard: inline error under every missing field, then
         scroll to the first one - never fail silently. */
      form.querySelectorAll('.field-error').forEach(function(el){ el.remove(); });
      form.querySelectorAll('.input-error').forEach(function(el){ el.classList.remove('input-error'); });
      var missing = [];
      form.querySelectorAll('[required]').forEach(function(el){ if(!String(el.value||'').trim()) missing.push(el); });
      var emailEl = form.querySelector('input[type="email"][required], input[name="email"]');
      var badEmail = emailEl && String(emailEl.value||'').trim() && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(emailEl.value.trim());
      if (badEmail && missing.indexOf(emailEl) < 0) missing.push(emailEl);
      if (missing.length){
        missing.forEach(function(el){
          el.classList.add('input-error');
          var msg = document.createElement('span');
          msg.className = 'field-error';
          msg.style.cssText = 'display:block;margin-top:5px;font-size:12.5px;color:#c0392b;font-weight:600';
          msg.textContent = (el === emailEl && badEmail) ? 'That email address doesn’t look right.' : 'This field is required.';
          el.insertAdjacentElement('afterend', msg);
        });
        status.style.color = '#c0392b';
        status.textContent = 'Please fix the ' + missing.length + ' highlighted field' + (missing.length > 1 ? 's' : '') + ' above.';
        missing[0].scrollIntoView({ behavior:'smooth', block:'center' });
        missing[0].focus({ preventScroll:true });
        return;
      }

      var btn = form.querySelector('button[type="submit"], button:not([type])');
      var em = 'admin' + String.fromCharCode(64) + 'auraprint.com.au';
      var hasSupabase = !!(CFG.supabaseUrl && CFG.supabaseKey);
      if (!CFG.web3formsKey && !hasSupabase){
        status.style.color = '#c0392b';
        status.innerHTML = 'Our form isn’t connected yet — please call <b>1300 291 277</b> or email <b>' + em + '</b> and we’ll jump straight on it.';
        return;
      }
      var original = btn ? btn.textContent : '';
      if (btn){ btn.disabled = true; btn.textContent = 'Sending…'; }
      status.style.color = '#6b6560'; status.textContent = '';

      /* Primary: store the enquiry in the CRM database. */
      var dbSave = saveLead(CFG, collectLead(form));

      /* Parallel: email alert to admin@auraprint.com.au (best effort). */
      var mail;
      if (CFG.web3formsKey){
        var data = new FormData(form);
        data.append('access_key', CFG.web3formsKey);
        if (!data.get('subject')) data.append('subject', (form.getAttribute('data-subject') || 'New website enquiry') + ' – Aura Print');
        data.append('from_name', 'Aura Print website');
        mail = fetch(ENDPOINT, { method:'POST', body:data })
          .then(function(r){ return r.json(); })
          .then(function(res){ return !!res.success; })
          .catch(function(){ return false; });
      } else {
        mail = Promise.resolve(false);
      }

      Promise.allSettled([dbSave, mail]).then(function(rs){
        var db = rs[0].value || {};
        var stored  = rs[0].status === 'fulfilled' && (db.ok || db.skipped);
        var emailed = rs[1].status === 'fulfilled' && rs[1].value === true;
        if (stored || emailed){
          form.querySelectorAll('input,textarea,select').forEach(function(el){ if(el.type!=='hidden' && el.type!=='checkbox') el.value=''; });
          status.style.color = '#1a8a4a';
          status.innerHTML = '✓ Thanks! Your request is in — we’ll be in touch within the hour (Mon–Fri 8:30–5).';
          if (btn){ btn.textContent = '✓ Sent'; }
          auraTrack('generate_lead', {
            form_name: form.getAttribute('data-subject') || 'Website enquiry',
            page_path: location.pathname,
            stored: !!stored, emailed: !!emailed
          });
        } else {
          status.style.color = '#c0392b';
          status.innerHTML = 'Something went wrong sending that. Please call <b>1300 291 277</b> or email <b>' + em + '</b> and we’ll sort it right away.';
          if (btn){ btn.disabled = false; btn.textContent = original; }
        }
      });
    });
  });
}

/* Mobile drawer: burger below 900px, accordion groups, keyboard + backdrop close. */
function wireDrawer(){
  var burger = document.getElementById('navBurger'), drawer = document.getElementById('navDrawer'),
      backdrop = document.getElementById('drawerBackdrop'), close = document.getElementById('drawerClose');
  if (!burger || !drawer) return;
  function setOpen(open){
    drawer.hidden = !open; backdrop.hidden = !open;
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.classList.toggle('drawer-open', open);
    if (open) { var f = drawer.querySelector('a,button'); if (f) f.focus(); } else { burger.focus(); }
  }
  burger.addEventListener('click', function(){ setOpen(drawer.hidden); });
  close.addEventListener('click', function(){ setOpen(false); });
  backdrop.addEventListener('click', function(){ setOpen(false); });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && !drawer.hidden) setOpen(false); });
  drawer.querySelectorAll('.drawer-toggle').forEach(function(t){
    t.addEventListener('click', function(){
      var open = t.getAttribute('aria-expanded') === 'true';
      t.setAttribute('aria-expanded', open ? 'false' : 'true');
      t.nextElementSibling.hidden = open;
    });
  });
}

/* Footer newsletter -> leads table (source_form 'newsletter'). */
function wireNewsletter(){
  var btn = document.getElementById('nl-join'), input = document.getElementById('nl-email'),
      status = document.getElementById('nl-status');
  if (!btn || !input) return;
  function submit(){
    var em = String(input.value || '').trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)){
      status.style.color = '#f2b8a2'; status.textContent = 'Please enter a valid email address.'; input.focus(); return;
    }
    btn.disabled = true; btn.textContent = '…';
    saveLead(window.AURA_CONFIG || {}, {
      email: em, source_form: 'newsletter',
      source_page: location.pathname.split('/').pop() || 'index.html',
      job_details: 'Newsletter signup (footer)', user_agent: navigator.userAgent
    }).then(function(r){
      if (r.ok || r.skipped){
        input.value = ''; status.style.color = '#8fd3a8'; status.textContent = '✓ You’re on the list.';
        btn.textContent = '✓';
        auraTrack('newsletter_signup', { page_path: location.pathname });
      } else {
        status.style.color = '#f2b8a2'; status.textContent = 'That didn’t save - please try again.';
        btn.disabled = false; btn.textContent = 'Join';
      }
    });
  }
  btn.addEventListener('click', submit);
  input.addEventListener('keydown', function(e){ if (e.key === 'Enter') submit(); });
}

/* ---------------------------------------------------------------
   Google Analytics 4
   gtag.js loads ONLY when AURA_CONFIG.ga4Id is set, so clearing that
   value switches tracking off site-wide. window.auraTrack(name, params)
   is safe to call from any page whether analytics is on or off.
   Events: page_view (automatic), tel_click, email_click, quote_start,
           generate_lead, newsletter_signup.
   --------------------------------------------------------------- */
function auraTrack(name, params){
  try {
    if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
  } catch (e) {}
}
window.auraTrack = auraTrack;

function wireAnalytics(){
  var id = (window.AURA_CONFIG || {}).ga4Id;
  if (!id) return;                     /* analytics switched off */
  if (window.__auraGaLoaded) return;   /* never load gtag twice */
  window.__auraGaLoaded = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function(){ window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', id, {
    page_title: document.title,
    page_path: location.pathname + location.search
  });

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
  document.head.appendChild(s);

  /* Delegated, so it covers the header, footer and drawer that this file
     injects after page load, plus anything a product page adds later. */
  document.addEventListener('click', function(e){
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (href.indexOf('tel:') === 0){
      auraTrack('tel_click', { link_url: href, page_path: location.pathname });
    } else if (href.indexOf('mailto:') === 0){
      auraTrack('email_click', { link_url: href, page_path: location.pathname });
    }
  }, true);

  /* First touch of any enquiry or quote form = intent, fired once per form. */
  document.addEventListener('focusin', function(e){
    var f = e.target && e.target.closest ? e.target.closest('form[data-aura-form]') : null;
    if (!f || f.__auraStarted) return;
    f.__auraStarted = true;
    auraTrack('quote_start', {
      form_name: f.getAttribute('data-subject') || 'Website enquiry',
      page_path: location.pathname
    });
  });
}

/* ---------- Turnaround: one source of truth for what we promise ----------
   Same Day  - dispatched if ordered by 8am
   Next Day  - dispatched if ordered by 12pm
   Standard  - dispatched in 3-5 business days
   Fast speeds only run on selected products and specifications, so a page
   opts in with data-aura-turnaround="sameday" | "nextday". Standard is the
   floor and is always true. Times are worked out in Brisbane time, not the
   visitor's clock, so a customer in Perth is not told the wrong cut-off. */
const TURN_SPEEDS = {
  standard: { label:'Standard', cut:'3-5 business days' },
  nextday:  { label:'Next Day', cut:'order by 12pm', hour:12 },
  sameday:  { label:'Same Day', cut:'order by 8am',  hour:8  }
};
function brisNow(){
  try { return new Date(new Date().toLocaleString('en-US',{timeZone:'Australia/Brisbane'})); }
  catch(e){ return new Date(); }
}
function isWeekend(d){ return d.getDay()===0 || d.getDay()===6; }
function addBiz(from,n){ const d=new Date(from); while(n>0){ d.setDate(d.getDate()+1); if(!isWeekend(d)) n--; } return d; }
function fmtDay(d){
  const wd=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const mo=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return wd[d.getDay()]+' '+d.getDate()+' '+mo[d.getMonth()];
}
/* the next business day whose cut-off is still ahead of us */
function nextOpenDay(hour){
  const now=brisNow(); let d=new Date(now);
  if (isWeekend(d) || now.getHours()>=hour) d=addBiz(d,1);
  return d;
}
/* A plain-English line for the speed the customer is looking at. */
function dispatchLine(speed){
  const now=brisNow();
  if (speed==='sameday'){
    if (!isWeekend(now) && now.getHours()<8)
      return '⚡ Order and approve artwork before <b>8am today</b> and it dispatches <b>today, '+fmtDay(now)+'</b>.';
    const d=nextOpenDay(8);
    /* on a weekend there was no cut-off today, so do not claim one passed */
    const lead = isWeekend(now) ? '' : 'Today’s 8am cut-off has passed. ';
    return '⚡ '+lead+'Order before <b>8am '+fmtDay(d)+'</b> for dispatch that day.';
  }
  if (speed==='nextday'){
    if (!isWeekend(now) && now.getHours()<12)
      return '⏩ Order and approve artwork before <b>12pm today</b> for dispatch <b>'+fmtDay(addBiz(now,1))+'</b>.';
    const d=nextOpenDay(12);
    return '⏩ Order before <b>12pm '+fmtDay(d)+'</b> for dispatch <b>'+fmtDay(addBiz(d,1))+'</b>.';
  }
  const start = isWeekend(now) ? addBiz(now,1) : now;
  return '🚚 Standard production dispatches in <b>3-5 business days</b>, about <b>'+fmtDay(addBiz(start,3))+' to '+fmtDay(addBiz(start,5))+'</b>.';
}
window.AuraTurn = { speeds:TURN_SPEEDS, dispatchLine:dispatchLine, fmtDay:fmtDay, addBiz:addBiz, now:brisNow };

/* The bar itself is written into each page as plain HTML so crawlers read the
   cut-offs. This only adds the live dispatch date on top of it. */
function wireTurnaround(){
  document.querySelectorAll('[data-aura-turnaround]').forEach(function(el){
    const live = el.querySelector('.turn-live');
    if (live) live.innerHTML = dispatchLine(el.getAttribute('data-aura-turnaround') || 'standard');
  });
}

document.addEventListener('DOMContentLoaded', function(){
  wireAnalytics();

  /* The header and footer are now written into every page's HTML, so the menu
     and the footer links exist before any JavaScript runs. Search engines and
     the AI crawlers that do not execute scripts can finally see the whole link
     structure of the site.

     The two lines below are only a safety net. If a page has not been rebuilt
     with the static markup yet, it still gets a menu. Once every page carries
     it, these never fire. */
  if (!document.querySelector('nav.main')) document.body.insertAdjacentHTML('afterbegin', HEADER);
  if (!document.querySelector('footer'))   document.body.insertAdjacentHTML('beforeend', FOOTER);

  wireForms();
  wireDrawer();
  fillEmails();
  wireNewsletter();
  wireTurnaround();

  /* marquee helper (if page has one) */
  const m=document.getElementById('marq'); if(m) m.innerHTML+=m.innerHTML;
});
})();
