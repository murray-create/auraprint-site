/* Letterbox area picker.  assets/lb-picker.js
 *
 * Progressive enhancement on the suburb tables in letterbox-distribution-*.html.
 * The table, every count and the totals are already in the HTML, so the page is
 * complete and crawlable with JavaScript off. This file adds:
 *   - search by suburb name or postcode
 *   - tick/untick suburbs, with the letterbox total and price updating live
 *   - an option to include business letterboxes
 *   - search beyond the area, straight against um_delivery_points
 *   - a Book button that carries the ticked suburbs into the booking form
 *
 * PRICE: always cost / (1 - margin). The rate comes live from um_rates and the
 * margin from AURA_CONFIG.letterbox.margin. The raw um_rates figure is Aura's
 * COST and is never displayed. If the fetch fails the printed fallback stands.
 */
(function () {
  'use strict';
  var root = document.getElementById('lbPick');
  if (!root) return;

  var CFG   = window.AURA_CONFIG || {};
  var LBC   = CFG.letterbox || {};
  var MARGIN = typeof LBC.margin === 'number' ? LBC.margin : 0.15;
  var sell  = Number(root.getAttribute('data-sell')) || 0.4765;   // dollars/letterbox
  var MINFEE = LBC.minFee || 250;

  var tbody   = root.querySelector('tbody');
  var search  = document.getElementById('lbPickSearch');
  var busChk  = document.getElementById('lbPickBus');
  var elN     = document.getElementById('lbPickN');
  var elHomes = document.getElementById('lbPickHomes');
  var elCost  = document.getElementById('lbPickCost');
  var elRate  = document.getElementById('lbPickRate');
  var elGo    = document.getElementById('lbPickGo');
  var elNote  = document.getElementById('lbPickNote');
  var elExtra = document.getElementById('lbPickExtra');
  if (!tbody) return;

  function rows()   { return [].slice.call(tbody.querySelectorAll('tr[data-loc]')); }
  function n(v)     { return (v || 0).toLocaleString('en-AU'); }
  function money(v) { return '$' + Math.round(v).toLocaleString('en-AU'); }
  function titled(t){ return t.toLowerCase().replace(/\b[a-z]/g, function (c) { return c.toUpperCase(); }); }

  /* ---------------------------------------------------------- totals ---- */
  function recalc() {
    var withBus = !!(busChk && busChk.checked), picked = [], homes = 0;
    rows().forEach(function (tr) {
      var cb = tr.querySelector('input[type=checkbox]');
      if (!cb || !cb.checked) return;
      picked.push(tr.getAttribute('data-loc'));
      homes += (+tr.getAttribute('data-res') || 0);
      if (withBus) homes += (+tr.getAttribute('data-bus') || 0);
    });
    var cost = homes * sell;
    if (elN)     elN.textContent     = picked.length + ' suburb' + (picked.length === 1 ? '' : 's');
    if (elHomes) elHomes.textContent = n(homes);
    if (elCost)  elCost.textContent  = homes ? money(Math.max(cost, MINFEE)) : '$0';
    if (elNote) {
      elNote.textContent = !homes
        ? 'Tick at least one suburb to see a price.'
        : (cost < MINFEE
            ? 'Delivery-only jobs carry a minimum charge of $' + MINFEE + '. That minimum applies to this run. It is waived when we print the flyer as well.'
            : 'Delivery only, GST included. Printing is quoted on top. A minimum charge of $' + MINFEE + ' applies to delivery-only jobs.');
    }
    if (elGo) {
      elGo.href = 'letterbox-distribution.html'
        + (picked.length ? '?suburbs=' + picked.map(encodeURIComponent).join(',') : '');
      elGo.setAttribute('aria-disabled', picked.length ? 'false' : 'true');
    }
  }

  /* ---------------------------------------------------------- search ---- */
  var t = null;
  function filter() {
    var q = (search && search.value || '').trim().toLowerCase();
    var hit = 0;
    rows().forEach(function (tr) {
      var ok = !q
        || tr.getAttribute('data-loc').indexOf(q) > -1
        || tr.getAttribute('data-pc').indexOf(q) === 0;
      tr.hidden = !ok;
      if (ok) hit++;
    });
    var tot = root.querySelector('tr.tot');
    if (tot) tot.hidden = !!q;
    if (!elExtra) return;
    elExtra.innerHTML = '';
    if (q.length < 3) return;
    /* A postcode always gets the full picture, because one postcode can span
       two of our areas. Otherwise only look further afield if nothing matched. */
    if (/^\d{4}$/.test(q) || !hit) lookup(q, hit);
    else elExtra.innerHTML =
      '<p class="lb-hint">Not the area you want? <a href="letterbox-distribution.html?suburbs='
      + encodeURIComponent(q) + '" style="text-decoration:underline">Search every Sunshine Coast suburb</a>'
      + ' or <a href="letterbox-distribution-australia.html" style="text-decoration:underline">book any postcode in Australia</a>.</p>';
  }
  if (search) search.addEventListener('input', function () {
    clearTimeout(t); t = setTimeout(filter, 120);
  });

  /* Nothing in this area matched, so ask the delivery point table directly.
     Lets someone on the Caloundra page type 4556 and still get an answer. */
  function lookup(q, hadLocalHits) {
    if (!CFG.supabaseUrl || !CFG.supabaseKey) return;
    var isPc = /^\d{3,4}$/.test(q);
    var here = {};
    rows().forEach(function (tr) { here[tr.getAttribute('data-loc')] = 1; });
    var sel = 'um_delivery_points?select=postcode,locality,priv_st,priv_rsd,bus_st,bus_rsd&state=eq.QLD&limit=20&'
            + (isPc ? 'postcode=eq.' + q : 'locality=ilike.*' + encodeURIComponent(q) + '*');
    elExtra.innerHTML = '<p class="lb-hint">Looking that up…</p>';
    fetch(CFG.supabaseUrl + '/rest/v1/' + sel,
          { headers: { apikey: CFG.supabaseKey, Authorization: 'Bearer ' + CFG.supabaseKey } })
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (j) {
        var found = (j || []).map(function (x) {
          return { pc: x.postcode, loc: titled(x.locality),
                   res: (x.priv_st | 0) + (x.priv_rsd | 0),
                   bus: (x.bus_st | 0) + (x.bus_rsd | 0) };
        }).filter(function (x) { return x.res > 0 && !here[x.loc.toLowerCase()]; });
        if (!found.length) {
          elExtra.innerHTML = hadLocalHits ? ''
            : '<p class="lb-hint">No Sunshine Coast suburb matches that. '
              + 'We deliver to <a href="letterbox-distribution-australia.html" style="text-decoration:underline">any postcode in Australia</a>, '
              + 'so tell us where and we will price it.</p>';
          return;
        }
        var extraHomes = found.reduce(function (t, x) { return t + x.res; }, 0);
        elExtra.innerHTML =
          '<p class="lb-hint">' + (hadLocalHits
            ? 'The rest of ' + q + ' sits in another area. ' + n(extraHomes)
              + ' more letterboxes, and we can put them in the same booking:'
            : 'Outside this area, but we deliver there too:') + '</p>'
          + '<div class="lb-cards">' + found.map(function (x) {
              return '<a class="lb-card" href="letterbox-distribution.html?suburbs='
                + encodeURIComponent(x.loc.toLowerCase()) + '"><b>' + x.loc + ' ' + x.pc + '</b>'
                + '<span>' + n(x.res) + ' letterboxes &middot; about ' + money(Math.max(x.res * sell, MINFEE)) + ' to deliver</span></a>';
            }).join('') + '</div>';
      })
      .catch(function () { elExtra.innerHTML = ''; });
  }

  /* ------------------------------------------------- live rate + wiring -- */
  root.addEventListener('change', function (e) {
    if (e.target && e.target.type === 'checkbox') recalc();
  });
  var all = document.getElementById('lbPickAll');
  if (all) all.addEventListener('click', function () {
    var vis = rows().filter(function (r) { return !r.hidden; });
    var turnOn = vis.some(function (r) { return !r.querySelector('input').checked; });
    vis.forEach(function (r) { r.querySelector('input').checked = turnOn; });
    all.textContent = turnOn ? 'Clear all' : 'Select all';
    recalc();
  });

  if (CFG.supabaseUrl && CFG.supabaseKey) {
    fetch(CFG.supabaseUrl + '/rest/v1/um_rates?select=price&service=eq.standard&size=eq.small'
          + '&weight_band=eq.to50&scope=eq.same_state&order=effective_from.desc&limit=1',
          { headers: { apikey: CFG.supabaseKey, Authorization: 'Bearer ' + CFG.supabaseKey } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        var cost = j && j[0] && Number(j[0].price);
        if (!cost) return;
        sell = cost / (1 - MARGIN);
        if (elRate) elRate.textContent = (sell * 100).toFixed(1).replace(/\.0$/, '') + 'c';
        recalc();
      })
      .catch(function () {});
  }

  recalc();
})();
