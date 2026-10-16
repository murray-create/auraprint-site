/* Apparel shop behaviour (apparel/*.html), 15 Oct 2026.
   - Listing pages: filter, sort, colour-dot photo swap, "show more".
   - Product page: gallery, colour + size pickers, live stock, Bulk Order Grid.
   - Everything the customer picks goes into the SAME draft the uniform order
     builder uses (localStorage 'aura-uniform-order-v1'), so uniform-order.html
     picks it up for logo upload, decoration and contact details, and the
     uniform-request Edge Function lands it in the CRM as a lead.
   Prices are Aura sell prices (trade cost x 1.6), GST inclusive on screen.
   Bulk tiers (10+ 5%, 25+ 8%, 50+ 10%) apply per style, across colours. */
(function(){
'use strict';
var MEDIA = 'https://media.auraprint.com.au/';
var DRAFT_KEY = 'aura-uniform-order-v1';
var TIERS = [[50, .10], [25, .08], [10, .05]];
var GST = 0.10;

function $(s, r){ return (r||document).querySelector(s); }
function $$(s, r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); }
function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
function money(n){ return '$' + (Math.round(n*100)/100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
function inc(x){ return Math.round(x * (1 + GST) * 100) / 100; }
function tierOf(q){ for (var i=0;i<TIERS.length;i++) if (q >= TIERS[i][0]) return TIERS[i][1]; return 0; }
function track(n, p){ try { if (window.auraTrack) window.auraTrack(n, p||{}); } catch(e){} }

/* ---------- quote draft (shared with uniform-order.html) ---------- */
function draft(){ try { var d = JSON.parse(localStorage.getItem(DRAFT_KEY)||'null'); return d && Array.isArray(d.lines) ? d.lines : []; } catch(e){ return []; } }
function saveDraft(lines){ try { localStorage.setItem(DRAFT_KEY, JSON.stringify({ lines:lines, saved:Date.now() })); } catch(e){} }
function draftQty(){ return draft().reduce(function(a, l){ for (var k in l.sizes) a += (+l.sizes[k]||0); return a; }, 0); }
function pill(){
  var p = $('#apPill');
  if (!p){ p = document.createElement('a'); p.id = 'apPill'; p.className = 'ap-pill'; p.href = '/uniform-order.html'; document.body.appendChild(p); }
  var q = draftQty();
  p.hidden = !q;
  p.innerHTML = 'Your quote <b>' + q + '</b>';
}
function toast(html){
  var t = $('.ap-toast'); if (t) t.remove();
  t = document.createElement('div'); t.className = 'ap-toast'; t.setAttribute('role', 'status'); t.innerHTML = html;
  document.body.appendChild(t); setTimeout(function(){ if (t.parentNode) t.remove(); }, 6500);
}
function addLines(add){
  var lines = draft();
  add.forEach(function(a){
    var ex = lines.filter(function(l){ return l.code === a.code && l.colour === a.colour && !(l.decorations||[]).length; })[0];
    if (ex){ for (var s in a.sizes) ex.sizes[s] = (+ex.sizes[s]||0) + a.sizes[s]; }
    else lines.push({ id:'l'+Date.now().toString(36)+Math.random().toString(36).slice(2,6), code:a.code, colour:a.colour,
                      colour_hex:a.colour_hex, photo:a.photo, sizes:a.sizes, decorations:[], notes:'' });
  });
  saveDraft(lines); pill();
}

/* ---------- listing ---------- */
var FAM = [['black','Black'],['white','White'],['grey','Grey'],['navy','Navy'],['blue','Blue'],['green','Green'],['red','Red'],
           ['pink','Pink'],['purple','Purple'],['orange','Orange'],['yellow','Yellow'],['brown','Brown & khaki']];
function famOf(hex){
  var m = /^#?([0-9a-f]{6})$/i.exec(hex||''); if (!m) return '';
  var n = parseInt(m[1],16), r=(n>>16&255)/255, g=(n>>8&255)/255, b=(n&255)/255;
  var mx=Math.max(r,g,b), mn=Math.min(r,g,b), l=(mx+mn)/2, d=mx-mn, s=d?d/(1-Math.abs(2*l-1)):0, h=0;
  if (d){ h = mx===r ? ((g-b)/d)%6 : mx===g ? (b-r)/d+2 : (r-g)/d+4; h*=60; if (h<0) h+=360; }
  if (l < .17) return 'black'; if (l > .9 && s < .5) return 'white';
  if (s < .14) return l > .8 ? 'white' : 'grey';
  if (h >= 200 && h < 255 && l < .32) return 'navy';
  if (h < 14 || h >= 345) return l > .72 ? 'pink' : 'red';
  if (h < 40) return (l < .45 || s < .45) ? 'brown' : 'orange';
  if (h < 68) return (s < .45 || l < .35) ? 'brown' : 'yellow';
  if (h < 170) return 'green';
  if (h < 255) return 'blue';
  if (h < 300) return 'purple';
  return 'pink';
}
function cardHtml(x){
  var cl = x.cl || [], dots = cl.slice(0, 9).map(function(c){
    return '<button type="button" style="background:'+esc(c[3]||c[1])+'" title="'+esc(c[0])+'" data-img="'+esc(c[2]||'')+'"></button>'; }).join('');
  var fam = {}; cl.forEach(function(c){ var f = famOf(c[1]); if (f) fam[f] = 1; });
  var badges = (x.s ? '<span class="ap-badge live">Live stock</span>' : '') + (x.t ? '<span class="ap-badge new">'+esc(x.t)+'</span>' : '');
  return '<article class="ap-card" data-b="'+esc(x.b)+'" data-g="'+esc(x.g)+'" data-k="'+esc(x.k)+'" data-p="'+x.p+'" data-f="'+Object.keys(fam).join(' ')+'" data-n="'+esc((x.b+' '+x.c+' '+x.n+' '+cl.map(function(c){return c[0];}).join(' ')).toLowerCase())+'">'+
    '<a class="ph" href="/apparel/p/'+esc(x.u)+'.html" tabindex="-1"><img loading="lazy" src="'+esc(x.i)+'" alt="'+esc(x.b+' '+x.n)+'" width="480" height="480"><span class="badges">'+badges+'</span></a>'+
    '<div class="bd"><span class="br">'+esc(x.b)+' · '+esc(x.c)+'</span><h3><a href="/apparel/p/'+esc(x.u)+'.html">'+esc(x.n)+'</a></h3>'+
    '<div class="ap-dots">'+dots+(cl.length > 9 ? '<em>+'+(cl.length-9)+'</em>' : '')+'</div>'+
    '<div class="pr">From '+money(x.p)+' <small>inc GST</small></div></div></article>';
}
function initList(root){
  var grid = $('.ap-grid', root), more = $('.ap-more', root), countEl = $('.ap-count', root);
  var st = { q:'', b:'', g:'', f:'', k:'', sort:'', shown:48 };
  /* The filter bar (.ap-tools) is rendered as a sibling ABOVE the list section, not inside it, so look up controls page-wide. */
  var ctl = document;
  var cards = [];
  function collect(){ cards = $$('.ap-card', grid).map(function(el, i){ return { el:el, i:i, b:el.dataset.b, g:el.dataset.g, k:el.dataset.k, p:+el.dataset.p, f:el.dataset.f||'', n:el.dataset.n||'' }; }); }
  function apply(){
    var words = st.q.toLowerCase().split(/\s+/).filter(Boolean);
    var list = cards.filter(function(c){
      if (st.b && c.b !== st.b) return false;
      if (st.k && c.k !== st.k) return false;
      if (st.g && c.g !== st.g && !(st.g !== 'kids' && c.g === 'unisex')) return false;
      if (st.f && (' '+c.f+' ').indexOf(' '+st.f+' ') < 0) return false;
      for (var i=0;i<words.length;i++) if (c.n.indexOf(words[i]) < 0) return false;
      return true;
    });
    if (st.sort === 'lo') list.sort(function(a,b){ return a.p - b.p; });
    else if (st.sort === 'hi') list.sort(function(a,b){ return b.p - a.p; });
    else list.sort(function(a,b){ return a.i - b.i; });
    cards.forEach(function(c){ c.el.hidden = true; });
    list.forEach(function(c, i){ c.el.hidden = i >= st.shown; grid.appendChild(c.el); });
    if (countEl) countEl.textContent = list.length + (list.length === 1 ? ' style' : ' styles') + (list.length > st.shown ? ', showing ' + st.shown : '');
    if (more) more.hidden = list.length <= st.shown;
    var empty = $('.ap-empty', root); if (empty) empty.hidden = list.length > 0;
  }
  function wire(){
    var q = $('#apQ', ctl); if (q) q.addEventListener('input', function(){ st.q = q.value; st.shown = 48; apply(); });
    $$('[data-filter]', ctl).forEach(function(sel){ sel.addEventListener('change', function(){ st[sel.dataset.filter] = sel.value; st.shown = 48; apply(); track('apparel_filter', { filter: sel.dataset.filter, value: sel.value }); }); });
    $$('.ap-chips', ctl).forEach(function(ch){
      ch.addEventListener('click', function(e){
        var b = e.target.closest('button'); if (!b) return;
        $$('button', ch).forEach(function(x){ x.classList.toggle('on', x === b); });
        st[ch.dataset.key] = b.dataset.v || ''; st.shown = 48; apply();
      });
    });
    if (more) more.addEventListener('click', function(){ st.shown += 48; apply(); });
    grid.addEventListener('mouseover', dotSwap); grid.addEventListener('click', function(e){ if (e.target.matches('.ap-dots button')){ e.preventDefault(); dotSwap(e); } });
  }
  function dotSwap(e){
    var d = e.target.closest && e.target.closest('.ap-dots button'); if (!d || !d.dataset.img) return;
    var img = d.closest('.ap-card').querySelector('.ph img'); if (img.src !== d.dataset.img) img.src = d.dataset.img;
  }
  var params = new URLSearchParams(location.search);
  if (params.get('q')){ st.q = params.get('q'); var qi = $('#apQ', ctl); if (qi) qi.value = st.q; }
  if (root.dataset.src === 'index'){
    fetch('/data/apparel/index.json?v=' + (root.dataset.ver||'1')).then(function(r){ return r.json(); }).then(function(rows){
      grid.innerHTML = rows.map(cardHtml).join(''); collect(); wire(); apply();
    }).catch(function(){ if (countEl) countEl.textContent = 'The range could not load. Please refresh the page.'; });
  } else { collect(); wire(); apply(); }
}

/* ---------- product page ---------- */
function initPdp(root){
  var D = JSON.parse($('#apData').textContent);
  var S = { ci:0, size:null, view:'front', gal:-1, stock:null, live:false, asAt:'' };
  var cols = D.colours, sizes = D.sizes;
  function exPrice(ci, sz){
    for (var i=0;i<D.prices.length;i++){ var r = D.prices[i];
      if ((r.c === null || r.c.indexOf(ci) > -1) && r.s.indexOf(sz) > -1) return r.x; }
    return null;
  }
  function stockOf(ci, sz){
    if (!S.stock) return null;
    var m = S.stock[cols[ci].n.toLowerCase()]; if (!m) return null;
    var v = m[sz]; if (v == null) v = m[String(sz).toLowerCase()];
    return v == null ? null : v;
  }
  function stockLabel(q){ if (q == null) return ''; if (q <= 0) return 'Out'; if (q >= 500) return '500+'; return q + ''; }
  /* gallery */
  function mainSrc(){
    var c = cols[S.ci];
    if (S.gal > -1 && D.gallery[S.gal]) return D.gallery[S.gal];
    return (S.view === 'back' && c.back) ? c.back : c.img;
  }
  function renderGal(){
    var c = cols[S.ci];
    $('#apMain').src = mainSrc(); $('#apMain').alt = D.brand + ' ' + D.name + ' in ' + c.n + (S.view === 'back' ? ', back' : '');
    $('#apViewFront').classList.toggle('on', S.gal < 0 && S.view === 'front');
    var vb = $('#apViewBack'); vb.disabled = !c.back; vb.classList.toggle('on', S.gal < 0 && S.view === 'back');
    var th = [{ src:c.img, k:'front' }].concat(c.back ? [{ src:c.back, k:'back' }] : []).concat(D.gallery.map(function(g, i){ return { src:g, k:'g'+i }; }));
    $('#apThumbs').innerHTML = th.map(function(t){
      var on = (t.k === 'front' && S.gal < 0 && S.view === 'front') || (t.k === 'back' && S.gal < 0 && S.view === 'back') || (t.k === 'g'+S.gal);
      return '<button type="button" data-k="'+t.k+'" class="'+(on?'on':'')+'" aria-label="View '+t.k+'"><img src="'+esc(t.src)+'" alt="" loading="lazy"></button>'; }).join('');
  }
  /* buy box */
  function renderBuy(){
    var c = cols[S.ci];
    $('#apColName').textContent = c.n;
    $$('#apSwatches button').forEach(function(b, i){ b.classList.toggle('on', i === S.ci); b.setAttribute('aria-pressed', i === S.ci); });
    $('#apSizes').innerHTML = sizes.map(function(sz){
      var p = exPrice(S.ci, sz), q = stockOf(S.ci, sz), lab = stockLabel(q);
      var cls = q == null ? '' : q <= 0 ? 'out' : q < 20 ? 'lo' : '';
      return '<button type="button" data-s="'+esc(sz)+'" '+(p == null ? 'disabled' : '')+' class="'+(S.size === sz ? 'on' : '')+'">'+esc(sz === 'OSFA' ? 'One size' : sz)+
        (lab ? '<small class="'+cls+'">'+(q > 0 ? lab + ' left' : 'Out')+'</small>' : '')+'</button>';
    }).join('');
    var p = S.size ? exPrice(S.ci, S.size) : null;
    if (p == null){ var lo = null; sizes.forEach(function(sz){ var x = exPrice(S.ci, sz); if (x != null && (lo == null || x < lo)) lo = x; }); p = lo; $('#apFrom').hidden = false; }
    else $('#apFrom').hidden = true;
    if (p != null){ $('#apPInc').textContent = money(inc(p)); $('#apPEx').textContent = money(p) + ' ex GST'; }
  }
  function setColour(i){ S.ci = i; S.gal = -1; if (S.size && exPrice(i, S.size) == null) S.size = null; renderGal(); renderBuy(); highlightRow(); }
  document.addEventListener('click', function(e){
    var t;
    if ((t = e.target.closest('#apSwatches button'))){ setColour(+t.dataset.i); }
    else if ((t = e.target.closest('#apSizes button'))){ S.size = t.dataset.s; renderBuy(); }
    else if ((t = e.target.closest('#apThumbs button'))){ var k = t.dataset.k; if (k === 'front' || k === 'back'){ S.view = k; S.gal = -1; } else S.gal = +k.slice(1); renderGal(); }
    else if ((t = e.target.closest('#apViewFront, #apViewBack'))){ S.view = t.id === 'apViewBack' ? 'back' : 'front'; S.gal = -1; renderGal(); }
    else if ((t = e.target.closest('[data-step]'))){ var q = $('#apQtyIn'); q.value = Math.max(1, (+q.value||1) + (+t.dataset.step)); }
    else if (e.target.closest('#apAdd')) addSingle();
    else if (e.target.closest('#apToGrid')) $('#bulk').scrollIntoView({ behavior:'smooth', block:'start' });
    else if (e.target.closest('#apGridAdd')) addGrid();
    else if (e.target.closest('#apGridClear')){ $$('#apTable input').forEach(function(i){ i.value = ''; i.classList.remove('has'); }); gridTotals(); }
  });
  function line(ci, sizesObj){ var c = cols[ci], o = {}; for (var k in sizesObj) o[k === 'OSFA' ? 'One size' : k] = sizesObj[k]; sizesObj = o; return { code:D.id, colour:c.n, colour_hex:c.h, photo:c.img, sizes:sizesObj }; }
  function done(q){
    toast('Added ' + q + ' × ' + esc(D.name) + ' to your quote. <a href="/uniform-order.html">Add your logo &rarr;</a>');
    track('add_to_quote', { item_id:D.id, item_brand:D.brand, quantity:q });
  }
  function addSingle(){
    var msg = $('#apMsg');
    if (!S.size){ msg.style.color = '#b42318'; msg.textContent = 'Pick a size first, or use the bulk order grid for a size run.'; return; }
    var q = Math.max(1, Math.floor(+$('#apQtyIn').value || 1)), o = {}; o[S.size] = q;
    addLines([line(S.ci, o)]); msg.textContent = ''; done(q);
  }
  /* bulk order grid */
  function buildGrid(){
    var head = '<tr><th>Colour</th>' + sizes.map(function(s){ return '<th>'+esc(s === 'OSFA' ? 'Qty' : s)+'</th>'; }).join('') + '</tr>';
    var rows = cols.map(function(c, ci){
      return '<tr data-ci="'+ci+'"><td><i style="background:'+esc(c.g||c.h)+'"></i>'+esc(c.n)+'</td>' + sizes.map(function(sz){
        var p = exPrice(ci, sz); if (p == null) return '<td class="na">–</td>';
        var q = stockOf(ci, sz), ph = q == null ? '' : (q <= 0 ? 'Out' : stockLabel(q) + ' avail.');
        return '<td><input type="number" inputmode="numeric" min="0" step="1" data-ci="'+ci+'" data-s="'+esc(sz)+'" placeholder="'+ph+'" aria-label="'+esc(c.n+' '+sz)+'"></td>';
      }).join('') + '</tr>';
    }).join('');
    var tot = '<tr class="tot"><td>Totals</td>' + sizes.map(function(s){ return '<td data-tot="'+esc(s)+'">0</td>'; }).join('') + '</tr>';
    var keep = {}; $$('#apTable input').forEach(function(i){ if (+i.value > 0) keep[i.dataset.ci+'|'+i.dataset.s] = i.value; });
    $('#apTable').innerHTML = '<thead>'+head+'</thead><tbody>'+rows+tot+'</tbody>';
    $$('#apTable input').forEach(function(i){ var v = keep[i.dataset.ci+'|'+i.dataset.s]; if (v){ i.value = v; i.classList.add('has'); } });
    gridTotals(); highlightRow();
  }
  function highlightRow(){ $$('#apTable tr[data-ci]').forEach(function(r){ r.style.background = (+r.dataset.ci === S.ci) ? '#fdf8f3' : ''; }); }
  function gridTotals(){
    var bySize = {}, qty = 0, ex = 0, overs = 0;
    $$('#apTable input').forEach(function(i){
      var v = Math.max(0, Math.floor(+i.value || 0)); i.classList.toggle('has', v > 0);
      var sq = stockOf(+i.dataset.ci, i.dataset.s); var over = v > 0 && sq != null && v > sq; i.classList.toggle('over', over); if (over) overs++;
      if (!v) return; bySize[i.dataset.s] = (bySize[i.dataset.s]||0) + v; qty += v; ex += v * exPrice(+i.dataset.ci, i.dataset.s);
    });
    $$('#apTable [data-tot]').forEach(function(td){ td.textContent = bySize[td.dataset.tot] || 0; });
    var t = tierOf(qty), net = ex * (1 - t);
    $('#apGQty').textContent = qty;
    $('#apGTot').textContent = money(inc(net));
    $('#apGNote').textContent = qty ? (money(net) + ' ex GST' + (t ? ', includes ' + Math.round(t*100) + '% bulk saving' : '') + '. Garments only, decoration quoted with your logo.' + (overs ? ' Orange boxes are more than the supplier has in stock today, so we will confirm a restock date.' : '')) : 'Enter quantities by colour and size.';
    $$('.ap-bt [data-t]').forEach(function(d){ d.classList.toggle('on', +d.dataset.t === t); });
    $('#apGridAdd').disabled = !qty;
  }
  function addGrid(){
    var by = {};
    $$('#apTable input').forEach(function(i){ var v = Math.floor(+i.value||0); if (v > 0){ (by[i.dataset.ci] = by[i.dataset.ci] || {})[i.dataset.s] = v; } });
    var add = Object.keys(by).map(function(ci){ return line(+ci, by[ci]); });
    if (!add.length) return;
    var q = add.reduce(function(a, l){ for (var k in l.sizes) a += l.sizes[k]; return a; }, 0);
    addLines(add); $$('#apTable input').forEach(function(i){ i.value = ''; }); gridTotals(); done(q);
  }
  $('#apTable').addEventListener('input', gridTotals);
  /* stock */
  function loadStock(){
    if (!D.stock) return;
    var url = D.stock === 'ap' ? MEDIA + 'stock/ap/' + encodeURIComponent(D.code) : MEDIA + 'stock/' + (D.stock === 'ws' ? 'ws' : 'fb') + '/' + D.code.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'') + '.json';
    fetch(url).then(function(r){ return r.ok ? r.json() : null; }).then(function(j){
      if (!j || !j.stock) return;
      var m = {}; for (var k in j.stock) m[k.toLowerCase()] = j.stock[k];
      S.stock = m; S.live = !!j.live; S.asAt = j.as_at || '';
      var when = S.asAt ? new Date(S.asAt) : null;
      var note = S.live ? 'Stock shown is live from the supplier warehouse.' :
        'Stock shown is the supplier’s Australian warehouse stock' + (when && !isNaN(when) ? ' as at ' + when.toLocaleString('en-AU', { day:'numeric', month:'short', hour:'numeric', minute:'2-digit' }) : '') + '. We confirm it when we order.';
      $$('.ap-stocknote').forEach(function(n){ n.textContent = note; });
      renderBuy(); buildGrid();
    }).catch(function(){});
  }
  renderGal(); renderBuy(); buildGrid(); loadStock();
  var pre = new URLSearchParams(location.search).get('colour');
  if (pre){ cols.forEach(function(c, i){ if (c.n.toLowerCase() === pre.toLowerCase()) setColour(i); }); }
  track('view_item', { item_id:D.id, item_brand:D.brand, item_category:D.cat });
}

document.addEventListener('DOMContentLoaded', function(){
  var l = $('[data-ap-list]'); if (l) initList(l);
  var p = $('[data-ap-pdp]'); if (p) initPdp(p);
  pill();
  foldChips();
});
/* Brand and category chips wrap onto extra lines on desktop. On a phone, rows with
   more than 6 chips show the first 6 plus a "+N more" chip that opens the rest. */
function foldChips(){
  $$('.ap-chips').forEach(function(ch){
    var bs = $$('button', ch); if (bs.length <= 7 || $('.ap-more', ch)) return;
    bs.slice(6).forEach(function(b){ b.classList.add('ap-x'); });
    var m = document.createElement('button'); m.type = 'button'; m.className = 'ap-more';
    m.textContent = '+' + (bs.length - 6) + ' more'; ch.appendChild(m); ch.classList.add('fold');
    m.addEventListener('click', function(e){ e.stopPropagation(); ch.classList.remove('fold'); });
    ch.addEventListener('click', function(e){ var b = e.target.closest('button'); if (b && b.classList.contains('ap-x')) ch.classList.remove('fold'); });
  });
}
})();
