/* AURA PRINT & PROMO - shared components: util bar, nav, footer, chat bot */
(function(){
const HEADER = `
<div class="util">
  <div class="wrap">
    <div class="left">
      <a href="tel:1300291277"><b>1300 291 277</b></a>
      <a href="#">WhatsApp</a>
      <a href="quote.html">Upload artwork</a>
    </div>
    <div class="right">
      <span class="tag">Sunshine Coast owned. Australia-wide delivery.</span>
      <a href="#">Track order</a>
    </div>
  </div>
</div>
<nav class="main">
  <div class="wrap">
    <a class="logo" href="index.html">AURA<span>PRINT</span></a>
    <div class="navlinks">
      <div><a href="print.html">Print ▾</a>
        <div class="mega">
          <div><h4>Cards &amp; Stationery</h4><ul><li><a href="business-cards.html">Business Cards</a></li><li><a href="nv-velvet-business-cards.html">NV Velvet Cards</a></li><li><a href="letterheads.html">Letterheads</a></li><li><a href="envelopes.html">Envelopes</a></li><li><a href="loyalty-cards.html">Loyalty Cards</a></li></ul></div>
          <div><h4>Marketing</h4><ul><li><a href="flyers.html">Flyers</a></li><li><a href="brochures.html">Brochures</a></li><li><a href="postcards.html">Postcards</a></li><li><a href="presentation-folders.html">Presentation Folders</a></li><li><a href="menus.html">Menus</a></li></ul></div>
          <div><h4>Books &amp; Booklets</h4><ul><li><a href="booklets.html">Saddle Stitched Booklets</a></li><li><a href="perfect-bound-books.html">Perfect Bound Books</a></li><li><a href="invoice-books.html">Invoice Books (NCR)</a></li><li><a href="notepads.html">Notepads</a></li><li><a href="calendars.html">Calendars</a></li></ul></div>
        </div>
      </div>
      <div><a href="signage.html">Signage &amp; Display ▾</a>
        <div class="mega">
          <div><h4>Signs</h4><ul><li><a href="corflute-signs.html">Corflute Signs</a></li><li><a href="a-frames.html">A-Frames</a></li><li><a href="posters.html">Posters</a></li><li><a href="stickers.html">Stickers &amp; Labels</a></li><li><a href="vehicle-magnets.html">Magnets</a></li></ul></div>
          <div><h4>Banners &amp; Flags</h4><ul><li><a href="pull-up-banners.html">Pull Up Banners</a></li><li><a href="outdoor-banners.html">Outdoor Banners</a></li><li><a href="teardrop-flags.html">Teardrop Flags</a></li><li><a href="fence-mesh.html">Fence Mesh</a></li></ul></div>
          <div><h4>Events &amp; Display</h4><ul><li><a href="exhibition-displays.html">Exhibition Displays</a></li><li><a href="media-walls.html">Media Walls</a></li><li><a href="marquees.html">Marquees</a></li><li><a href="tablecloths.html">Printed Tablecloths</a></li></ul></div>
        </div>
      </div>
      <div><a href="promo.html">Promo &amp; Apparel ▾</a>
        <div class="mega">
          <div><h4>Drinkware &amp; Gifts</h4><ul><li><a href="promo.html">Mugs &amp; Cups</a></li><li><a href="promo.html">Bottles &amp; Tumblers</a></li><li><a href="promo.html">Stubby Coolers</a></li><li><a href="promo.html">Tote Bags</a></li></ul></div>
          <div><h4>Apparel</h4><ul><li><a href="promo.html">Tees &amp; Polos</a></li><li><a href="promo.html">Hoodies</a></li><li><a href="promo.html">Hi-Vis &amp; Workwear</a></li><li><a href="promo.html">Caps &amp; Hats</a></li></ul></div>
          <div><h4>Office &amp; Tech</h4><ul><li><a href="promo.html">Pens</a></li><li><a href="promo.html">Notebooks</a></li><li><a href="promo.html">Lanyards</a></li><li><a href="promo.html">Eco Range</a></li></ul></div>
        </div>
      </div>
      <div><a href="index.html#quoter">Instant Price</a></div>
      <div><a href="about.html">About</a></div>
      <div><a href="contact.html">Contact</a></div>
    </div>
    <div class="nav-cta">
      <a class="btn btn-ghost" href="#" style="padding:10px 20px">Login</a>
      <a class="btn btn-aura" href="quote.html" style="padding:10px 22px">Get a Quote</a>
    </div>
  </div>
</nav>`;

const FOOTER = `
<footer>
  <div class="wrap">
    <div class="cols">
      <div>
        <a class="logo" href="index.html" style="color:#fff">AURA<span>PRINT</span></a>
        <p style="color:#b8b2ab;font-size:14px;margin-top:14px">Bold print and promotional products from the Sunshine Coast, delivered Australia-wide.</p>
        <h4 style="margin-top:24px">Get 10% off your first order</h4>
        <div class="newsletter"><input type="email" placeholder="Your email address"><button class="btn btn-aura" style="padding:12px 22px">Join</button></div>
      </div>
      <div><h4>Products</h4><ul><li><a href="business-cards.html">Business Cards</a></li><li><a href="flyers.html">Flyers</a></li><li><a href="corflute-signs.html">Corflute Signs</a></li><li><a href="pull-up-banners.html">Pull Up Banners</a></li><li><a href="signage.html">Stickers</a></li><li><a href="promo.html">Promo Products</a></li><li><a href="promo.html">Workwear</a></li></ul></div>
      <div><h4>Company</h4><ul><li><a href="about.html">About</a></li><li><a href="#">Portfolio</a></li><li><a href="#">Reviews</a></li><li><a href="blog.html">Blog</a></li><li><a href="art-setup.html">Artwork Setup Guide</a></li><li><a href="trade-terms.html">Terms of Trade</a></li><li><a href="privacy-policy.html">Privacy Policy</a></li><li><a href="refund-policy.html">Refunds &amp; Reprints</a></li></ul></div>
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
</footer>

<button id="aura-chat-btn" aria-label="Chat with us">💬</button>
<div id="aura-chat">
  <div class="chat-head"><b>AURA ASSISTANT</b><span>Typically replies in seconds</span></div>
  <div class="chat-body" id="chat-body"></div>
  <div class="chat-quick" id="chat-quick"></div>
  <div class="chat-input">
    <input id="chat-in" type="text" placeholder="Type a message...">
    <button id="chat-send">→</button>
  </div>
</div>`;

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
      /* required-field guard */
      var missing = [];
      form.querySelectorAll('[required]').forEach(function(el){ if(!String(el.value||'').trim()) missing.push(el); });
      if (missing.length){ missing[0].focus(); status.style.color = '#c0392b'; status.textContent = 'Please fill the required fields (marked *).'; return; }

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
        } else {
          status.style.color = '#c0392b';
          status.innerHTML = 'Something went wrong sending that. Please call <b>1300 291 277</b> or email <b>' + em + '</b> and we’ll sort it right away.';
          if (btn){ btn.disabled = false; btn.textContent = original; }
        }
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', function(){
  document.body.insertAdjacentHTML('afterbegin', HEADER);
  wireForms();

  /* Tawk.to live chat: if configured, load it and skip the demo bot */
  const cfg = window.AURA_CONFIG || {};
  if (cfg.tawkId) {
    window.Tawk_API = window.Tawk_API || {}; window.Tawk_LoadStart = new Date();
    const s = document.createElement('script');
    s.async = true; s.src = 'https://embed.tawk.to/' + cfg.tawkId; s.charset = 'UTF-8';
    s.setAttribute('crossorigin', '*');
    document.head.appendChild(s);
    document.body.insertAdjacentHTML('beforeend', FOOTER.replace(/<button id="aura-chat-btn"[\s\S]*$/, ''));
    fillEmails();
    const m0=document.getElementById('marq'); if(m0) m0.innerHTML+=m0.innerHTML;
    return;
  }
  document.body.insertAdjacentHTML('beforeend', FOOTER);
  fillEmails();

  /* ---------- chat bot (demo brain - production version will be AI-powered) ---------- */
  const body=document.getElementById('chat-body'), quick=document.getElementById('chat-quick'),
        input=document.getElementById('chat-in'), send=document.getElementById('chat-send'),
        panel=document.getElementById('aura-chat'), btn=document.getElementById('aura-chat-btn');
  let greeted=false, awaitingEmail=false;

  const QUICKS=[['Get a price','price'],['Turnaround times','turnaround'],['Artwork help','artwork'],['Talk to a human','human']];

  function addMsg(text, who){
    const d=document.createElement('div'); d.className='msg '+who; d.innerHTML=text;
    body.appendChild(d); body.scrollTop=body.scrollHeight;
  }
  function botReply(text, delay){
    setTimeout(()=>addMsg(text,'bot'), delay||420);
  }
  function renderQuicks(){
    quick.innerHTML='';
    QUICKS.forEach(([label,key])=>{
      const b=document.createElement('button'); b.textContent=label;
      b.onclick=()=>{ addMsg(label,'user'); respond(key); };
      quick.appendChild(b);
    });
  }
  function respond(key){
    awaitingEmail=false;
    if(key==='price') botReply('Easy! Most products have <b>instant online pricing</b> — try the quoter on the <a href="index.html#quoter" style="color:var(--violet);font-weight:700">homepage</a> or open any product page. For anything custom, I can arrange a quote — just tell me the product and quantity.');
    else if(key==='turnaround') botReply('Standard turnaround is <b>3-5 business days</b>, plus a day or two in transit. Need it faster? Next-day and same-day express options are available on many products — pick your speed in the configurator.');
    else if(key==='artwork') botReply('We accept <b>print-ready PDFs</b> with 3mm bleed and crop marks. Working from Canva? Our setup guides cover that too. You can upload artwork on any product page or via <a href="quote.html" style="color:var(--violet);font-weight:700">the quote form</a> and our preflight check will catch any problems.');
    else if(key==='human') { botReply('No worries — leave your <b>email or phone number</b> and one of the team will get back to you within the hour (Mon-Fri 8:30-5). Or call us now on <b>1300 291 277</b>.'); awaitingEmail=true; }
    else if(key==='thanks') botReply('Anytime! Anything else I can help with?');
    else botReply("I can help with pricing, turnaround, artwork setup, or connect you with the team. What's your project?");
  }
  function classify(t){
    t=t.toLowerCase();
    if(awaitingEmail && (t.includes('@')||/\d{8,}/.test(t.replace(/\s/g,'')))) { awaitingEmail=false; return '_captured'; }
    if(/price|cost|quote|how much|\$/.test(t)) return 'price';
    if(/turnaround|fast|urgent|when|deliver|shipping|express/.test(t)) return 'turnaround';
    if(/artwork|file|pdf|canva|bleed|design|setup/.test(t)) return 'artwork';
    if(/human|person|call|phone|speak|someone|staff/.test(t)) return 'human';
    if(/thank|cheers|great|awesome/.test(t)) return 'thanks';
    return 'fallback';
  }
  function userSend(){
    const t=input.value.trim(); if(!t) return;
    addMsg(t,'user'); input.value='';
    const key=classify(t);
    if(key==='_captured') botReply('Got it — thanks! ✅ A real team member will reach out shortly. (In the live site this creates a lead in the CRM and pings the team.)');
    else respond(key);
  }
  send.onclick=userSend;
  input.addEventListener('keydown',e=>{if(e.key==='Enter')userSend();});
  btn.onclick=()=>{
    panel.classList.toggle('open');
    if(panel.classList.contains('open') && !greeted){
      greeted=true;
      botReply("G'day! 👋 I'm the Aura assistant. I can price a job, explain turnaround, or help with artwork. What are you after?",200);
      renderQuicks();
    }
  };

  /* marquee helper (if page has one) */
  const m=document.getElementById('marq'); if(m) m.innerHTML+=m.innerHTML;
});
})();
