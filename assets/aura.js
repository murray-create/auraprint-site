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
      <a class="rv-chip" href="https://www.google.com/maps/place/Aura+Print/@-26.8026348,153.0684397,931m/data=!4m6!3m5!1s0x483114dbbb836a6d:0x3365af4aa10f35bd!8m2!3d-26.8026348!4d153.0684397!16s%2Fg%2F11y38dgflm" target="_blank" rel="noopener" aria-label="Rated 5.0 out of 5 from 12 Google reviews"><span class="rv-chip-stars" aria-hidden="true">★★★★★</span><b>5.0</b><span class="rv-chip-n">12 Google reviews</span></a>
      <span class="tag">Sunshine Coast owned. Australia-wide delivery.</span>
    </div>
  </div>
</div>
<nav class="main">
  <div class="wrap">
    <a class="logo" href="/">AURA<span>PRINT</span></a>
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
      <div><a href="promo.html">Promo &amp; Uniforms ▾</a>
        <div class="mega">
          <div><h4>Drinkware &amp; Bags</h4><ul><li><a href="promotional-drink-bottles.html">Drink Bottles &amp; Tumblers</a></li><li><a href="promotional-mugs.html">Mugs &amp; Cups</a></li><li><a href="promotional-tote-bags.html">Tote &amp; Cooler Bags</a></li><li><a href="promotional-keyrings.html">Keyrings</a></li></ul></div>
          <div><h4>Ranges</h4><ul><li><a href="promo.html"><b>All 800+ products →</b></a></li><li><a href="eco-promotional-products.html">Eco Range</a></li><li><a href="australian-made-promotional-products.html">Australian Made</a></li><li><a href="event-merchandise.html">Event &amp; Tradeshow</a></li><li><a href="uniforms-workwear.html">Uniforms &amp; Merch</a></li></ul></div>
          <div><h4>Office &amp; Tech</h4><ul><li><a href="promotional-pens.html">Promotional Pens</a></li><li><a href="promotional-notebooks.html">Notebooks &amp; Journals</a></li><li><a href="custom-lanyards.html">Lanyards &amp; Badges</a></li><li><a href="promotional-tech.html">Tech &amp; Power Banks</a></li></ul></div>
          <div><h4>Magnets</h4><ul><li><a href="magnets.html">All Fridge Magnets →</a></li><li><a href="magnets.html">Business Card Magnets</a></li><li><a href="magnets.html">Photo Frame Magnets</a></li><li><a href="magnets.html">Whiteboard Magnets</a></li><li><a href="vehicle-magnets.html">Vehicle Magnets</a></li></ul></div>
        </div>
      </div>
      <div><a href="/#quoter">Instant Price</a></div>
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
    <a class="logo" href="/">AURA<span>PRINT</span></a>
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
      <button class="drawer-toggle" aria-expanded="false">Promo Products <span>▾</span></button>
      <ul class="drawer-sub" hidden>
        <li><a href="promo.html"><b>All 800+ products - price online →</b></a></li>
        <li><a href="promotional-pens.html">Promotional Pens</a></li>
        <li><a href="promotional-drink-bottles.html">Drink Bottles &amp; Tumblers</a></li>
        <li><a href="promotional-tote-bags.html">Tote &amp; Cooler Bags</a></li>
        <li><a href="promotional-mugs.html">Mugs &amp; Cups</a></li>
        <li><a href="promotional-keyrings.html">Keyrings</a></li>
        <li><a href="custom-lanyards.html">Lanyards &amp; Badges</a></li>
        <li><a href="promotional-notebooks.html">Notebooks &amp; Journals</a></li>
        <li><a href="promotional-tech.html">Tech &amp; Power Banks</a></li>
        <li><a href="eco-promotional-products.html">Eco Range</a></li>
        <li><a href="australian-made-promotional-products.html">Australian Made</a></li>
        <li><a href="event-merchandise.html">Event &amp; Tradeshow</a></li>
        <li><a href="uniforms-workwear.html">Uniforms &amp; Merch</a></li>
      </ul>
    </div>
    <div class="drawer-group">
      <button class="drawer-toggle" aria-expanded="false">Uniforms &amp; Merch <span>▾</span></button>
      <ul class="drawer-sub" hidden>
        <li><a href="uniforms-workwear.html"><b>All uniforms &amp; merch →</b></a></li>
        <li><a href="uniform-decoration.html">Decoration Guide</a></li>
        <li><a href="embroidered-polo-shirts.html">Embroidered Polos</a></li>
        <li><a href="custom-t-shirts.html">T-Shirts &amp; Merch</a></li>
        <li><a href="hi-vis-workwear.html">Hi Vis &amp; Workwear</a></li>
        <li><a href="custom-hoodies-jackets.html">Hoodies &amp; Jackets</a></li>
        <li><a href="embroidered-caps-hats.html">Caps &amp; Headwear</a></li>
        <li><a href="hospitality-uniforms.html">Hospitality &amp; Cafe</a></li>
        <li><a href="corporate-uniforms.html">Corporate Uniforms</a></li>
      </ul>
    </div>
    <div class="drawer-group">
      <a class="drawer-link" href="magnets.html">Fridge Magnets</a>
    </div>
    <div class="drawer-group"><a class="drawer-link" href="/#quoter">Instant Price</a></div>
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
        <a class="logo" href="/" style="color:#fff">AURA<span>PRINT</span></a>
        <p style="color:#b8b2ab;font-size:14px;margin-top:14px">Bold print and promotional products from the Sunshine Coast, delivered Australia-wide.</p>
        <p style="margin-top:16px;font-size:14px"><a href="art-setup.html" style="color:#fff;font-weight:700;text-decoration:underline">Preparing your artwork? Read our print-ready guide →</a></p>
        <h4 style="margin-top:24px">Print offers &amp; tips, straight to your inbox</h4>
        <div class="newsletter"><input type="email" id="nl-email" placeholder="Your email address" aria-label="Email address for newsletter"><button class="btn btn-aura" id="nl-join" style="padding:12px 22px">Join</button></div>
        <p id="nl-status" style="font-size:13px;min-height:18px;margin-top:8px"></p>
        <h4 style="margin-top:22px">Follow Aura Print</h4>
        <div class="social">
          <a href="https://www.facebook.com/auraprint.au/" target="_blank" rel="noopener" aria-label="Aura Print on Facebook" title="Facebook"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8.6c0-.4.3-.6.6-.6H17V4h-3c-2.8 0-4 1.8-4 4.3V10H7v4h3v8h4v-8h3l.6-4H14z"/></svg></a>
          <a href="https://www.linkedin.com/company/aura-print-au/" target="_blank" rel="noopener" aria-label="Aura Print &amp; Promo on LinkedIn" title="LinkedIn"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 6V21h-4v-5.2c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V21h-4z"/></svg></a>
          <a href="https://maps.google.com/?cid=3703559003646670269" target="_blank" rel="noopener" aria-label="Aura Print on Google (5.0 star reviews)" title="Google reviews"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.35 11.1H12v3.2h5.35c-.25 1.5-1.7 4.4-5.35 4.4-3.2 0-5.8-2.65-5.8-5.9S8.8 6.9 12 6.9c1.85 0 3.05.8 3.75 1.45l2.55-2.45C16.65 4.35 14.55 3.4 12 3.4 7.2 3.4 3.4 7.2 3.4 12s3.8 8.6 8.6 8.6c4.95 0 8.25-3.5 8.25-8.4 0-.55-.05-1-.15-1.4z"/></svg></a>
        </div>
      </div>
      <div><h4>Products</h4><ul><li><a href="business-cards.html">Business Cards</a></li><li><a href="flyers.html">Flyers</a></li><li><a href="corflute-signs.html">Corflute Signs</a></li><li><a href="pull-up-banners.html">Pull Up Banners</a></li><li><a href="stickers.html">Stickers</a></li><li><a href="promo.html">Promotional Products</a></li><li><a href="promotional-pens.html">Promotional Pens</a></li><li><a href="promotional-drink-bottles.html">Drink Bottles</a></li><li><a href="promotional-tote-bags.html">Tote Bags</a></li><li><a href="custom-lanyards.html">Lanyards</a></li><li><a href="same-day-printing.html">Fast Turnaround Printing</a></li><li><a href="real-estate-print-signage.html">Real Estate Signage</a></li></ul></div>
      <div><h4>Company</h4><ul><li><a href="about.html">About</a></li><li><a href="our-work.html">Our Work</a></li><li><a href="blog.html">Blog</a></li><li><a href="art-setup.html">Artwork Setup Guide</a></li><li><a href="artwork-templates.html">Artwork Templates</a></li><li><a href="trade-terms.html">Terms of Trade</a></li><li><a href="privacy-policy.html">Privacy Policy</a></li><li><a href="refund-policy.html">Refunds &amp; Reprints</a></li></ul></div>
      <div><h4>Contact</h4><ul>
        <li>4/1 Packer Road, Baringa QLD 4551</li>
        <li><a href="tel:1300291277">1300 291 277</a></li>
        <li><a class="email-link" data-u="admin" data-d="auraprint.com.au"></a></li>
        <li>Mon-Fri 9am - 5pm</li>
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
/* PAGE-COUNT GUARD -------------------------------------------------------
   Every folded product price on this site covers ONE sheet. A customer who
   writes "28 pages" into the job details is describing a stitched or bound
   booklet, which runs on a different press and costs many times more.

   This happened on 30 Aug 2026: a customer read $391 off the brochure
   calculator, wrote "A4 but there is 28 pages" in the details, and the
   captured price travelled through to the enquiry as if it applied. The
   real job was about $4,800.

   So: warn the customer live while they type, and on submit take the
   captured configurator price OUT of the enquiry, so no wrong number
   reaches the customer, the lead record or the email alert. */
var PAGE_GUARD_MAX  = 8;
var PAGE_GUARD_SKIP = /booklet|magazine|catalog|annual|wiro|perfect.?bound|saddle|newsletter|prospectus/i;

function detectPageCount(text){
  var max = 0, m, re = /(\d{1,4})\s*(?:pp\b|pages?\b)/gi;
  while ((m = re.exec(text || ''))){ var n = parseInt(m[1], 10); if (n > max) max = n; }
  return max;
}

/* Returns null when there is nothing to flag. */
function pageGuardState(form){
  var ta = form.querySelector('[name="job_details"], [name="message"]');
  if (!ta) return null;
  var text = String(ta.value || '');
  var codeEl = form.querySelector('[name="source_product_code"]');
  var code = codeEl ? String(codeEl.value || '') : '';
  /* Already a multi-page product: a page count there is normal, not a mismatch. */
  if (PAGE_GUARD_SKIP.test(code) || PAGE_GUARD_SKIP.test(text)) return null;
  var pages = detectPageCount(text);
  if (pages <= PAGE_GUARD_MAX) return null;
  return { field: ta, pages: pages, hasPrice: /Price shown online:/i.test(text) };
}

/* Live notice under the job details box. Tells them before they send, so the
   correction is not a surprise in a reply email later. */
function wirePageGuard(form){
  var ta = form.querySelector('[name="job_details"], [name="message"]');
  if (!ta) return;
  var box = document.createElement('p');
  box.className = 'page-guard';
  box.style.cssText = 'display:none;margin-top:9px;padding:11px 13px;border-radius:9px;' +
    'background:#fff6e8;border:1px solid #f0cf9b;font-size:13.5px;line-height:1.55;color:#6b4a12';
  ta.insertAdjacentElement('afterend', box);
  var paint = function(){
    var g = pageGuardState(form);
    if (!g){ box.style.display = 'none'; return; }
    box.innerHTML = '<b>Before you send this.</b> ' + g.pages + ' pages is a stitched or bound booklet, ' +
      'not a folded sheet, so ' +
      (g.hasPrice
        ? 'the price shown on the product page does not apply. We have taken that figure off this enquiry and will quote the real job.'
        : 'it is priced as a booklet rather than a brochure or flyer.') +
      ' <a href="booklets.html" style="color:#7a4bd6;font-weight:700">See booklet pricing &rarr;</a>';
    box.style.display = '';
  };
  ta.addEventListener('input', paint);
  ta.addEventListener('change', paint);
  paint();
}

/* Australian mobile check. Returns a tidy '04xx xxx xxx' string, or '' when the
   number is a landline, a 13/1300 number, or nonsense. Mirrors smsMobile() in
   the CRM and public.normalise_au_mobile() in the database, so a number that
   passes here is a number the CRM can actually text. */
function auMobile(raw){
  if (!raw) return '';
  var d = String(raw).replace(/[^0-9]/g, '');
  if (d.indexOf('0011') === 0) d = d.slice(4);
  if (/^614[0-9]{8}$/.test(d)) d = '0' + d.slice(2);
  else if (/^4[0-9]{8}$/.test(d)) d = '0' + d;
  if (!/^04[0-9]{8}$/.test(d)) return '';
  return d.slice(0,4) + ' ' + d.slice(4,7) + ' ' + d.slice(7);
}

/* Map a form's fields to the leads table columns. */
/* ---------------------------------------------------------------
   AD ATTRIBUTION: remember how this visitor arrived.

   Google appends ?gclid=... to every paid click (gbraid and wbraid on
   iOS app and web-to-app clicks). That parameter exists ONLY on the
   landing page, so if it is not stashed there it has gone by the time
   the customer fills in the quote form three pages later, and the CRM
   can never say which keyword produced the job.

   Stored in a first-party cookie for 90 days, Google's default
   conversion window. utm_* ride along so email, Meta and any other
   tagged campaign is attributed the same way.

   First touch wins, with one exception: a fresh Google click id always
   overwrites, because Google has just charged for that click and the
   conversion has to be credited to it. Without that exception every
   paid lead that later returned via an organic search would look free.
   --------------------------------------------------------------- */
var ATTR_COOKIE = 'aura_attr';
var ATTR_KEYS = ['gclid','gbraid','wbraid','utm_source','utm_medium',
                 'utm_campaign','utm_term','utm_content'];

function readCookie(name){
  try {
    var m = document.cookie.match('(?:^|; )' + name + '=([^;]*)');
    return m ? decodeURIComponent(m[1]) : null;
  } catch (e) { return null; }
}
function writeCookie(name, value, days){
  try {
    var d = new Date(); d.setTime(d.getTime() + days * 864e5);
    document.cookie = name + '=' + encodeURIComponent(value) +
      ';expires=' + d.toUTCString() + ';path=/;SameSite=Lax' +
      (location.protocol === 'https:' ? ';Secure' : '');
  } catch (e) {}
}
function currentAttribution(){
  var raw = readCookie(ATTR_COOKIE);
  if (!raw) return {};
  try { var o = JSON.parse(raw); return (o && typeof o === 'object') ? o : {}; }
  catch (e) { return {}; }
}
function captureAttribution(){
  var fresh = {}, q;
  try { q = new URLSearchParams(location.search); } catch (e) { return currentAttribution(); }
  ATTR_KEYS.forEach(function(k){
    var v = q.get(k);
    if (v) fresh[k] = String(v).slice(0, 200);
  });
  if (!Object.keys(fresh).length) {
    /* No tags on the URL. Still bank where they came from on their FIRST
       visit (Google search, Facebook, ChatGPT, a link on another site), so
       the CRM scoreboard can credit the right source. Our own pages as the
       referrer mean they were already browsing, so that is ignored. */
    var have = currentAttribution();
    if (Object.keys(have).length) return have;
    var ref = '';
    try { ref = document.referrer || ''; } catch (e) {}
    var own = /^https?:\/\/([^\/]*\.)?auraprint\.com\.au(\/|$)/i.test(ref);
    if (!ref || own) return have;
    var first = {
      referrer: String(ref).slice(0, 300),
      landing_page: (location.pathname + location.search).slice(0, 300),
      first_seen: new Date().toISOString()
    };
    writeCookie(ATTR_COOKIE, JSON.stringify(first), 90);
    return first;
  }

  var existing = currentAttribution();
  var isPaidClick = !!(fresh.gclid || fresh.gbraid || fresh.wbraid);
  var existingTagged = ATTR_KEYS.some(function(k){ return existing[k]; });
  if (existingTagged && !isPaidClick) return existing;

  fresh.landing_page = (location.pathname + location.search).slice(0, 300);
  if (document.referrer) fresh.referrer = String(document.referrer).slice(0, 300);
  fresh.first_seen = new Date().toISOString();
  writeCookie(ATTR_COOKIE, JSON.stringify(fresh), 90);
  return fresh;
}
window.auraAttribution = currentAttribution;

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
    delivery_line1:      g('delivery_line1'),
    delivery_suburb:     g('delivery_suburb'),
    delivery_state:      g('delivery_state'),
    delivery_postcode:   g('delivery_postcode'),
    source_form:         page.indexOf('contact') > -1 ? 'contact' : 'quote',
    source_page:         g('source_page') || page,
    source_product_code: g('source_product_code'),
    user_agent:          navigator.userAgent,
    needed_by:           g('needed_by'),
    found_us:            g('found_us')
  };
  /* Client-made id so the artwork upload (quote-upload edge function) can find
     this exact row after the anonymous insert, which returns nothing. */
  lead.id = (window.crypto && crypto.randomUUID) ? crypto.randomUUID()
          : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c){ var r = Math.random()*16|0; return (c === 'x' ? r : (r&3|8)).toString(16); });
  /* Staff read the job text first, so the date the customer needs it goes there too. */
  if (lead.needed_by && lead.job_details) lead.job_details = 'Needed by: ' + lead.needed_by + '\n' + lead.job_details;

  /* How they arrived. gclid carries whichever Google click id was present,
     so a row with a gclid is a paid click and one without is not. */
  var attr = currentAttribution();
  lead.gclid        = attr.gclid || attr.gbraid || attr.wbraid || null;
  lead.utm_source   = attr.utm_source   || null;
  lead.utm_medium   = attr.utm_medium   || null;
  lead.utm_campaign = attr.utm_campaign || null;
  lead.utm_term     = attr.utm_term     || null;
  lead.utm_content  = attr.utm_content  || null;
  lead.landing_page = attr.landing_page || null;
  lead.referrer     = attr.referrer     || null;

  Object.keys(lead).forEach(function(k){ if (lead[k] == null || lead[k] === '') delete lead[k]; });
  return lead;
}

/* Resolve a promise no later than `ms`, so a request that hangs behind a
   corporate proxy cannot leave the customer staring at "Sending...". */
function withTimeout(p, ms){
  return new Promise(function(resolve){
    var settled = false;
    var timer = setTimeout(function(){ if(!settled){ settled = true; resolve({ ok:false, timeout:true }); } }, ms);
    p.then(function(v){ if(!settled){ settled = true; clearTimeout(timer); resolve(v); } },
           function(){   if(!settled){ settled = true; clearTimeout(timer); resolve({ ok:false }); } });
  });
}

/* Artwork files chosen on the quote form (3 Oct 2026). Runs only after the lead
   row exists. quote-upload checks the row and hands back signed upload URLs in
   the private artwork bucket; each PUT tries Aura's own api. host first, the
   same way the uniform builder does, because some networks block supabase.co.
   Resolves { names:[], failed:n }. Never throws, so a failed upload can never
   cost us the enquiry itself. */
function uploadQuoteFiles(CFG, lead, files){
  var hosts = [CFG.supabaseUrl, CFG.supabaseFallbackUrl].filter(function(h, i, a){ return h && a.indexOf(h) === i; });
  var list = Array.prototype.slice.call(files || [], 0, 3);
  var out = { names: list.map(function(f){ return f.name; }), failed: 0 };
  if (!list.length || !hosts.length) return Promise.resolve(out);
  var body = JSON.stringify({ lead_id: lead.id, email: lead.email, files: list.map(function(f){ return { filename: f.name, size_bytes: f.size }; }) });
  function sign(i){
    if (i >= hosts.length) return Promise.resolve(null);
    return fetch(hosts[i] + '/functions/v1/quote-upload', { method:'POST', headers:{ 'Content-Type':'application/json', apikey: CFG.supabaseKey || '' }, body: body })
      .then(function(r){ if (r.status >= 500 && i + 1 < hosts.length) return sign(i + 1); return r.json().catch(function(){ return {}; }); },
            function(){ return sign(i + 1); });
  }
  return sign(0).then(function(res){
    if (!res || !res.ok){ out.failed = list.length; out.error = res && res.error; return out; }
    return Promise.all((res.uploads || []).map(function(u, k){
      var file = list[k];
      if (!u.upload_url || !file) return Promise.resolve(false);
      var rest = u.upload_url.replace(/^https:\/\/[^\/]+/, '');
      var urls = hosts.map(function(h){ return h.replace(/\/$/, '') + rest; });
      if (urls.indexOf(u.upload_url) < 0) urls.push(u.upload_url);
      function put(j){
        if (j >= urls.length) return Promise.resolve(false);
        return fetch(urls[j], { method:'PUT', headers:{ 'Content-Type': file.type || 'application/octet-stream', 'x-upsert':'false' }, body: file })
          .then(function(r){ return r.ok ? true : put(j + 1); }, function(){ return put(j + 1); });
      }
      return put(0);
    })).then(function(oks){
      out.failed = oks.filter(function(x){ return !x; }).length;
      /* Second call: the function can only sign a download link for staff once
         the file exists, so it is told when the uploads are done. */
      body = JSON.stringify({ lead_id: lead.id, email: lead.email, confirm: true });
      return sign(0).then(function(){ return out; }, function(){ return out; });
    });
  }).catch(function(){ out.failed = list.length; return out; });
}

/* Store the enquiry in the Supabase leads table. Resolves {ok|skipped}.
   Posts to Aura's own API host first and falls back to the direct Supabase
   host. School, government, hospital and large-corporate web filters block
   unfamiliar third-party API domains, and on 31 Aug 2026 that silently ate a
   real enquiry: the alert email arrived, the CRM row never existed. Two hosts
   means one filter cannot swallow a lead on its own. */
function saveLead(CFG, lead){
  if (!CFG.supabaseUrl || !CFG.supabaseKey) return Promise.resolve({ skipped:true });
  var hosts = [CFG.supabaseUrl];
  if (CFG.supabaseFallbackUrl && CFG.supabaseFallbackUrl !== CFG.supabaseUrl) hosts.push(CFG.supabaseFallbackUrl);
  function post(i){
    if (i >= hosts.length) return Promise.resolve({ ok:false, blocked:true });
    return fetch(hosts[i] + '/rest/v1/leads', {
      method: 'POST',
      headers: {
        'apikey':        CFG.supabaseKey,
        'Authorization': 'Bearer ' + CFG.supabaseKey,
        'Content-Type':  'application/json',
        'Prefer':        'return=minimal'
      },
      body: JSON.stringify(lead)
    }).then(function(r){
      /* A 4xx is the database refusing the DATA - retrying elsewhere would only
         be refused again. Only a server-side or transport failure is worth a
         second host. */
      if (!r.ok && r.status >= 500 && i + 1 < hosts.length) return post(i + 1);
      return { ok:r.ok, status:r.status, host:hosts[i] };
    }).catch(function(){ return post(i + 1); });
  }
  return post(0);
}

function wireForms(){
  var CFG = (window.AURA_CONFIG || {});
  var ENDPOINT = 'https://api.web3forms.com/submit';
  document.querySelectorAll('form[data-aura-form]').forEach(function(form){
    var status = form.querySelector('.form-status');
    if (!status){ status = document.createElement('p'); status.className = 'form-status'; status.style.cssText = 'margin-top:14px;font-size:14px;min-height:20px'; form.appendChild(status); }
    wirePageGuard(form);
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
      /* Australian mobile on fields marked data-mobile-only. A landline here is
         a dead end: it cannot receive the quote link by SMS, and 15 of the first
         35 quotes had no textable number because this was never checked. */
      var mobEl = form.querySelector('[data-mobile-only]');
      var badMob = mobEl && String(mobEl.value||'').trim() && !auMobile(mobEl.value);
      if (badMob && missing.indexOf(mobEl) < 0) missing.push(mobEl);
      /* Australian postcode: four digits, or the lead insert is rejected. */
      var pcEl = form.querySelector('[name="delivery_postcode"]');
      var badPc = pcEl && String(pcEl.value||'').trim() && !/^\d{4}$/.test(pcEl.value.trim());
      if (badPc && missing.indexOf(pcEl) < 0) missing.push(pcEl);
      if (missing.length){
        missing.forEach(function(el){
          el.classList.add('input-error');
          var msg = document.createElement('span');
          msg.className = 'field-error';
          msg.style.cssText = 'display:block;margin-top:5px;font-size:12.5px;color:#c0392b;font-weight:600';
          msg.textContent = (el === emailEl && badEmail) ? 'That email address doesn’t look right.'
                          : (el === pcEl && badPc) ? 'Please enter a valid 4-digit postcode.'
                          : (el === mobEl && badMob) ? 'That looks like a landline. Please give a mobile so we can text you the quote link.'
                          : 'This field is required.';
          el.insertAdjacentElement('afterend', msg);
        });
        status.style.color = '#c0392b';
        status.textContent = 'Please fix the ' + missing.length + ' highlighted field' + (missing.length > 1 ? 's' : '') + ' above.';
        missing[0].scrollIntoView({ behavior:'smooth', block:'center' });
        missing[0].focus({ preventScroll:true });
        return;
      }

      /* Tidy the number before anything reads it, so the CRM and the alert email
         both get 04xx xxx xxx rather than +61 / spaces / dashes. */
      if (mobEl){ var tidy = auMobile(mobEl.value); if (tidy) mobEl.value = tidy; }

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

      /* A captured configurator price the job spec has outgrown must not
         travel. Rewrite the field itself, because BOTH the database save and
         the Web3Forms email read their values straight off the live form. */
      var pg = pageGuardState(form);
      if (pg && pg.hasPrice){
        pg.field.value = pg.field.value.replace(/^.*Price shown online:.*$/gim,
          'Price shown online: REMOVED by the website - the job is ' + pg.pages +
          ' pages, which is a booklet, not a folded sheet. Needs a manual quote.');
      }

      /* Snapshot the answers NOW, before anything async, so the email always
         carries what was actually submitted. */
      var data = null;
      if (CFG.web3formsKey){
        data = new FormData(form);
        data.append('access_key', CFG.web3formsKey);
        if (!data.get('subject')) data.append('subject', (form.getAttribute('data-subject') || 'New website enquiry') + ' – Aura Print');
        data.append('from_name', 'Aura Print website');
      }

      /* Files never travel in the alert email; they go to private storage. */
      var fileEl = form.querySelector('input[type="file"][name="artwork_file"]');
      var chosen = fileEl && fileEl.files && fileEl.files.length ? fileEl.files : null;
      if (data) data.delete('artwork_file');

      /* Primary: store the enquiry in the CRM database, then any artwork. */
      var leadRow = collectLead(form);
      var dbSave = withTimeout(saveLead(CFG, leadRow), 8000).then(function(db){
        if (!chosen || !(db && db.ok)) return db;
        if (btn) btn.textContent = 'Uploading artwork…';
        return withTimeout(uploadQuoteFiles(CFG, leadRow, chosen), 120000).then(function(up){
          db.upload = up || { failed: chosen.length, names: [] };
          return db;
        });
      });

      /* The alert email goes out AFTER the database attempt so it can REPORT the
         result. These two used to run in parallel, which meant a failed CRM save
         was invisible: the customer saw a tick, admin@ got an email, and the
         lead existed nowhere. Now every alert says whether it landed. */
      var mail = dbSave.then(function(db){
        if (!data) return false;
        data.append('crm_status', (db && db.ok)
          ? 'Saved to the CRM.'
          : 'NOT SAVED TO THE CRM - please add this enquiry by hand. Reason: ' +
            (db && db.timeout ? 'the database did not answer in time'
             : db && db.blocked ? "blocked by the sender's network or browser"
             : db && db.skipped ? 'the database is not configured'
             : 'rejected with status ' + ((db && db.status) || 'unknown')));
        if (chosen){
          var up = db && db.upload;
          data.append('artwork_upload', !(db && db.ok) ? 'Customer attached ' + chosen.length + ' file(s) but the lead did not save, so they were not uploaded. Ask for the files.'
            : (up && !up.failed) ? 'Uploaded to the CRM (open the lead): ' + up.names.join(', ')
            : 'Upload FAILED for ' + ((up && up.failed) || chosen.length) + ' file(s). Ask the customer to email them.');
        }
        return fetch(ENDPOINT, { method:'POST', body:data })
          .then(function(r){ return r.json(); })
          .then(function(res){ return !!res.success; })
          .catch(function(){ return false; });
      });

      Promise.allSettled([dbSave, mail]).then(function(rs){
        var db = rs[0].value || {};
        var stored  = rs[0].status === 'fulfilled' && (db.ok || db.skipped);
        var emailed = rs[1].status === 'fulfilled' && rs[1].value === true;
        if (stored || emailed){
          form.querySelectorAll('input,textarea,select').forEach(function(el){ if(el.type!=='hidden' && el.type!=='checkbox') el.value=''; });
          status.style.color = '#1a8a4a';
          status.innerHTML = '✓ Thanks! Your request is in. We’ll be in touch within the hour (Mon to Fri, 9am to 5pm).' +
            ((db.upload && db.upload.failed) ? ' <br><b>Your artwork did not upload.</b> Please email it to <b>' + em + '</b> and quote your name.' : '');
          if (btn){ btn.textContent = '✓ Sent'; }
          auraTrack('generate_lead', {
            form_name: form.getAttribute('data-subject') || 'Website enquiry',
            page_path: location.pathname,
            stored: !!stored, emailed: !!emailed,
            lead_category: leadRow.category || '(none)',
            found_us: leadRow.found_us || '(not answered)',
            has_artwork: !!(chosen || leadRow.artwork_link)
          });
          auraAdsConvert('lead');
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

/* Footer newsletter -> CRM contact with express marketing consent, via the
   newsletter_subscribe RPC (30 Sep 2026). It used to insert into leads without
   a name, which the leads RLS policy refuses, so every sign-up failed.
   Subscribers go to Contacts (source 'newsletter'), not the Leads tab, and are
   in the Campaigns "opted in" audience automatically. Admin gets a Web3Forms
   notice for each one. */
function subscribeNewsletter(CFG, email, page){
  if (!CFG.supabaseUrl || !CFG.supabaseKey) return Promise.resolve({ ok:false });
  var hosts = [CFG.supabaseUrl];
  if (CFG.supabaseFallbackUrl && CFG.supabaseFallbackUrl !== CFG.supabaseUrl) hosts.push(CFG.supabaseFallbackUrl);
  function post(i){
    if (i >= hosts.length) return Promise.resolve({ ok:false });
    return fetch(hosts[i] + '/rest/v1/rpc/newsletter_subscribe', {
      method: 'POST',
      headers: { 'apikey': CFG.supabaseKey, 'Authorization': 'Bearer ' + CFG.supabaseKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_email: email, p_page: page })
    }).then(function(r){
      if (!r.ok && r.status >= 500 && i + 1 < hosts.length) return post(i + 1);
      return r.ok ? r.json() : { ok:false };
    }).catch(function(){ return post(i + 1); });
  }
  return post(0);
}
function wireNewsletter(){
  var btn = document.getElementById('nl-join'), input = document.getElementById('nl-email'),
      status = document.getElementById('nl-status');
  if (!btn || !input) return;
  function submit(){
    var em = String(input.value || '').trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)){
      status.style.color = '#f2b8a2'; status.textContent = 'Please enter a valid email address.'; input.focus(); return;
    }
    var CFG = window.AURA_CONFIG || {}, page = location.pathname.split('/').pop() || 'index.html';
    btn.disabled = true; btn.textContent = '…';
    subscribeNewsletter(CFG, em, page).then(function(r){
      if (r && r.ok){
        input.value = ''; status.style.color = '#8fd3a8'; status.textContent = '✓ You’re on the list.';
        btn.textContent = '✓';
        auraTrack('newsletter_signup', { page_path: location.pathname });
        if (CFG.web3formsKey){
          var d = new FormData();
          d.append('access_key', CFG.web3formsKey);
          d.append('subject', 'New newsletter subscriber: ' + em);
          d.append('from_name', 'Aura Print website');
          d.append('email', em);
          d.append('message', em + ' joined the newsletter from ' + page + '. They are now an opted-in contact in the CRM.');
          fetch('https://api.web3forms.com/submit', { method:'POST', body:d }).catch(function(){});
        }
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

/* Fire a Google Ads conversion. Stays silent unless config.js carries a
   label for this action, so the site behaves identically before Google
   Ads exists. GA4 still records the same event either way, and the Ads
   account should ALSO import generate_lead and purchase from GA4: two
   independent paths mean one broken link cannot leave you flying blind.
   kind is 'lead' | 'purchase' | 'call'. */
function auraAdsConvert(kind, params){
  try {
    var labels = (window.AURA_CONFIG || {}).adsLabels || {};
    var label = labels[kind];
    if (!label || typeof window.gtag !== 'function') return;
    var p = { send_to: label };
    if (params && params.value != null){
      p.value = Number(params.value);
      p.currency = params.currency || 'AUD';
    }
    /* Google de-duplicates on this, so a customer refreshing the order
       page cannot be counted as a second sale. */
    if (params && params.transaction_id) p.transaction_id = String(params.transaction_id);
    window.gtag('event', 'conversion', p);
  } catch (e) {}
}
window.auraAdsConvert = auraAdsConvert;

function wireAnalytics(){
  var CFG = (window.AURA_CONFIG || {});
  var ga4 = CFG.ga4Id, ads = CFG.adsId;
  if (!ga4 && !ads) return;            /* both switched off */
  if (window.__auraGaLoaded) return;   /* never load gtag twice */
  window.__auraGaLoaded = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function(){ window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  if (ga4) window.gtag('config', ga4, {
    page_title: document.title,
    page_path: location.pathname + location.search
  });
  /* The Ads tag is configured separately; both share one gtag.js. */
  if (ads) window.gtag('config', ads);

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(ga4 || ads);
  document.head.appendChild(s);

  /* Delegated, so it covers the header, footer and drawer that this file
     injects after page load, plus anything a product page adds later. */
  document.addEventListener('click', function(e){
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (href.indexOf('tel:') === 0){
      auraTrack('tel_click', { link_url: href, page_path: location.pathname });
      auraAdsConvert('call');
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
  nextday:  { label:'Next Day', cut:'ordered, approved and paid by 12pm', hour:12 },
  sameday:  { label:'Same Day', cut:'ordered, approved and paid by 8am',  hour:8  }
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
      return '⚡ Order, approve your proof and pay before <b>8am today</b> and it dispatches <b>today, '+fmtDay(now)+'</b>.';
    const d=nextOpenDay(8);
    /* on a weekend there was no cut-off today, so do not claim one passed */
    const lead = isWeekend(now) ? '' : 'Today’s 8am cut-off has passed. ';
    return '⚡ '+lead+'Order, approve and pay before <b>8am '+fmtDay(d)+'</b> for dispatch that day.';
  }
  if (speed==='nextday'){
    if (!isWeekend(now) && now.getHours()<12)
      return '⏩ Order, approve your proof and pay before <b>12pm today</b> for dispatch <b>'+fmtDay(addBiz(now,1))+'</b>.';
    const d=nextOpenDay(12);
    return '⏩ Order, approve and pay before <b>12pm '+fmtDay(d)+'</b> for dispatch <b>'+fmtDay(addBiz(d,1))+'</b>.';
  }
  const start = isWeekend(now) ? addBiz(now,1) : now;
  return '🚚 Standard production dispatches in <b>3-5 business days</b>, about <b>'+fmtDay(addBiz(start,3))+' to '+fmtDay(addBiz(start,5))+'</b>.';
}
window.AuraTurn = { speeds:TURN_SPEEDS, dispatchLine:dispatchLine, fmtDay:fmtDay, addBiz:addBiz, now:brisNow };

/* ---------- cart pill on every page --------------------------------------
   The floating cart pill lives in assets/aura-cart.js, which used to be pulled
   in only by the pricing engine. That made the pill appear on some product
   pages and vanish on the home page, the about page, and any product whose
   price falls between breaks - so a customer's cart looked like it had been
   emptied. aura.js is on every page, so it loads the library instead.

   We peek at localStorage first and only fetch the script when the cart
   actually holds something, so an empty-cart visitor pays for no extra
   request. The peek mirrors aura-cart.js's own 7-day staleness rule; if the
   shape is ever wrong we simply do nothing. */
function wireCartPill(){
  if (window.AuraCart) { window.AuraCart.badge(); return; }
  var hasItems = false;
  try {
    var raw = localStorage.getItem('aura_cart_v1');
    if (raw) {
      var o = JSON.parse(raw);
      var fresh = o && o.at && (Date.now() - o.at) <= 7*24*60*60*1000;
      hasItems = !!(fresh && Array.isArray(o.items) && o.items.length);
    }
  } catch(e) { return; }
  if (!hasItems) return;
  var t = document.createElement('script');
  t.src = 'assets/aura-cart.js?v=20260901a';
  t.async = true;
  document.head.appendChild(t);
}

/* The bar itself is written into each page as plain HTML so crawlers read the
   cut-offs. This only adds the live dispatch date on top of it. */
function wireTurnaround(){
  document.querySelectorAll('[data-aura-turnaround]').forEach(function(el){
    const live = el.querySelector('.turn-live');
    if (live) live.innerHTML = dispatchLine(el.getAttribute('data-aura-turnaround') || 'standard');
  });
}


/* Mobile action bar (3 Oct 2026). On phones the header "Get a Quote" button is
   hidden and the phone number scrolls away, so a visitor who has read the page
   has nothing to tap. This pins two actions to the bottom of the screen.
   "Get a price" jumps to the page's own price tool when it has one, otherwise
   it opens the quote form with the page recorded as the source. Hidden on the
   pages that are already the action (quote, cart, checkout, order, uniform
   builder) so it never covers a submit button. */
function wireMobileBar(){
  var path = location.pathname.replace(/^\//,'') || 'index.html';
  if (/^(quote|cart|checkout|order|uniform-order|proof|myquote|crm|admin)\b/.test(path)) return;
  if (document.getElementById('auraMBar')) return;
  var tool = document.querySelector('#aura-config,#bc-config,#quoter,#lbForm,#catalogue');
  var page = path.replace(/\.html$/,'');
  var a1 = document.createElement('a');
  a1.className = 'mbar-btn mbar-price';
  if (tool) {
    if (!tool.id) tool.id = 'aura-price-tool';
    a1.href = '#' + tool.id;
    a1.textContent = 'Get a price';
  } else {
    a1.href = 'quote.html?from=' + encodeURIComponent(page);
    a1.textContent = 'Get a quote';
  }
  a1.addEventListener('click', function(){ auraTrack('mbar_click', { action: tool ? 'price' : 'quote', page_path: location.pathname }); });
  var a2 = document.createElement('a');
  a2.className = 'mbar-btn mbar-call';
  a2.href = 'tel:1300291277';
  a2.textContent = 'Call 1300 291 277';
  a2.setAttribute('aria-label', 'Call Aura Print on 1300 291 277');
  var bar = document.createElement('div');
  bar.id = 'auraMBar';
  bar.className = 'mbar';
  bar.setAttribute('role', 'navigation');
  bar.setAttribute('aria-label', 'Quick actions');
  bar.appendChild(a1); bar.appendChild(a2);
  document.body.appendChild(bar);
  document.body.classList.add('has-mbar');
}

document.addEventListener('DOMContentLoaded', function(){
  /* First, so a gclid is banked even if a later step throws. This does not
     depend on GA4 being on: the CRM needs the click id regardless. */
  captureAttribution();
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
  wireCartPill();
  wireMobileBar();

  /* marquee helper (if page has one) */
  const m=document.getElementById('marq'); if(m) m.innerHTML+=m.innerHTML;
});
})();
