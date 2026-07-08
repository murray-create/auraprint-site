/* AURA PRINT & PROMO - shared business-card configurator.
   One tier-aware price selector used by both budget-business-cards.html and
   business-cards.html. A Budget / Premium switch keeps each tier on its own
   URL (good for SEO and ad targeting) while letting a customer flip tiers in
   one click, carrying their sides + quantity across.

   Prices are derived from real supplier costs with Aura's markup rules:
     - Budget stocks: LEP Colour Printers cost (harvested 4 Jul 2026) at 50%.
     - Premium matt/gloss laminate: CMYKhub cost at 50% (same wholesale, same price).
     - Premium 400gsm: CMYKhub cost at 60% (slight uplift for the thicker stock).
     - NV Velvet Soft-Touch: CMYKhub cost at 75% (luxury positioning).
   Costs and margins never reach the browser - only the final inc-GST price.
   In production, swap PRICES for the Supabase bc_prices feed. */
(function () {
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
      def: { stock: '310 GSM Deluxe Artboard', sides: '2S', qty: 500 },
      prices: {
        '310 GSM Deluxe Artboard': { '1S': { 100: 48, 250: 53, 500: 55, 1000: 69 }, '2S': { 100: 53, 250: 56, 500: 63, 1000: 76 } },
        '360 GSM Deluxe Artboard': { '1S': { 100: 43, 250: 47, 500: 56, 1000: 73 }, '2S': { 100: 50, 250: 59, 500: 77, 1000: 102 } },
        '420 GSM Deluxe Artboard': { '1S': { 100: 59, 250: 64, 500: 73, 1000: 90 }, '2S': { 100: 64, 250: 73, 500: 92, 1000: 110 } }
      }
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
      def: { stock: 'Matt Laminate', sides: '2S', qty: 500 },
      prices: {
        'Matt Laminate': { '1S': { 250: 92, 500: 99, 1000: 132, 2500: 221, 5000: 372 }, '2S': { 250: 99, 500: 105, 1000: 139, 2500: 233, 5000: 392 } },
        'Gloss Laminate': { '1S': { 250: 92, 500: 99, 1000: 132, 2500: 221, 5000: 372 }, '2S': { 250: 99, 500: 105, 1000: 139, 2500: 233, 5000: 392 } },
        'Premium 400gsm': { '1S': { 250: 99, 500: 106, 1000: 141, 2500: 237, 5000: 396 }, '2S': { 250: 106, 500: 112, 1000: 147, 2500: 249, 5000: 418 } },
        'Velvet Soft-Touch': { '1S': { 250: 109, 500: 116, 1000: 155, 2500: 258, 5000: 433 }, '2S': { 250: 116, 500: 122, 1000: 162, 2500: 272, 5000: 457 } }
      }
    }
  };
  var SIDES = [{ val: '1S', label: 'Single sided' }, { val: '2S', label: 'Double sided' }];

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
    '<div id="priceNote" style="font-size:13px;color:#8a847d;margin-top:10px"></div>' +
    '<div id="dispatch" style="font-size:13px;color:#6b6560;margin-top:10px"></div>' +
    '<div style="display:flex;gap:12px;margin-top:18px;flex-wrap:wrap">' +
      '<a class="btn btn-aura" id="orderCta" href="quote.html?product=' + tier.product + '" style="flex:1;text-align:center;min-width:220px">Get a quote &amp; upload artwork →</a>' +
    '</div>' +
    '<p style="font-size:12.5px;color:#8a847d;margin-top:12px">Live pricing from real supplier rates. Prices include GST and standard delivery Australia-wide.</p>';

  var priceEl = host.querySelector('#price'), noteEl = host.querySelector('#priceNote'),
      gstEl = host.querySelector('#gstLabel'), cta = host.querySelector('#orderCta');

  function animateTo(v) {
    var start = parseFloat(priceEl.dataset.v || 0), t0 = performance.now();
    (function tick(t) {
      var k = Math.min(1, (t - t0) / 300);
      priceEl.textContent = '$' + Math.round(start + (v - start) * k).toLocaleString();
      if (k < 1) requestAnimationFrame(tick); else priceEl.dataset.v = v;
    })(performance.now());
  }

  function refreshTierLink() {
    var a = host.querySelector('.tier-switch a.tier');
    if (a) {
      var other = TIERS[tier.other];
      a.setAttribute('href', other.page + '?sides=' + currentSides() + '&qty=' + nearest(currentQty(), other.qtys));
    }
  }

  function calc() {
    var stock = currentStock(), sides = currentSides(), qty = currentQty();
    var map = tier.prices[stock], p = map && map[sides] && map[sides][qty];
    if (p) {
      gstEl.textContent = 'inc. GST & delivery';
      animateTo(p); noteEl.textContent = '';
      cta.href = 'quote.html?product=' + tier.product + '&stock=' + encodeURIComponent(stock) + '&sides=' + sides + '&qty=' + qty + '&price=' + p;
    } else {
      priceEl.dataset.v = 0; priceEl.textContent = 'POA'; gstEl.textContent = '';
      noteEl.innerHTML = 'That combination isn’t online yet. <a href="quote.html?product=' + tier.product + '">Get a fast quote →</a>';
      cta.href = 'quote.html?product=' + tier.product;
    }
    refreshTierLink();
  }

  host.querySelectorAll('.opts').forEach(function (g) {
    g.addEventListener('click', function (e) {
      var btn = e.target.closest('.opt'); if (!btn) return;
      g.querySelectorAll('.opt').forEach(function (o) { o.classList.remove('on'); });
      btn.classList.add('on'); calc();
    });
  });
  calc();

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
