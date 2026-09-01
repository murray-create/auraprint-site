/* AURA PRINT — shared cart + shop helpers
   ----------------------------------------------------------------------
   The cart lives in the browser only. Prices held here are for DISPLAY;
   the server re-prices every line from the database at checkout, so a
   tampered cart can only get itself rejected. Never treat these numbers
   as authoritative.

   Requires assets/config.js (AURA_CONFIG.supabaseUrl / supabaseKey).
*/
(function (w) {
  'use strict';

  var CFG = w.AURA_CONFIG || {};
  var KEY = 'aura_cart_v1';
  var ORDER_KEY = 'aura_order_v1';
  var MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;   /* a stale cart is worse than none */
  var MAX_LINES = 20;

  /* ---------- storage (never let a broken cart break the page) ---------- */
  function read(key) {
    try {
      var raw = w.localStorage.getItem(key);
      if (!raw) return null;
      var o = JSON.parse(raw);
      if (o && o.at && (Date.now() - o.at) > MAX_AGE_MS) { w.localStorage.removeItem(key); return null; }
      return o;
    } catch (e) { return null; }
  }
  function write(key, val) {
    try { w.localStorage.setItem(key, JSON.stringify(val)); return true; }
    catch (e) { return false; }
  }

  function items() { var c = read(KEY); return (c && Array.isArray(c.items)) ? c.items : []; }
  function save(list) { return write(KEY, { at: Date.now(), items: list.slice(0, MAX_LINES) }); }
  function clear() { try { w.localStorage.removeItem(KEY); } catch (e) {} badge(); }

  function add(item) {
    var list = items();
    if (list.length >= MAX_LINES) return { ok: false, error: 'Your cart is full. Please check out first.' };
    list.push(item);
    if (!save(list)) return { ok: false, error: 'Your browser is blocking storage, so the cart cannot be saved.' };
    badge();
    return { ok: true, count: list.length };
  }
  function removeAt(i) { var l = items(); l.splice(i, 1); save(l); badge(); }
  function count() { return items().length; }
  function total() { return items().reduce(function (s, i) { return s + (i.price_cents || 0); }, 0); }

  /* ---------- the order handed back by checkout ---------- */
  function order() { var o = read(ORDER_KEY); return o && o.order_number ? o : null; }
  function setOrder(o) { o.at = Date.now(); write(ORDER_KEY, o); }
  function clearOrder() { try { w.localStorage.removeItem(ORDER_KEY); } catch (e) {} }

  /* ---------- formatting ---------- */
  function money(cents) {
    return '$' + (Math.round(cents) / 100).toLocaleString('en-AU',
      { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  /* "A5 · 150gsm Gloss · Single sided" from a spec object */
  function specLine(it) {
    var bits = [];
    if (it.spec) {
      ['size', 'stock', 'thickness', 'fold', 'sides'].forEach(function (k) {
        if (it.spec[k]) bits.push(it.spec[k]);
      });
      Object.keys(it.spec).forEach(function (k) {
        if (['size', 'stock', 'thickness', 'fold', 'sides'].indexOf(k) < 0) bits.push(it.spec[k]);
      });
    }
    ['stock', 'finish', 'corners', 'sides'].forEach(function (k) {
      if (it[k]) bits.push(k === 'sides' ? (it[k] === '2S' ? 'Double sided' : 'Single sided') : it[k]);
    });
    if (it.turnaround && it.turnaround !== 'standard') {
      bits.push(it.turnaround === 'sameday' ? 'Same day' : 'Next day');
    }
    return bits.join(' · ');
  }

  /* ---------- API ---------- */
  function fnUrl(name) { return (CFG.supabaseUrl || '') + '/functions/v1/' + name; }

  async function callFn(name, body) {
    var r, txt, data;
    try {
      r = await fetch(fnUrl(name), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
    } catch (e) {
      return { ok: false, error: 'We could not reach the server. Check your connection and try again.' };
    }
    txt = await r.text();
    try { data = txt ? JSON.parse(txt) : {}; } catch (e) { data = {}; }
    if (!r.ok) return { ok: false, error: data.error || 'Something went wrong. Please try again.' };
    return { ok: true, data: data };
  }

  /* Which products may be bought online right now. Public read by design. */
  var _rules = null;
  async function rules() {
    if (_rules) return _rules;
    try {
      var r = await fetch(CFG.supabaseUrl + '/rest/v1/product_online_rules' +
        '?select=product_slug,sellable_online,launch_wave,max_online_qty' +
        '&sellable_online=eq.true&launch_wave=eq.1',
        { headers: { apikey: CFG.supabaseKey, Authorization: 'Bearer ' + CFG.supabaseKey } });
      if (!r.ok) throw new Error('rules ' + r.status);
      var rows = await r.json();
      _rules = {};
      rows.forEach(function (x) { _rules[x.product_slug] = x; });
    } catch (e) {
      _rules = {};   /* fail closed: no Buy Now buttons rather than a broken one */
    }
    return _rules;
  }
  async function canBuy(slug, qty) {
    var R = await rules(), r = R[slug];
    if (!r) return false;
    if (r.max_online_qty != null && qty > r.max_online_qty) return false;
    return true;
  }

  /* ---------- cart indicator ----------
     A floating pill rather than a nav item, so this works on all 130 product
     pages without editing a single one of them. */
  function badge() {
    var n = count();

    document.querySelectorAll('[data-cart-count]').forEach(function (el) {
      el.textContent = n; el.style.display = n ? '' : 'none';
    });

    var here = (location.pathname || '').toLowerCase();
    var onCartPage = /(cart|checkout|order)(\.html)?$/.test(here);
    var pill = document.getElementById('auraCartPill');

    if (!n || onCartPage) { if (pill) pill.remove(); return; }

    if (!pill) {
      pill = document.createElement('a');
      pill.id = 'auraCartPill';
      pill.href = 'cart.html';
      pill.setAttribute('aria-label', 'View your cart');
      pill.style.cssText =
        'position:fixed;right:18px;bottom:18px;z-index:900;display:flex;align-items:center;gap:10px;' +
        'background:linear-gradient(100deg,#7C3AED,#EC4899 55%,#F97316);color:#fff;font-family:Inter,sans-serif;' +
        'font-weight:700;font-size:14.5px;padding:13px 20px;border-radius:999px;text-decoration:none;' +
        'box-shadow:0 10px 30px rgba(236,72,153,.4);transition:transform .2s';
      pill.onmouseenter = function () { pill.style.transform = 'translateY(-2px)'; };
      pill.onmouseleave = function () { pill.style.transform = ''; };
      document.body.appendChild(pill);
    }
    pill.innerHTML =
      '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" ' +
      'stroke-linecap="round" stroke-linejoin="round"><path d="M6 6h15l-1.5 9h-12z"/>' +
      '<path d="M6 6 5 2H2"/><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/></svg>' +
      '<span>Cart &middot; ' + n + ' item' + (n === 1 ? '' : 's') + ' &middot; ' + money(total()) + '</span>';
  }

  w.AuraCart = {
    items: items, add: add, removeAt: removeAt, clear: clear, count: count, total: total,
    order: order, setOrder: setOrder, clearOrder: clearOrder,
    money: money, esc: esc, specLine: specLine,
    callFn: callFn, rules: rules, canBuy: canBuy, badge: badge,
    MAX_LINES: MAX_LINES
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', badge);
  else badge();

})(window);
