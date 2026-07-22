/* AURA PRINT & PROMO - business-card configurator (v2, LEP-driven).
   Prices are LIVE from Supabase public.bc_prices (source='real'), keyed by
   stock + finish + corners + sides + quantity + turnaround (Standard / Next
   Day / Same Day). Options enable/grey-out to match what LEP actually offers
   for the chosen speed. No prices live in this file. If a combination has no
   row, we show POA and route to the quote form - we never invent a number.
   Wholesale cost + margin live in staff-only data and never reach the browser. */
(function () {
  var CFG = window.AURA_CONFIG || {};
  var host = document.getElementById('bc-config');
  if (!host) return;

  var SPEEDS = [
    { key: 'standard', label: 'Standard' },
    { key: 'nextday',  label: 'Next Day' },
    { key: 'sameday',  label: 'Same Day' }
  ];
  var STOCKS = [
    { val: 'Deluxe 310gsm', label: '310gsm Deluxe Artboard', group: 'Deluxe Artboard' },
    { val: 'Deluxe 360gsm', label: '360gsm Deluxe Artboard', group: 'Deluxe Artboard' },
    { val: 'Deluxe 420gsm', label: '420gsm Deluxe Artboard', group: 'Deluxe Artboard' },
    { val: 'Speciality White Felt 300gsm', label: 'White Felt 300gsm', group: 'Speciality' },
    { val: 'Speciality White Linen 300gsm', label: 'White Linen 300gsm', group: 'Speciality' },
    { val: 'Speciality Eggshell Ultra White 324gsm', label: 'Eggshell Ultra White 324gsm', group: 'Speciality' },
    { val: 'Speciality Superfine Smooth 324gsm', label: 'Superfine Smooth 324gsm', group: 'Speciality' },
    { val: 'Speciality Knight Smooth 325gsm', label: 'Knight Smooth 325gsm', group: 'Speciality' },
    { val: 'Speciality Yupo Flexi 410gsm', label: 'Yupo Flexi 410gsm (synthetic)', group: 'Speciality' },
    { val: 'Loyalty Card', label: 'Loyalty Card stock', group: 'Loyalty' }
  ];
  var FINISHES = [
    { val: 'Uncoated', label: 'Uncoated', sub: 'No laminate' },
    { val: 'Matt cello', label: 'Matt cello', sub: 'Soft matt laminate' },
    { val: 'Gloss cello', label: 'Gloss cello', sub: 'High gloss laminate' },
    { val: 'Velvet cello', label: 'Velvet', sub: 'Soft-touch suede feel' }
  ];
  var CORNERS = [
    { val: 'Square', label: 'Square corners' },
    { val: 'Rounded', label: 'Rounded corners' }
  ];
  var SIDES = [
    { val: '2S', label: 'Double sided' },
    { val: '1S', label: 'Single sided' }
  ];
  var QTYS = [100, 250, 500, 1000, 2500, 5000];

  var DIMS = ['turnaround', 'stock', 'finish', 'corners', 'sides', 'qty'];
  var ORDER = { turnaround: SPEEDS.map(function (s) { return s.key; }), stock: STOCKS.map(function (s) { return s.val; }), finish: FINISHES.map(function (f) { return f.val; }), corners: CORNERS.map(function (c) { return c.val; }), sides: SIDES.map(function (s) { return s.val; }), qty: QTYS };

  var ROWS = null, loadFailed = false, PRICE = {};

  // sensible defaults from the page (budget vs premium vs velvet)
  var tier = host.getAttribute('data-tier') || 'premium';
  var presetStock = host.getAttribute('data-stock') || '';
  var sel = { turnaround: 'standard', stock: 'Deluxe 360gsm', finish: (tier === 'budget' ? 'Uncoated' : 'Matt cello'), corners: 'Square', sides: '2S', qty: 500 };
  if (/velvet/i.test(presetStock)) sel.finish = 'Velvet cello';

  function key(s) { return [s.turnaround, s.stock, s.finish, s.corners, s.sides, Number(s.qty)].join('|'); }

  // distinct values of `dim` among rows matching every key in `con`
  function distinctVals(con, dim) {
    var out = {};
    if (!ROWS) return out;
    for (var i = 0; i < ROWS.length; i++) {
      var r = ROWS[i], ok = true;
      for (var k in con) { if (String(r[k]) !== String(con[k])) { ok = false; break; } }
      if (ok) out[String(r[dim])] = true;
    }
    return out;
  }

  // Keep the dimension the user just clicked (`locked`) and rebuild the rest in
  // priority order: for each other dim, keep its value if it's still valid given
  // the locked + already-decided dims, else drop to the first available. This
  // never reverts the user's click and always lands on a real, priced combo.
  function reconcile(locked) {
    var com = {};
    if (locked) com[locked] = sel[locked];
    for (var d = 0; d < DIMS.length; d++) {
      var dim = DIMS[d];
      if (dim === locked) continue;
      var av = distinctVals(com, dim);
      if (!av[String(sel[dim])]) {
        var pick = ORDER[dim].filter(function (v) { return av[String(v)]; })[0];
        if (pick !== undefined) sel[dim] = (dim === 'qty' ? Number(pick) : pick);
      }
      com[dim] = sel[dim];
    }
  }

  function optBtns(dim, items, avail) {
    return '<div class="opts" data-dim="' + dim + '">' + items.filter(function (it) {
      return avail[String(it.val)];
    }).map(function (it) {
      var on = String(it.val) === String(sel[dim]) ? ' on' : '';
      var sub = it.sub ? ' <span class="opt-sub">' + it.sub + '</span>' : '';
      return '<button type="button" class="opt' + on + '" data-val="' + it.val + '">' + it.label + sub + '</button>';
    }).join('') + '</div>';
  }

  function stockSelect(avail) {
    var groups = ['Deluxe Artboard', 'Speciality', 'Loyalty'], html = '';
    groups.forEach(function (g) {
      var items = STOCKS.filter(function (s) { return s.group === g && avail[s.val]; });
      if (!items.length) return;
      html += '<optgroup label="' + g + '">' + items.map(function (s) {
        var s2 = String(s.val) === String(sel.stock) ? ' selected' : '';
        return '<option value="' + s.val + '"' + s2 + '>' + s.label + '</option>';
      }).join('') + '</optgroup>';
    });
    return '<select id="bc-stock" style="width:100%;padding:12px 14px;border:1px solid var(--aura-line,#e5e1db);border-radius:10px;font-size:15px;background:#fff">' + html + '</select>';
  }

  function money(cents) { return '$' + Math.round(cents / 100).toLocaleString(); }

  function quoteHref() {
    return 'quote.html?product=business-cards&speed=' + sel.turnaround +
      '&stock=' + encodeURIComponent(sel.stock) + '&finish=' + encodeURIComponent(sel.finish) +
      '&corners=' + sel.corners + '&sides=' + sel.sides + '&qty=' + sel.qty;
  }

  function dispatchNote() {
    if (sel.turnaround === 'sameday') return '⚡ Same-day production when print-ready artwork is approved before 11am (business days).';
    if (sel.turnaround === 'nextday') return '⏩ Next business day production once artwork is approved.';
    return '🚚 Standard production, about 3-5 business days after proof approval, plus delivery.';
  }

  function render(locked) {
    if (loadFailed) { host.innerHTML = '<div class="price-box"><div><div class="from">Live pricing is unavailable right now</div></div><div class="amount grad-text">POA</div></div><div style="margin-top:14px"><a class="btn btn-aura" href="quote.html?product=business-cards">Get a fast quote &rarr;</a></div>'; return; }
    if (!ROWS) { host.innerHTML = '<div id="priceNote" style="color:#8a847d">Loading live pricing…</div>'; return; }

    reconcile(locked);
    // show each dim filtered only by the dims BEFORE it in priority order, so the
    // primary choices (speed, stock) always show every option and never hide.
    function shownVals(i) { var con = {}; for (var j = 0; j < i; j++) con[DIMS[j]] = sel[DIMS[j]]; return distinctVals(con, DIMS[i]); }
    var aTurn = shownVals(0), aStock = shownVals(1), aFin = shownVals(2),
        aCor = shownVals(3), aSide = shownVals(4), aQty = shownVals(5);

    var row = PRICE[key(sel)];
    var priceHtml = '<div class="amount grad-text" id="price">' + (row ? money(row) : 'POA') + '</div>';

    host.innerHTML =
      '<div class="optlabel">Production speed</div>' +
      optBtns('turnaround', SPEEDS.map(function (s) { return { val: s.key, label: s.label }; }), aTurn) +
      '<div class="optlabel">Stock</div>' + stockSelect(aStock) +
      '<div class="optlabel" style="margin-top:16px">Finish</div>' + optBtns('finish', FINISHES, aFin) +
      '<div class="optlabel">Corners</div>' + optBtns('corners', CORNERS, aCor) +
      '<div class="optlabel">Sides</div>' + optBtns('sides', SIDES, aSide) +
      '<div class="optlabel">Quantity</div>' + optBtns('qty', QTYS.map(function (q) { return { val: q, label: q }; }), aQty) +
      '<div class="price-box" style="margin-top:26px"><div><div class="from">Your price</div>' +
        '<div class="gst" id="gstLabel" style="font-size:13px;color:#8a847d">' + (row ? 'inc. GST &amp; delivery' : 'get a quick quote') + '</div></div>' + priceHtml + '</div>' +
      '<div id="priceNote" style="font-size:13px;color:#8a847d;margin-top:10px">' +
        (row ? '<span style="color:#2f7d4f;font-weight:700">✓ Confirmed price.</span> Includes GST and standard delivery Australia-wide.'
             : 'That exact combination is a custom quote. Send it through and we’ll price it fast.') + '</div>' +
      '<div id="dispatch" style="font-size:13px;color:#6b6560;margin-top:8px">' + dispatchNote() + '</div>' +
      '<div style="display:flex;gap:12px;margin-top:18px;flex-wrap:wrap">' +
        '<a class="btn btn-aura" id="orderCta" href="' + quoteHref() + (row ? '&price=' + Math.round(row / 100) : '') + '" style="flex:1;text-align:center;min-width:220px">Get a quote &amp; upload artwork &rarr;</a>' +
      '</div>' +
      '<p style="font-size:12.5px;color:#8a847d;margin-top:12px">Prices are read live from our current supplier rates and include GST and standard delivery. 90 x 55mm cards. You approve a digital proof before anything prints.</p>';
  }

  // event delegation (host persists across re-renders)
  host.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('.opt') : null; if (!btn) return;
    var group = btn.closest('.opts'); if (!group) return;
    var dim = group.getAttribute('data-dim'), val = btn.getAttribute('data-val');
    sel[dim] = (dim === 'qty' ? Number(val) : val);
    render(dim);
  });
  host.addEventListener('change', function (e) {
    if (e.target && e.target.id === 'bc-stock') { sel.stock = e.target.value; render('stock'); }
  });

  function loadPrices() {
    if (!CFG.supabaseUrl || !CFG.supabaseKey) { loadFailed = true; render(); return; }
    var url = CFG.supabaseUrl + '/rest/v1/bc_prices?select=stock,finish,corners,sides,qty,price_cents,turnaround&source=eq.real';
    fetch(url, { headers: { apikey: CFG.supabaseKey, Authorization: 'Bearer ' + CFG.supabaseKey } })
      .then(function (r) { if (!r.ok) throw new Error('price feed ' + r.status); return r.json(); })
      .then(function (rows) {
        ROWS = rows.filter(function (r) { return r.finish !== '(legacy)'; });
        PRICE = {};
        ROWS.forEach(function (r) { PRICE[[r.turnaround, r.stock, r.finish, r.corners, r.sides, Number(r.qty)].join('|')] = r.price_cents; });
        render();
      })
      .catch(function (err) { console.error('[aura] bc pricing failed:', err); loadFailed = true; render(); });
  }

  render();       // loading state
  loadPrices();
})();
