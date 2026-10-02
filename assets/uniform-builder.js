/* Uniform order builder - uniform-order.html (2 Oct 2026).
   Customer picks garments from data/uniform-range.json, chooses colour, sizes,
   decoration method and positions, uploads a logo, and sends. The request lands
   in the CRM as a lead with structured lines (leads.uniform_order) through the
   uniform-request Edge Function, which also signs the logo uploads.
   No prices are shown: decoration pricing is not yet confirmed. */
(function(){
'use strict';
var CFG = window.AURA_CONFIG || {};
var DRAFT_KEY = 'aura-uniform-order-v1';
var CATS = [
  ['all','All'],['polos','Polos'],['tees','Tees'],['hoodies','Hoodies & jackets'],
  ['hivis','Hi-vis & workwear'],['corporate','Corporate'],['hospitality','Hospitality'],['caps','Caps & hats']
];
var METHODS = [
  { id:'Embroidery',  short:'Stitched thread. Hard-wearing and premium.' },
  { id:'DTF print',   short:'Full colour transfer. Great for small runs.' },
  { id:'Screen print',short:'Best value from about 25 pieces.' },
  { id:'Not sure',    short:'We will recommend one.' }
];

var S = { range:[], byCode:{}, lines:[], cat:'all', brand:'', q:'', edit:null, files:[] };

/* ---------- helpers ---------- */
function $(s, r){ return (r||document).querySelector(s); }
function $$(s, r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); }
function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
function uid(){ return 'l' + Date.now().toString(36) + Math.random().toString(36).slice(2,6); }
function qtyOf(l){ var t=0; for (var k in l.sizes) t += (+l.sizes[k]||0); return t; }
function totalQty(){ return S.lines.reduce(function(a,l){ return a + qtyOf(l); }, 0); }
function store(){ try { localStorage.setItem(DRAFT_KEY, JSON.stringify({ lines:S.lines, saved:Date.now() })); } catch(e){} }
function restore(){
  try {
    var d = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null');
    if (d && Array.isArray(d.lines) && Date.now() - (d.saved||0) < 30*864e5)
      S.lines = d.lines.filter(function(l){ return S.byCode[l.code]; });
  } catch(e){}
}
function track(name, p){ try { if (window.auraTrack) window.auraTrack(name, p||{}); } catch(e){} }

function shapeOf(g){
  if (g.cat === 'caps') return 'cap';
  if (/apron/i.test(g.name)) return 'apron';
  return 'top';
}
function taped(g){
  return g.cat === 'hivis' && /tape|taped|reflective|day\/night|d\/n|night/i.test([g.name, g.fabric, g.features, g.compliance, g.spec].join(' '));
}
var POSITIONS = {
  top:   [['Front',['Left chest','Right chest','Centre front','Full front']],['Back',['Back neck','Upper back','Full back']],['Sleeves',['Left sleeve','Right sleeve']]],
  cap:   [['Cap',['Front','Left side','Right side','Back']]],
  apron: [['Apron',['Bib / chest','Pocket','Waist']]]
};
function defaultMethod(g){
  if (g.cat === 'tees') return 'DTF print';
  return 'Embroidery';
}
function recommended(g, pos){
  if (g.cat === 'tees') return 'DTF print';
  if (g.cat === 'hoodies' && /back|full front/i.test(pos||'')) return 'DTF print';
  return 'Embroidery';
}
function photoFor(g, colour){
  var sw = (g.swatches||[]).filter(function(s){ return s.n === colour; })[0];
  if (sw && sw.img) return sw.img;
  var first = (g.swatches||[]).filter(function(s){ return s.img; })[0];
  return first ? first.img : null;
}
function hexFor(g, colour){
  var sw = (g.swatches||[]).filter(function(s){ return s.n === colour; })[0];
  return sw && sw.h ? sw.h : null;
}
function catLabel(c){ var m = CATS.filter(function(x){ return x[0]===c; })[0]; return m ? m[1] : c; }

/* ---------- placement diagram ---------- */
var ZONES = {
  top: {
    'Right chest':[58,60,30,22], 'Left chest':[112,60,30,22], 'Centre front':[78,66,44,34], 'Full front':[64,64,72,100],
    'Right sleeve':[14,58,24,16], 'Left sleeve':[162,58,24,16],
    'Back neck':[285,38,30,12], 'Upper back':[262,56,76,28], 'Full back':[264,58,72,108]
  },
  cap:   { 'Front':[92,78,76,40], 'Right side':[48,100,28,24], 'Left side':[184,100,28,24], 'Back':[300,98,40,18] },
  apron: { 'Bib / chest':[80,40,60,40], 'Pocket':[80,140,60,30], 'Waist':[70,100,80,24] }
};
function placementSvg(g, decos){
  var shape = shapeOf(g), z = ZONES[shape], on = {};
  (decos||[]).forEach(function(d){ on[d.position] = d.method; });
  var body = '';
  var stroke = 'stroke="#0F0F10" stroke-width="2" stroke-linejoin="round" fill="#fff"';
  if (shape === 'top'){
    var tee = function(dx, neck){
      return '<path '+stroke+' d="M'+(70+dx)+',28 L'+(45+dx)+',35 L'+(8+dx)+',72 L'+(30+dx)+',96 L'+(48+dx)+',84 L'+(48+dx)+',215 L'+(152+dx)+',215 L'+(152+dx)+',84 L'+(170+dx)+',96 L'+(192+dx)+',72 L'+(155+dx)+',35 L'+(130+dx)+',28 Q'+(100+dx)+','+neck+' '+(70+dx)+',28 Z"/>';
    };
    body += tee(0, 50) + tee(200, 38);
    if (taped(g)){
      [[150],[176]].forEach(function(y){ body += '<rect x="48" y="'+y+'" width="104" height="9" fill="#cfd4da"/><rect x="248" y="'+y+'" width="104" height="9" fill="#cfd4da"/>'; });
      body += '<path d="M250,36 L262,215 M350,36 L338,215" stroke="#cfd4da" stroke-width="8" opacity=".9"/>';
    }
    body += '<text x="100" y="228" text-anchor="middle" font-size="11" fill="#8a847d" font-family="Inter,sans-serif">FRONT</text><text x="300" y="228" text-anchor="middle" font-size="11" fill="#8a847d" font-family="Inter,sans-serif">BACK</text>';
  } else if (shape === 'cap'){
    body += '<path '+stroke+' d="M40,140 Q40,50 130,50 Q220,50 220,140 Z"/><path '+stroke+' d="M28,140 Q130,178 232,140 Q130,156 28,140 Z"/><path d="M130,52 L130,138" stroke="#cfc7bd" stroke-width="1.5"/>';
    body += '<path '+stroke+' d="M260,150 Q260,70 320,70 Q380,70 380,150 Z"/><path d="M300,150 Q300,128 320,128 Q340,128 340,150" stroke="#0F0F10" stroke-width="2" fill="#FAF8F5"/>';
    body += '<text x="130" y="200" text-anchor="middle" font-size="11" fill="#8a847d" font-family="Inter,sans-serif">FRONT</text><text x="320" y="200" text-anchor="middle" font-size="11" fill="#8a847d" font-family="Inter,sans-serif">BACK</text>';
  } else {
    body += '<path '+stroke+' d="M82,30 L138,30 L140,90 L172,96 L166,210 L54,210 L48,96 L80,90 Z"/><path d="M82,30 Q60,8 70,0 M138,30 Q160,8 150,0 M48,100 L10,110 M172,100 L210,110" stroke="#0F0F10" stroke-width="1.5" fill="none"/>';
  }
  Object.keys(z).forEach(function(k){
    var r = z[k], sel = !!on[k];
    if (!sel && /^Full /.test(k)) return;
    body += '<rect x="'+r[0]+'" y="'+r[1]+'" width="'+r[2]+'" height="'+r[3]+'" rx="4" '+
      (sel ? 'fill="url(#ubg)" opacity=".92"' : 'fill="none" stroke="#d9d3cb" stroke-dasharray="2 3"') + '><title>'+esc(k)+'</title></rect>';
    if (sel){
      var lbl = on[k] === 'Embroidery' ? 'EMB' : on[k] === 'DTF print' ? 'DTF' : on[k] === 'Screen print' ? 'SCR' : '?';
      body += '<text x="'+(r[0]+r[2]/2)+'" y="'+(r[1]+r[3]/2+4)+'" text-anchor="middle" font-size="10" font-weight="800" fill="#fff" font-family="Inter,sans-serif">'+lbl+'</text>';
    }
  });
  var vb = shape === 'apron' ? '0 0 220 215' : '0 0 400 232';
  return '<svg viewBox="'+vb+'" role="img" aria-label="Decoration positions"><defs><linearGradient id="ubg" x1="0" x2="1"><stop offset="0" stop-color="#7C3AED"/><stop offset=".55" stop-color="#EC4899"/><stop offset="1" stop-color="#F97316"/></linearGradient></defs>'+body+'</svg>';
}

/* ---------- catalogue ---------- */
function filtered(){
  var q = S.q.trim().toLowerCase();
  return S.range.filter(function(g){
    if (S.cat !== 'all' && g.cat !== S.cat) return false;
    if (S.brand && g.brand !== S.brand) return false;
    if (q){
      var hay = (g.brand+' '+g.code+' '+g.name+' '+(g.fabric||'')+' '+(g.best||'')+' '+(g.swatches||[]).map(function(s){return s.n;}).join(' ')).toLowerCase();
      return q.split(/\s+/).every(function(w){ return hay.indexOf(w) > -1; });
    }
    return true;
  });
}
function renderCats(){
  var counts = {}; S.range.forEach(function(g){ counts[g.cat] = (counts[g.cat]||0)+1; });
  $('#ubCats').innerHTML = CATS.map(function(c){
    var n = c[0]==='all' ? S.range.length : (counts[c[0]]||0);
    if (!n) return '';
    return '<button type="button" data-cat="'+c[0]+'" class="'+(S.cat===c[0]?'on':'')+'" aria-pressed="'+(S.cat===c[0])+'">'+esc(c[1])+'<small>'+n+'</small></button>';
  }).join('');
}
function renderGrid(){
  var list = filtered(), inOrder = {};
  S.lines.forEach(function(l){ inOrder[l.code] = (inOrder[l.code]||0) + qtyOf(l); });
  $('#ubCount').textContent = list.length + ' garment' + (list.length===1?'':'s') + (S.cat!=='all' ? ' in ' + catLabel(S.cat) : '') + (S.brand ? ' from ' + S.brand : '');
  if (!list.length){
    $('#ubGrid').innerHTML = '<p class="ub-empty" style="grid-column:1/-1"><b>Nothing matches that search.</b>Try another word, or <a href="quote.html?cat=Apparel%20%26%20Workwear">tell us what you need</a> and we will source it.</p>';
    return;
  }
  $('#ubGrid').innerHTML = list.map(function(g){
    var img = photoFor(g), sw = g.swatches||[];
    var dots = sw.slice(0,10).map(function(s){ return '<i style="background:'+esc(s.h||'#ddd')+'" title="'+esc(s.n)+'"></i>'; }).join('') + (sw.length>10 ? '<em>+'+(sw.length-10)+'</em>' : '');
    return '<button type="button" class="ub-card" data-code="'+esc(g.code)+'" aria-label="Add '+esc(g.name)+' to your order">'+
      '<div class="ph">'+(img ? '<img src="'+esc(img)+'" alt="" loading="lazy" width="170" height="170">' : '<span class="noimg">Photo on request</span>')+
        (inOrder[g.code] ? '<span class="in-order">'+inOrder[g.code]+' in order</span>' : '')+'</div>'+
      '<span class="br">'+esc(g.brand)+' &middot; '+esc(g.code)+'</span>'+
      '<h3>'+esc(g.name)+'</h3>'+
      (g.fabric ? '<p class="meta">'+esc(g.fabric)+'</p>' : '')+
      (sw.length ? '<div class="dots">'+dots+'</div>' : '')+
      '<span class="add">Choose &amp; add</span></button>';
  }).join('');
}

/* ---------- order panel ---------- */
function lineSummary(l){
  var sz = Object.keys(l.sizes).filter(function(k){ return +l.sizes[k] > 0; }).map(function(k){ return k+' '+l.sizes[k]; }).join(', ');
  var dec = (l.decorations||[]).map(function(d){ return d.method + ' ' + d.position.toLowerCase(); }).join(', ');
  return { sz:sz, dec:dec || 'Decoration not chosen' };
}
function renderPanel(){
  var t = totalQty(), n = S.lines.length;
  $$('.ub-units').forEach(function(el){ el.textContent = t + ' item' + (t===1?'':'s'); });
  $('#ubLines').innerHTML = !n ? '<div class="ub-empty"><b>Your order is empty</b>Pick a garment to choose its colour, sizes and where your logo goes. Mix as many styles as your team needs.</div>' :
    S.lines.map(function(l){
      var g = S.byCode[l.code], s = lineSummary(l), img = l.photo || photoFor(g, l.colour);
      return '<div class="ub-line"><div class="th">'+(img ? '<img src="'+esc(img)+'" alt="">' : '<i style="background:'+esc(l.colour_hex||'#eee')+'"></i>')+'</div><div>'+
        '<h4>'+esc(g.name)+'</h4><p><b>'+esc(l.colour||'Colour to confirm')+'</b> &middot; '+qtyOf(l)+' units</p>'+
        '<p>'+esc(s.sz)+'</p><p>'+esc(s.dec)+'</p>'+
        '<div class="acts"><button type="button" data-act="edit" data-id="'+l.id+'">Edit</button><button type="button" data-act="dup" data-id="'+l.id+'">Add another colour</button><button type="button" class="rm" data-act="rm" data-id="'+l.id+'">Remove</button></div></div></div>';
    }).join('');
  var warn = '';
  if (S.lines.some(function(l){ return !(l.decorations||[]).length; })) warn = 'One or more garments has no decoration chosen. That is fine for plain garments, otherwise tap Edit.';
  $('#ubWarn').innerHTML = warn; $('#ubWarn').hidden = !warn;
  $$('.ub-go').forEach(function(b){ b.disabled = !n; });
  $('#ubBar').classList.toggle('hide', !n);
  renderGrid();
  store();
}

/* ---------- configurator ---------- */
function openCfg(code, lineId){
  var g = S.byCode[code]; if (!g) return;
  var line = lineId ? S.lines.filter(function(l){ return l.id === lineId; })[0] : null;
  S.edit = line ? JSON.parse(JSON.stringify(line)) : {
    id:null, code:code, colour:(g.swatches&&g.swatches[0]&&g.swatches[0].n)||'', sizes:{}, decorations:[], notes:''
  };
  if (!line && (g.cat === 'caps' || shapeOf(g)==='apron')) S.edit.decorations = [{ position: shapeOf(g)==='cap' ? 'Front' : 'Bib / chest', method:'Embroidery' }];
  else if (!line && g.cat !== 'tees') S.edit.decorations = [{ position:'Left chest', method:defaultMethod(g) }];
  else if (!line) S.edit.decorations = [{ position:'Centre front', method:'DTF print' }];
  var d = $('#ubDlg');
  $('#ubDBrand').textContent = g.brand + ' · ' + g.code + ' · ' + catLabel(g.cat);
  $('#ubDName').textContent = g.name;
  $('#ubDSave').textContent = line ? 'Update order' : 'Add to order';
  $('#ubFacts').innerHTML =
    (g.fabric ? '<b>Fabric:</b> '+esc(g.fabric)+'<br>' : '') +
    (g.compliance ? '<b>Standard:</b> '+esc(g.compliance)+'<br>' : '') +
    (g.best ? esc(g.best)+'<br>' : '') +
    (g.spec ? '<a href="'+esc(g.spec)+'" target="_blank" rel="noopener nofollow">Full spec &amp; size chart</a>' : '');
  renderCfg();
  if (d.showModal) d.showModal(); else d.setAttribute('open','');
  var db = $('.ub-db', d); if (db) db.scrollTop = 0;
  track('uniform_builder_open', { code:g.code });
}
function renderCfg(){
  var e = S.edit, g = S.byCode[e.code], shape = shapeOf(g);
  // photo
  var img = photoFor(g, e.colour);
  $('#ubPhoto').innerHTML = img ? '<img src="'+esc(img)+'" alt="'+esc(g.name+' in '+(e.colour||''))+'">' : '<span class="noimg">Photo on request. Colours and fit confirmed on your quote.</span>';
  $('#ubPlace').innerHTML = placementSvg(g, e.decorations) + '<p>'+(shape==='top' ? 'Left chest means the wearer\'s left.' : shape==='cap' ? 'Front panel is about 90 to 120mm wide.' : 'Positions shown as a guide.')+'</p>';
  // colour
  var sw = g.swatches||[];
  $('#ubColName').textContent = e.colour || (sw.length ? 'Choose a colour' : '');
  $('#ubCols').innerHTML = sw.length ?
    '<div class="ub-sw" role="radiogroup" aria-label="Colour">'+sw.map(function(s){
      var on = s.n === e.colour;
      return '<button type="button" role="radio" aria-checked="'+on+'" class="'+(on?'on':'')+'" data-col="'+esc(s.n)+'" title="'+esc(s.n)+'" aria-label="'+esc(s.n)+'" style="background:'+esc(s.h||'#ddd')+'"></button>';
    }).join('')+'</div>' :
    '<p class="hint">Colours for this style are confirmed on your quote. Tell us the colour you want.</p><input class="ub-colin" id="ubColIn" maxlength="60" placeholder="e.g. Navy" value="'+esc(e.colour)+'">';
  // sizes
  var sl = g.size_list || ['One size'];
  $('#ubSizeHint').innerHTML = g.size_mode === 'guide' ? 'Exact size range for this style is confirmed on your quote.' :
    sl.indexOf('6XL+') > -1 ? 'Need bigger than 5XL? Put the quantity in 6XL+ and the exact sizes in the notes.' :
    sl[0] === 'One size' ? 'One size. Enter how many you need.' : 'Enter how many of each size. A decorated garment cannot be swapped for another size, so check sizes with your team first.';
  $('#ubSizes').innerHTML = sl.map(function(z){
    var v = e.sizes[z] || '';
    return '<label>'+esc(z)+'<input type="number" inputmode="numeric" min="0" max="5000" step="1" data-size="'+esc(z)+'" value="'+esc(v)+'" class="'+(v?'has':'')+'" aria-label="Quantity '+esc(z)+'"></label>';
  }).join('');
  // positions
  var on = {}; e.decorations.forEach(function(d){ on[d.position] = d; });
  $('#ubPos').innerHTML = POSITIONS[shape].map(function(grp){
    return '<div class="ub-pos-g">'+esc(grp[0])+'</div><div class="ub-pos">'+grp[1].map(function(p){
      return '<button type="button" data-pos="'+esc(p)+'" class="'+(on[p]?'on':'')+'" aria-pressed="'+!!on[p]+'">'+esc(p)+'</button>';
    }).join('')+'</div>';
  }).join('');
  // per-position method
  $('#ubMeth').innerHTML = !e.decorations.length ? '<p class="hint">No positions chosen. Pick at least one above, or leave it plain.</p>' :
    e.decorations.map(function(d, i){
      var rec = recommended(g, d.position);
      return '<div style="margin-bottom:12px"><p class="hint" style="margin:0 0 6px"><b style="color:#0F0F10">'+esc(d.position)+'</b></p><div class="ub-meth">'+
        METHODS.map(function(m){
          return '<button type="button" data-i="'+i+'" data-meth="'+esc(m.id)+'" class="'+(d.method===m.id?'on':'')+'" aria-pressed="'+(d.method===m.id)+'"><b>'+esc(m.id)+'</b><small>'+esc(m.short)+'</small>'+(m.id===rec?'<span class="rec">Our pick</span>':'')+'</button>';
        }).join('')+'</div></div>';
    }).join('');
  $('#ubNotes').value = e.notes || '';
  updateCfgTotals();
}
function advice(){
  var e = S.edit, g = S.byCode[e.code], q = qtyOf(e), out = [];
  var methods = {}; e.decorations.forEach(function(d){ methods[d.method] = 1; });
  if (taped(g) && e.decorations.length)
    out.push(['warn','This garment has reflective tape. Decoration cannot sit on or across the tape, and the back panel is smaller than it looks. We check the plan against this exact garment before quoting.']);
  if (methods['Screen print'] && q && q < 25)
    out.push(['warn','Screen print usually starts at about 20 to 25 pieces per design. At '+q+' pieces, DTF print is likely better value. We will advise on the quote.']);
  if (g.cat === 'caps' && q && q < 12)
    out.push(['warn','Caps are usually decorated in runs of 12 or more. Fewer is possible, we will confirm on the quote.']);
  if (methods['Embroidery'])
    out.push(['','Embroidery is priced on stitch count. Each new logo needs a one-off setup, which we keep on file so reorders do not pay it again.']);
  if (methods['DTF print'])
    out.push(['','DTF prints full colour with no setup, so it suits small runs, detailed logos and staff names.']);
  if (e.decorations.some(function(d){ return d.position === 'Full front' || d.position === 'Full back'; }) && methods['Embroidery'] && !methods['DTF print'])
    out.push(['warn','Large embroidery is heavy and costly. Full front or full back designs usually look and wear better printed.']);
  return out;
}
function updateCfgTotals(){
  var q = qtyOf(S.edit);
  $('#ubQ').textContent = q; $('#ubQ2').textContent = q;
  $('#ubAdvice').innerHTML = advice().map(function(a){ return '<p class="ub-advice '+a[0]+'">'+esc(a[1])+'</p>'; }).join('');
  $('#ubDErr').textContent = '';
}
function saveCfg(){
  var e = S.edit, g = S.byCode[e.code];
  if (!qtyOf(e)){ $('#ubDErr').textContent = 'Enter a quantity for at least one size.'; var f=$('.ub-sizes input'); if(f) f.focus(); return; }
  if ((g.swatches||[]).length && !e.colour){ $('#ubDErr').textContent = 'Choose a colour.'; return; }
  e.notes = $('#ubNotes').value.trim().slice(0,600);
  e.photo = photoFor(g, e.colour); e.colour_hex = hexFor(g, e.colour);
  Object.keys(e.sizes).forEach(function(k){ if (!(+e.sizes[k] > 0)) delete e.sizes[k]; });
  if (e.id){ S.lines = S.lines.map(function(l){ return l.id === e.id ? e : l; }); }
  else { e.id = uid(); S.lines.push(e); track('uniform_builder_add', { code:e.code, qty:qtyOf(e) }); }
  closeCfg(); renderPanel();
  flashBar();
}
function closeCfg(){ var d = $('#ubDlg'); if (d.close) d.close(); else d.removeAttribute('open'); S.edit = null; }
function flashBar(){
  var b = $('#ubBar'); if (!b) return;
  b.animate && b.animate([{transform:'translateY(6px)'},{transform:'none'}], {duration:220});
}

/* ---------- send step ---------- */
function showSend(on){
  $('#ubBrowse').hidden = on;
  $('#ubSend').classList.toggle('on', on);
  var panel = $('#ubPanel');
  (on ? $('#ubSendSide') : $('#ubBrowseSide')).appendChild(panel);
  panel.classList.remove('open'); $('#ubShade').hidden = true;
  $('#ubBar').hidden = on;
  window.scrollTo({ top: $('.ub-anchor').offsetTop - 70, behavior:'smooth' });
  if (on) track('uniform_builder_review', { lines:S.lines.length, qty:totalQty() });
}
var EXT_OK = /\.(pdf|ai|eps|svg|png|jpe?g|webp)$/i;
function addFiles(list){
  Array.prototype.forEach.call(list, function(f){
    if (S.files.length >= 5) return;
    if (!EXT_OK.test(f.name)){ alert(f.name + ' is not a logo file we can use. Please send PDF, AI, EPS, SVG, PNG or JPG.'); return; }
    if (f.size > 25*1024*1024){ alert(f.name + ' is over 25 MB. Paste a WeTransfer or Dropbox link in the notes instead.'); return; }
    S.files.push(f);
  });
  renderFiles();
}
function renderFiles(){
  $('#ubFiles').innerHTML = S.files.map(function(f, i){
    return '<li><span>'+esc(f.name)+' <small style="color:#8a847d">'+(f.size/1048576).toFixed(1)+' MB</small></span><button type="button" data-rmf="'+i+'">Remove</button></li>';
  }).join('');
}
function auMobile(raw){
  var d = String(raw||'').replace(/[^\d+]/g,'');
  if (d.indexOf('+61') === 0) d = '0' + d.slice(3); else if (d.indexOf('61') === 0 && d.length === 11) d = '0' + d.slice(2);
  return /^04\d{8}$/.test(d) ? d.slice(0,4)+' '+d.slice(4,7)+' '+d.slice(7) : null;
}
function post(path, body){
  var hosts = [CFG.supabaseUrl, CFG.supabaseFallbackUrl].filter(function(h, i, a){ return h && a.indexOf(h) === i; });
  function go(i){
    if (i >= hosts.length) return Promise.reject(new Error('blocked'));
    return fetch(hosts[i] + path, { method:'POST', headers:{ 'Content-Type':'application/json', apikey:CFG.supabaseKey||'' }, body:JSON.stringify(body) })
      .then(function(r){
        if (r.status >= 500 && i + 1 < hosts.length) return go(i+1);
        return r.json().catch(function(){ return {}; }).then(function(j){ j._status = r.status; return j; });
      }, function(){ return go(i+1); });
  }
  return go(0);
}
function submit(ev){
  ev.preventDefault();
  var f = $('#ubForm'), st = $('#ubStatus');
  $$('.bad', f).forEach(function(el){ el.classList.remove('bad'); });
  var v = function(n){ var el = f.elements[n]; return el ? String(el.value||'').trim() : ''; };
  var bad = [];
  if (!v('name')) bad.push('name');
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v('email'))) bad.push('email');
  if (!auMobile(v('phone'))) bad.push('phone');
  if (v('delivery_postcode') && !/^\d{4}$/.test(v('delivery_postcode'))) bad.push('delivery_postcode');
  if (bad.length){
    bad.forEach(function(n){ f.elements[n].classList.add('bad'); });
    st.style.color = '#b42318';
    st.textContent = bad.indexOf('phone') > -1 ? 'Please give an Australian mobile so we can text you the quote link.' : 'Please check the highlighted fields.';
    f.elements[bad[0]].focus(); return;
  }
  if (!S.lines.length){ st.textContent = 'Your order is empty.'; return; }
  var btn = $('#ubSubmit'); btn.disabled = true; btn.textContent = 'Sending…';
  st.style.color = '#6b6560'; st.textContent = '';
  var attr = {}; try { attr = (window.auraAttribution && window.auraAttribution()) || {}; } catch(e){}
  var payload = {
    name:v('name'), email:v('email'), phone:v('phone'), company:v('company'), needed_by:v('needed_by'),
    delivery_postcode:v('delivery_postcode'), notes:v('notes'), website:(f.elements.website||{}).value||'',
    source_page:'uniform-order.html', attribution:attr,
    lines:S.lines.map(function(l){
      var g = S.byCode[l.code];
      return { brand:g.brand, code:g.code, name:g.name, cat:g.cat, colour:l.colour, colour_hex:l.colour_hex, photo:l.photo,
               sizes:l.sizes, decorations:l.decorations, notes:l.notes };
    }),
    logos:S.files.map(function(x){ return { filename:x.name, size_bytes:x.size, content_type:x.type }; })
  };
  post('/functions/v1/uniform-request', payload).then(function(res){
    if (!res || !res.ok) throw new Error(res && res.error || 'failed');
    var ups = (res.uploads||[]).map(function(u, i){
      var file = S.files[i];
      if (!u.upload_url || !file) return Promise.resolve(false);
      return fetch(u.upload_url, { method:'PUT', headers:{ 'Content-Type': file.type || 'application/octet-stream', 'x-upsert':'false' }, body:file })
        .then(function(r){ return r.ok; }, function(){ return false; });
    });
    return Promise.all(ups).then(function(okList){
      var failed = okList.filter(function(x){ return !x; }).length;
      // admin alert email, same channel as every other website form
      if (CFG.web3formsKey){
        var fd = new FormData();
        fd.append('access_key', CFG.web3formsKey);
        fd.append('subject', 'Uniform order request ' + res.ref + ' (' + res.total_qty + ' items) – Aura Print');
        fd.append('from_name', 'Aura Print website');
        fd.append('name', payload.name); fd.append('email', payload.email); fd.append('phone', payload.phone);
        if (payload.company) fd.append('company', payload.company);
        fd.append('order', res.summary || '');
        fd.append('crm_status', 'Saved to the CRM as a lead.' + (failed ? ' WARNING: ' + failed + ' logo file(s) did not upload, ask the customer to email them.' : ''));
        fetch('https://api.web3forms.com/submit', { method:'POST', body:fd }).catch(function(){});
      }
      track('generate_lead', { form_name:'Uniform order builder', page_path:location.pathname, stored:true, emailed:!!CFG.web3formsKey });
      try { if (window.auraAdsConvert) window.auraAdsConvert('lead'); } catch(e){}
      S.lines = []; S.files = []; store();
      $('#ubDoneRef').textContent = res.ref;
      $('#ubDoneQty').textContent = res.total_qty;
      $('#ubDoneFiles').hidden = !failed;
      $('#ubSend').classList.remove('on'); $('#ubBrowse').hidden = true; $('#ubDone').classList.add('on');
      $('#ubBar').hidden = true;
      window.scrollTo({ top:0, behavior:'smooth' });
    });
  }).catch(function(err){
    st.style.color = '#b42318';
    var m = err && err.message;
    st.innerHTML = (m && m !== 'failed' && m !== 'blocked' ? esc(m) + ' ' : 'Something went wrong sending that. ') +
      'If it keeps happening, call <b>1300 291 277</b> or email <b>admin@auraprint.com.au</b>. Your order is saved on this device.';
    btn.disabled = false; btn.textContent = 'Send my order request';
  });
}

/* ---------- wiring ---------- */
function wire(){
  $('#ubCats').addEventListener('click', function(e){ var b = e.target.closest('button[data-cat]'); if (!b) return; S.cat = b.dataset.cat; renderCats(); renderGrid(); });
  $('#ubSearch').addEventListener('input', function(e){ S.q = e.target.value; renderGrid(); });
  $('#ubBrand').addEventListener('change', function(e){ S.brand = e.target.value; renderGrid(); });
  $('#ubGrid').addEventListener('click', function(e){ var c = e.target.closest('.ub-card'); if (c) openCfg(c.dataset.code); });
  $('#ubLines').addEventListener('click', function(e){
    var b = e.target.closest('button[data-act]'); if (!b) return;
    var l = S.lines.filter(function(x){ return x.id === b.dataset.id; })[0]; if (!l) return;
    $('#ubPanel').classList.remove('open'); $('#ubShade').hidden = true;
    if (b.dataset.act === 'edit') openCfg(l.code, l.id);
    else if (b.dataset.act === 'rm'){ if (confirm('Remove ' + S.byCode[l.code].name + ' (' + (l.colour||'') + ') from your order?')){ S.lines = S.lines.filter(function(x){ return x !== l; }); renderPanel(); } }
    else if (b.dataset.act === 'dup'){
      var c = JSON.parse(JSON.stringify(l)); c.id = null; c.sizes = {}; c.colour = ''; S.edit = c;
      openCfg(l.code); S.edit = c; S.edit.decorations = JSON.parse(JSON.stringify(l.decorations)); S.edit.notes = l.notes; renderCfg();
    }
  });
  // dialog
  var d = $('#ubDlg');
  $('#ubDClose').addEventListener('click', closeCfg);
  d.addEventListener('click', function(e){ if (e.target === d) closeCfg(); });
  d.addEventListener('cancel', function(){ S.edit = null; });
  $('#ubCols').addEventListener('click', function(e){ var b = e.target.closest('button[data-col]'); if (!b) return; S.edit.colour = b.dataset.col; renderCfg(); });
  $('#ubCols').addEventListener('input', function(e){ if (e.target.id === 'ubColIn'){ S.edit.colour = e.target.value.slice(0,60); $('#ubColName').textContent = S.edit.colour; } });
  $('#ubSizes').addEventListener('input', function(e){
    var i = e.target; if (!i.dataset.size) return;
    var n = Math.max(0, Math.min(5000, Math.floor(+i.value || 0)));
    if (n) S.edit.sizes[i.dataset.size] = n; else delete S.edit.sizes[i.dataset.size];
    i.classList.toggle('has', !!n); updateCfgTotals();
  });
  $('#ubPos').addEventListener('click', function(e){
    var b = e.target.closest('button[data-pos]'); if (!b) return;
    var p = b.dataset.pos, ds = S.edit.decorations, idx = -1;
    ds.forEach(function(x, i){ if (x.position === p) idx = i; });
    if (idx > -1) ds.splice(idx, 1);
    else {
      if (ds.length >= 6) return;
      ds.push({ position:p, method:recommended(S.byCode[S.edit.code], p) });
    }
    renderCfg();
  });
  $('#ubMeth').addEventListener('click', function(e){
    var b = e.target.closest('button[data-meth]'); if (!b) return;
    S.edit.decorations[+b.dataset.i].method = b.dataset.meth; renderCfg();
  });
  $('#ubDSave').addEventListener('click', saveCfg);
  // panel / mobile bar
  function sheet(on){ $('#ubPanel').classList.toggle('open', on); $('#ubShade').hidden = !on; }
  $('#ubBarOpen').addEventListener('click', function(){ sheet(true); });
  $('#ubPanelX').addEventListener('click', function(){ sheet(false); });
  $('#ubShade').addEventListener('click', function(){ sheet(false); });
  $$('.ub-go').forEach(function(b){ b.addEventListener('click', function(){ if (S.lines.length) showSend(true); }); });
  $('#ubBack').addEventListener('click', function(){ showSend(false); });
  // files
  var drop = $('#ubDrop'), fi = $('#ubFile');
  drop.addEventListener('click', function(){ fi.click(); });
  drop.addEventListener('keydown', function(e){ if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); fi.click(); } });
  fi.addEventListener('change', function(){ addFiles(fi.files); fi.value = ''; });
  ['dragenter','dragover'].forEach(function(t){ drop.addEventListener(t, function(e){ e.preventDefault(); drop.classList.add('over'); }); });
  ['dragleave','drop'].forEach(function(t){ drop.addEventListener(t, function(e){ e.preventDefault(); drop.classList.remove('over'); }); });
  drop.addEventListener('drop', function(e){ if (e.dataTransfer) addFiles(e.dataTransfer.files); });
  $('#ubFiles').addEventListener('click', function(e){ var b = e.target.closest('button[data-rmf]'); if (b){ S.files.splice(+b.dataset.rmf, 1); renderFiles(); } });
  $('#ubForm').addEventListener('submit', submit);
}

function init(){
  fetch('data/uniform-range.json?v=' + (window.UB_VER||'1')).then(function(r){ return r.json(); }).then(function(d){
    S.range = d; d.forEach(function(g){ S.byCode[g.code] = g; });
    var brands = Array.from(new Set(d.map(function(g){ return g.brand; }))).sort();
    $('#ubBrand').innerHTML = '<option value="">All brands</option>' + brands.map(function(b){ return '<option>'+esc(b)+'</option>'; }).join('');
    var p = new URLSearchParams(location.search);
    if (p.get('cat') && CATS.some(function(c){ return c[0] === p.get('cat'); })) S.cat = p.get('cat');
    restore(); wire(); renderCats(); renderPanel();
    var add = p.get('add') || p.get('product');
    if (add && S.byCode[add]) openCfg(add);
  }).catch(function(){
    $('#ubGrid').innerHTML = '<p class="ub-empty" style="grid-column:1/-1"><b>The garment range did not load.</b>Please refresh, or <a href="quote.html?cat=Apparel%20%26%20Workwear">send us a quote request</a> instead.</p>';
  });
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
