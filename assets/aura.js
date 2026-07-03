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
          <div><h4>Cards &amp; Stationery</h4><ul><li><a href="business-cards.html">Business Cards</a></li><li><a href="business-cards.html">NV Velvet Cards</a></li><li><a href="print.html">Letterheads</a></li><li><a href="print.html">Envelopes</a></li><li><a href="print.html">Loyalty Cards</a></li></ul></div>
          <div><h4>Marketing</h4><ul><li><a href="print.html">Flyers</a></li><li><a href="print.html">Brochures</a></li><li><a href="print.html">Postcards</a></li><li><a href="print.html">Presentation Folders</a></li><li><a href="print.html">Menus</a></li></ul></div>
          <div><h4>Books &amp; Booklets</h4><ul><li><a href="print.html">Saddle Stitched Booklets</a></li><li><a href="print.html">Perfect Bound Books</a></li><li><a href="print.html">Invoice Books (NCR)</a></li><li><a href="print.html">Notepads</a></li><li><a href="print.html">Calendars</a></li></ul></div>
        </div>
      </div>
      <div><a href="signage.html">Signage &amp; Display ▾</a>
        <div class="mega">
          <div><h4>Signs</h4><ul><li><a href="signage.html">Corflute Signs</a></li><li><a href="signage.html">A-Frames</a></li><li><a href="signage.html">Posters</a></li><li><a href="signage.html">Stickers &amp; Labels</a></li><li><a href="signage.html">Magnets</a></li></ul></div>
          <div><h4>Banners &amp; Flags</h4><ul><li><a href="signage.html">Pull Up Banners</a></li><li><a href="signage.html">Outdoor Banners</a></li><li><a href="signage.html">Teardrop Flags</a></li><li><a href="signage.html">Fence Mesh</a></li></ul></div>
          <div><h4>Events &amp; Display</h4><ul><li><a href="signage.html">Exhibition Displays</a></li><li><a href="signage.html">Media Walls</a></li><li><a href="signage.html">Marquees</a></li><li><a href="signage.html">Printed Tablecloths</a></li></ul></div>
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
      <div><h4>Products</h4><ul><li><a href="business-cards.html">Business Cards</a></li><li><a href="print.html">Flyers</a></li><li><a href="signage.html">Corflute Signs</a></li><li><a href="signage.html">Pull Up Banners</a></li><li><a href="signage.html">Stickers</a></li><li><a href="promo.html">Promo Products</a></li><li><a href="promo.html">Workwear</a></li></ul></div>
      <div><h4>Company</h4><ul><li><a href="about.html">About</a></li><li><a href="#">Portfolio</a></li><li><a href="#">Reviews</a></li><li><a href="#">Blog</a></li><li><a href="#">Artwork Setup Guides</a></li><li><a href="#">Terms of Trade</a></li><li><a href="#">Privacy</a></li></ul></div>
      <div><h4>Contact</h4><ul>
        <li>3/1 Packer Road, Baringa QLD 4551</li>
        <li><a href="tel:1300291277">1300 291 277</a></li>
        <li><a href="mailto:hello@auraprint.com.au">hello@auraprint.com.au</a></li>
        <li>Mon-Fri 8:30am - 5pm</li>
        <li style="margin-top:10px"><b style="color:#fff">Need it fast? Next-day express available.</b></li>
      </ul></div>
    </div>
    <div class="legal">
      <span>© 2026 Aura Print &amp; Promo. 100% Australian owned.</span>
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

document.addEventListener('DOMContentLoaded', function(){
  document.body.insertAdjacentHTML('afterbegin', HEADER);
  document.body.insertAdjacentHTML('beforeend', FOOTER);

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
    else if(key==='turnaround') botReply('Standard turnaround is <b>3-5 business days</b> plus delivery. Need it faster? Next-day and same-day express options are available on many products — pick your speed in the configurator.');
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
