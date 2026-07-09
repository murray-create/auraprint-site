/* AURA PRINT & PROMO - shared business-card configurator.
   One tier-aware price selector used by both budget-business-cards.html and
   business-cards.html. A Budget / Premium switch keeps each tier on its own
   URL (good for SEO and ad targeting) while letting a customer flip tiers in
   one click, carrying their sides + quantity across.

   PRICING IS LIVE. Every price is read at page load from the Supabase
   public.bc_prices table (anon SELECT only, enforced by row-level security).
   There are no prices in this file. Wholesale cost, supplier and margin live
   in staff-only tables and never reach the browser.

   Each price row carries a `source`:
     real     = reconciled against Murray's actual supplier invoices.
     estimate = derived from harvested supplier trade lists. Shown to the
                customer as an indicative price, confirmed on their proof
                before they pay. Never presented as a locked price.

   If a stock/sides/quantity combination has no row, or the price feed cannot
   be reached, we show POA and route to the quote form. We never invent or
   cache a number. */
(function () {
  var CFG = window.AURA_CONFIG || {};

  var TIERS = {
    budget: {
      key: 'budget',
      label: 'Budget',
      other: 'premium',
      page: 'budget-business-cards.html',
      product: 'budget-business-cards',
      blurb: 'Ink on quality artboard, no coatings. Best value.',
      stocks: [
        { val: '310 GSM Deluxe Artboard', label: '310gsm', sub: 'Standard' },
        { val: '360 GSM Deluxe Artboard', label: '360gsm', sub: 'Medium' },
        { val: '420 GSM Deluxe Artboard', label: '420gsm', sub: 'Extra thick' }
      ],
      qtys: [100, 250, 500, 1000],
      def: { stock: '310 GSM Deluxe Artboard', sides: '2S', qty: 500 }
    },
    premium: {
      key: 'premium',
      label: 'Premium',
      other: 'budget',
      page: 'business-cards.html',
      product: 'business-cards',
      blurb: 'Laminates, velvet soft-touch, Spot UV & foil.',
      stocks: [
        { val: 'Matt Laminate', label: 'Matt Laminate', sub: '350gsm' },
        { val: 'Gloss Laminate', label: 'Gloss Laminate', sub: '450+' },
        { val: 'Premium 400gsm', label: 'Premium 400gsm', sub: 'Thick' },
        { val: 'Velvet Soft-Touch', label: 'Velvet Soft-Touch', sub: 'NV luxe' }
      ],
      qtys: [250, 500, 1000, 2500, 5000],
      def: { stock: 'Matt Laminate', sides: '2S', qty: 500 }
    }
  };
  var SIDES = [{ val: '1S', label: 'Single sided' }, { val: '2S', label: 'Double sided' }];

  /* PRICES[stock][sides][qty] = { cents: int, source: 'real'|'estimate' } */
  var PRICES = null;
  var loadFailed = false;

  function qsParam(k) { return new URLSearchParams(location.search).get(k); }
  function nearest(target, arr) {
    return arr.reduce(function (a, b) { return Math.abs(b - target) < Math.abs(a - target) ? b : a; });
  }

  var host = document.getElementById('bc-config');
  if (!host) return;
  var tier = TIERS[host.getAttribute('data-tier')] || TIERS.budget;

  // Preset sides + qty carried from a tier switch (falls back to tier defaults).
  var startSides = (qsParam('sides') === '1S' || qsParam('sides') === '2S') ? qsParam('sides') : tier.def.sides;
  var startQty = parseInt(qsParam('qty'), 10);
  startQty = (tier.qtys.indexOf(startQty) >= 0) ? startQty : tier.def.qty;
  var startStock = tier.def.stock;

  function optBtns(group, items, activeVal, render) {
    return '<div class="opts" data-group="' + group + '">' + items.map(function (it) {
      var val = (typeof it === 'object') ? it.val : it;
      return '<button class="opt' + (String(val) === String(activeVal) ? ' on' : '') + '" data-val="' + val + '">' + render(it) + '</button>';
    }).join('') + '</div>';
  }

  // Build the tier switch: current tier is a button, the other tier is a link
  // to its own page carrying the live sides + qty.
  function tierSwitch() {
    var other = TIERS[tier.other];
    function chip(t, isActive) {
      if (isActive) return '<button class="tier on" aria-current="page">' + t.label + '</button>';
      var q = nearest(currentQty(), other.qtys);
      return '<a class="tier" href="' + t.page + '?sides=' + currentSides() + '&qty=' + q + '">' + t.label + '</a>';
    }
    return '<div class="tier-switch">' + chip(tier, true) + chip(other, false) + '</div>';
  }

  function currentSides() { var b = host.querySelector('.opts[data-group="sides"] .on'); return b ? b.dataset.val : startSides; }
  function currentQty() { var b = host.querySelector('.opts[data-group="qty"] .on'); return b ? parseInt(b.dataset.val, 10) : startQty; }
  function currentStock() { var b = host.querySelector('.opts[data-group="stock"] .on'); return b ? b.dataset.val : startStock; }

  host.innerHTML =
    tierSwitch() +
    '<div class="optlabel">Stock</div>' +
    optBtns('stock', tier.stocks, startStock, function (s) { return s.label + (s.sub ? ' <span class="opt-sub">' + s.sub + '</span>' : ''); }) +
    '<div class="optlabel">Sides</div>' +
    optBtns('sides', SIDES, startSides, function (s) { return s.label; }) +
    '<div class="optlabel">Quantity</div>' +
    optBtns('qty', tier.qtys, startQty, function (q) { return q; }) +
    '<div class="price-box" style="margin-top:28px">' +
      '<div><div class="from">Your price</div><div class="gst" id="gstLabel">inc. GST &amp; delivery</div></div>' +
      '<div class="amount grad-text" id="price">—</div>' +
    '</div>' +
    '<div id="priceNote" style="font-size:13px;color:#8a847d;margin-top:10px">Loading live pricing…</div>' +
    '<div id="dispatch" style="font-size:13px;color:#6b6560;margin-top:10px"></div>' +
    '<div style="display:flex;gap:12px;margin-top:18px;flex-wrap:wrap">' +
      '<a class="btn btn-aura" id="orderCta" href="quote.html?product=' + tier.product + '" style="flex:1;text-align:center;min-width:220px">Get a quote &amp; upload artwork →</a>' +
    '</div>' +
    '<p style="font-size:12.5px;color:#8a847d;margin-top:12px">Prices are read live from our current supplier rates and include GST and standard delivery Australia-wide.</p>';

  var priceEl = host.querySelector('#price'), noteEl = host.querySelector('#priceNote'),
      gstEl = host.querySelector('#gstLabel'), cta = host.querySelector('#orderCta');

  /* Count-up is decoration only. The true value is written immediately and
     re-asserted on a timer, so a throttled requestAnimationFrame (background
     tab, reduced motion, slow device) can never leave a wrong number - such
     as $0 - on screen. */
  function setPrice(v) { priceEl.textContent = '$' + Math.round(v).toLocaleString(); }

  function animateTo(v) {
    var start = parseFloat(priceEl.dataset.v) || 0;
    priceEl.dataset.v = v;

    if (document.hidden || start === v) { setPrice(v); return; }

    var t0 = performance.now(), done = false;
    setTimeout(function () { if (!done && parseFloat(priceEl.dataset.v) === v) setPrice(v); }, 400);
    (function tick(t) {
      if (parseFloat(priceEl.dataset.v) !== v) return; // superseded by a newer selection
      var k = Math.min(1, (t - t0) / 300);
      setPrice(start + (v - start) * k);
      if (k < 1) requestAnimationFrame(tick); else { done = true; setPrice(v); }
    })(performance.now());
  }

  function refreshTierLink() {
    var a = host.querySelector('.tier-switch a.tier');
    if (a) {
      var other = TIERS[tier.other];
      a.setAttribute('href', other.page + '?sides=' + currentSides() + '&qty=' + nearest(currentQty(), other.qtys));
    }
  }

  function quoteHref(stock, sides, qty) {
    return 'quote.html?product=' + tier.product +
           '&stock=' + encodeURIComponent(stock) + '&sides=' + sides + '&qty=' + qty;
  }

  /* No price available: never guess. Show POA and send them to a quote. */
  function showPoa(stock, sides, qty, message) {
    priceEl.dataset.v = 0; priceEl.textContent = 'POA'; gstEl.textContent = '';
    noteEl.innerHTML = message + ' <a href="' + quoteHref(stock, sides, qty) + '">Get a fast quote →</a>';
    cta.href = quoteHref(stock, sides, qty);
  }

  function calc() {
    var stock = currentStock(), sides = currentSides(), qty = currentQty();
    refreshTierLink();

    if (loadFailed) { showPoa(stock, sides, qty, 'Live pricing is unavailable right now.'); return; }
    if (!PRICES) return; // still loading

    var row = PRICES[stock] && PRICES[stock][sides] && PRICES[stock][sides][qty];
    if (!row) { showPoa(stock, sides, qty, 'That combination isn’t online yet.'); return; }

    var dollars = row.cents / 100;
    gstEl.textContent = 'inc. GST & delivery';
    animateTo(dollars);

    if (row.source === 'real') {
      noteEl.innerHTML = '<span style="color:#2f7d4f;font-weight:700">✓ Confirmed price.</span> This is what you pay.';
    } else {
      noteEl.innerHTML = '<b>Indicative price.</b> We confirm it on your proof, before you pay.';
    }

    cta.href = quoteHref(stock, sides, qty) + '&price=' + dollars.toFixed(2);
  }

  host.querySelectorAll('.opts').forEach(function (g) {
    g.addEventListener('click', function (e) {
      var btn = e.target.closest('.opt'); if (!btn) return;
      g.querySelectorAll('.opt').forEach(function (o) { o.classList.remove('on'); });
      btn.classList.add('on'); calc();
    });
  });

  /* ---- live price feed ---- */
  function loadPrices() {
    if (!CFG.supabaseUrl || !CFG.supabaseKey) { loadFailed = true; calc(); return; }
    var url = CFG.supabaseUrl + '/rest/v1/bc_prices?select=stock,sides,qty,price_cents,source&turnaround=eq.standard';
    fetch(url, { headers: { apikey: CFG.supabaseKey, Authorization: 'Bearer ' + CFG.supabaseKey } })
      .then(function (r) { if (!r.ok) throw new Error('price feed ' + r.status); return r.json(); })
      .then(function (rows) {
        var map = {};
        rows.forEach(function (r) {
          (map[r.stock] = map[r.stock] || {});
          (map[r.stock][r.sides] = map[r.stock][r.sides] || {});
          map[r.stock][r.sides][r.qty] = { cents: r.price_cents, source: r.source };
        });
        PRICES = map;
        calc();
      })
      .catch(function (err) {
        console.error('[aura] live pricing failed:', err);
        loadFailed = true; calc();
      });
  }
  loadPrices();

  /* Dynamic dispatch: 2 clear business days, 11am cutoff, skips weekends. */
  function isWeekend(d) { return d.getDay() === 0 || d.getDay() === 6; }
  function addBiz(from, n) { var d = new Date(from); while (n > 0) { d.setDate(d.getDate() + 1); if (!isWeekend(d)) n--; } return d; }
  function fmt(d) {
    var wd = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], mo = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return wd[d.getDay()] + ' ' + d.getDate() + ' ' + mo[d.getMonth()];
  }
  (function () {
    var now = new Date(), start = new Date(now), past = now.getHours() >= 11;
    if (isWeekend(now) || past) start = addBiz(now, 1);
    var disp = addBiz(start, 2), before = !isWeekend(now) && !past;
    host.querySelector('#dispatch').innerHTML = '🚚 ' + (before
      ? 'Approved artwork in before <b>11am today</b> for estimated dispatch <b>' + fmt(disp) + '</b>.'
      : 'Estimated dispatch <b>' + fmt(disp) + '</b> (2 business days from next working day).');
  })();
})();
