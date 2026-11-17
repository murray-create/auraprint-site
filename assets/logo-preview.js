/* Logo preview (17 Nov 2026).
   A customer uploads their logo and sees it on the garment, in the colour they
   picked, at true scale, before they ask for a quote. Used by the apparel product
   pages (assets/apparel.js) and the uniform order builder (assets/uniform-builder.js).

   - The garment is found on its product photo the same way the CRM work order
     proof does it (crm.html analysePhoto): overall box, body width on a row 62% of
     the way down, shoulder line. The body is taken as 530mm across.
   - A photo that is not a clean cutout (model or lifestyle shot) falls back to a
     drawing in the garment colour, so a logo is never placed by guesswork.
   - No back photo: the back is built from the front outline (crm.html synthBack).
   - A logo on a plain background has the background removed, so it does not show
     as a white box on a dark garment. The customer can switch that off.
   - The original file is kept in the browser (IndexedDB) and travels with the
     quote request: the order builder adds it to its upload list as Logo A.
   - This is a GUIDE, not a proof. The page says so. The signed proof still happens
     in the CRM after the quote is accepted.
   Fixed positions only, on purpose. Widths use the published guide ranges
   (uniform-decoration.html, uniform-builder.js GUIDE, crm.html POS_GUIDE). */
(function(){
'use strict';
if (window.AuraLogo) return;

var PREF_KEY = 'aura-logo-placement-v1';
var KEEP_MS = 30 * 864e5;
/* name, view, mm right of centre (viewer's right), mm below the shoulder line,
   [min, max] width mm, default width mm, tallest it may be in mm */
var POS = {
  top: [
    ['Left chest',   'front',  105, 200, [80, 100],  90, 100],
    ['Right chest',  'front', -105, 200, [70, 100],  90, 100],
    ['Centre front', 'front',    0, 235, [180, 260], 220, 260],
    ['Full front',   'front',    0, 300, [250, 350], 280, 380],
    ['Upper back',   'back',     0, 170, [200, 280], 240, 160],
    ['Full back',    'back',     0, 310, [250, 350], 300, 380]
  ],
  cap: [
    ['Front', 'cap', 0, 0, [90, 120], 100, 55]
  ]
};
function posDef(shape, name){ var l = POS[shape] || []; for (var i = 0; i < l.length; i++) if (l[i][0] === name) return l[i]; return null; }
var SHOWN_EXT = /\.(png|jpe?g|webp|svg)$/i, FILE_EXT = /\.(pdf|ai|eps|svg|png|jpe?g|webp)$/i;

function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
function track(n, p){ try { if (window.auraTrack) window.auraTrack(n, p || {}); } catch(e){} }

/* ---------- which garments can be previewed ---------- */
var TOP_CATS = { polos:1, tees:1, hoodies:1, jackets:1, shirts:1, 'hi-vis':1, hivis:1, workwear:1, knitwear:1, hospitality:1,
                 healthcare:1, activewear:1, corporate:1 };
function supports(cat, name){
  var n = String(name || '');
  if (cat === 'headwear' || cat === 'caps') return /beanie|visor|bucket|scarf|headband|balaclava|hard hat|helmet/i.test(n) ? null : 'cap';
  if (!TOP_CATS[cat]) return null;
  if (/pant|trouser|short(?!\s*sleeve)|skirt|skort|legging|jean|overall|coverall|bib|apron|sock|dress|tie\b|scarf|belt|glove|chino|jogger|trackie|cargo/i.test(n)) return null;
  return 'top';
}

/* ---------- the customer's logo file, kept in this browser ---------- */
var MEM = null;
function idb(){
  return new Promise(function(res, rej){
    try {
      var r = indexedDB.open('aura-logo', 1);
      r.onupgradeneeded = function(){ r.result.createObjectStore('f'); };
      r.onsuccess = function(){ res(r.result); };
      r.onerror = function(){ rej(r.error); };
    } catch(e){ rej(e); }
  });
}
function getFile(){
  return idb().then(function(db){
    return new Promise(function(res){
      var q = db.transaction('f').objectStore('f').get('A');
      q.onsuccess = function(){ res(q.result || null); }; q.onerror = function(){ res(null); };
    });
  }).catch(function(){ return MEM; }).then(function(v){
    if (!v || !v.blob || Date.now() - (v.saved || 0) > KEEP_MS) return null;
    try { return new File([v.blob], v.name || 'logo', { type: v.type || v.blob.type || '' }); } catch(e){ return null; }
  });
}
function setFile(file){
  var v = { name:file.name, type:file.type, blob:file, saved:Date.now() };
  MEM = v;
  return idb().then(function(db){
    return new Promise(function(res){
      var tx = db.transaction('f', 'readwrite'); tx.objectStore('f').put(v, 'A');
      tx.oncomplete = function(){ res(true); }; tx.onerror = tx.onabort = function(){ res(false); };
    });
  }).catch(function(){ return false; });
}
function clearFile(){
  MEM = null;
  try { localStorage.removeItem(PREF_KEY); } catch(e){}
  return idb().then(function(db){
    return new Promise(function(res){ var tx = db.transaction('f', 'readwrite'); tx.objectStore('f').delete('A'); tx.oncomplete = tx.onerror = function(){ res(); }; });
  }).catch(function(){});
}
/* Chosen positions, per garment code, so "add to quote" can carry them. */
function prefs(){ try { var p = JSON.parse(localStorage.getItem(PREF_KEY) || '{}'); return p && typeof p === 'object' ? p : {}; } catch(e){ return {}; } }
function placement(code){ var p = prefs()[code]; return Array.isArray(p) ? p : []; }
function setPlacement(code, list){ var p = prefs(); if (list && list.length) p[code] = list; else delete p[code]; try { localStorage.setItem(PREF_KEY, JSON.stringify(p)); } catch(e){} }

/* ---------- images ---------- */
function loadImg(src){
  return new Promise(function(res){ var im = new Image(); im.onload = function(){ res(im); }; im.onerror = function(){ res(null); }; im.src = src; });
}
/* Fetch as a blob so the canvas can read the pixels (the media host sends CORS). */
var BLOBS = {};
function blobUrl(u){
  if (!u) return Promise.resolve(null);
  if (/^(data|blob):/.test(u)) return Promise.resolve(u);
  if (BLOBS[u]) return BLOBS[u];
  return (BLOBS[u] = fetch(u, { mode:'cors' }).then(function(r){ return r.ok ? r.blob() : null; })
    .then(function(b){ return b ? URL.createObjectURL(b) : null; }).catch(function(){ return null; }));
}
/* Same method as the CRM proof (crm.html analysePhoto). */
function analysePhoto(src){
  return loadImg(src).then(function(im){
    if (!im) return null;
    var W = im.naturalWidth, H = im.naturalHeight, sc = Math.min(1, 240 / Math.max(W, H)), w = Math.max(1, Math.round(W * sc)), h = Math.max(1, Math.round(H * sc));
    var cv = document.createElement('canvas'); cv.width = w; cv.height = h; var cx = cv.getContext('2d'); cx.drawImage(im, 0, 0, w, h);
    var d; try { d = cx.getImageData(0, 0, w, h).data; } catch(e){ return null; }
    var tr = d[3] < 20, bg = [d[0], d[1], d[2]];
    function fg(x, y){ var o = (y * w + x) * 4; if (tr) return d[o + 3] >= 20; return Math.abs(d[o] - bg[0]) + Math.abs(d[o + 1] - bg[1]) + Math.abs(d[o + 2] - bg[2]) > 36; }
    var x0 = w, x1 = -1, y0 = h, y1 = -1, x, y;
    for (y = 0; y < h; y++) for (x = 0; x < w; x++) if (fg(x, y)){ if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    if (x1 < 0) return null;
    var fgn = 0; for (y = y0; y <= y1; y++) for (x = x0; x <= x1; x++) if (fg(x, y)) fgn++;
    if (fgn / ((x1 - x0 + 1) * (y1 - y0 + 1)) > 0.93) return null;          /* not a cutout */
    var ow = x1 - x0, ry = Math.round(y0 + (y1 - y0) * 0.62), mid = Math.round((x0 + x1) / 2), bx0 = mid, bx1 = mid;
    while (bx0 > x0 && fg(bx0 - 1, ry)) bx0--; while (bx1 < x1 && fg(bx1 + 1, ry)) bx1++;
    if (bx1 - bx0 > ow * 0.8 || bx1 - bx0 < ow * 0.3){ bx0 = mid - ow * 0.31; bx1 = mid + ow * 0.31; }
    var yt = y0;
    for (y = y0; y < ry; y++){ var a = -1, b = -1; for (x = x0; x <= x1; x++) if (fg(x, y)){ if (a < 0) a = x; b = x; } if (a >= 0 && b - a >= ow * 0.5){ yt = y; break; } }
    var k = 1 / sc;
    return { W:W, H:H, x0:x0 * k, x1:x1 * k, y0:y0 * k, y1:y1 * k, bx0:bx0 * k, bx1:bx1 * k, yt:yt * k };
  });
}
/* Back view built from the front photo (crm.html synthBack): real outline, flat colour, soft shading. */
function synthBack(src, hex){
  return loadImg(src).then(function(im){
    if (!im) return null;
    var W = im.naturalWidth, H = im.naturalHeight, cv = document.createElement('canvas'); cv.width = W; cv.height = H; var cx = cv.getContext('2d'); cx.drawImage(im, 0, 0);
    var id; try { id = cx.getImageData(0, 0, W, H); } catch(e){ return null; }
    var d = id.data, N = W * H, tr = d[3] < 20, bg = [d[0], d[1], d[2]], isBg = new Uint8Array(N), p, o, x, y;
    for (p = 0; p < N; p++){ o = p * 4; isBg[p] = tr ? (d[o + 3] < 20 ? 1 : 0) : ((Math.abs(d[o] - bg[0]) + Math.abs(d[o + 1] - bg[1]) + Math.abs(d[o + 2] - bg[2])) <= 36 ? 1 : 0); }
    var out = new Uint8Array(N), st = []; function push(q){ if (isBg[q] && !out[q]){ out[q] = 1; st.push(q); } }
    for (x = 0; x < W; x++){ push(x); push((H - 1) * W + x); } for (y = 0; y < H; y++){ push(y * W); push(y * W + W - 1); }
    while (st.length){ p = st.pop(); var px = p % W; if (px > 0) push(p - 1); if (px < W - 1) push(p + 1); if (p >= W) push(p - W); if (p < N - W) push(p + W); }
    var L = new Float32Array(N), sum = 0, n = 0, sr = 0, sg = 0, sb = 0;
    for (p = 0; p < N; p++){ if (out[p]) continue; o = p * 4; L[p] = 0.299 * d[o] + 0.587 * d[o + 1] + 0.114 * d[o + 2]; sum += L[p]; n++; sr += d[o]; sg += d[o + 1]; sb += d[o + 2]; }
    if (!n) return null;
    var mean = sum / n; for (p = 0; p < N; p++) if (out[p]) L[p] = mean;
    var r = Math.max(4, Math.round(W / 28)), tmp = new Float32Array(N);
    for (var pass = 0; pass < 3; pass++){
      for (y = 0; y < H; y++){ var acc = 0, row = y * W; for (x = -r; x <= r; x++) acc += L[row + Math.min(W - 1, Math.max(0, x))]; for (x = 0; x < W; x++){ tmp[row + x] = acc / (2 * r + 1); acc += L[row + Math.min(W - 1, x + r + 1)] - L[row + Math.max(0, x - r)]; } }
      for (x = 0; x < W; x++){ var ac = 0; for (y = -r; y <= r; y++) ac += tmp[Math.min(H - 1, Math.max(0, y)) * W + x]; for (y = 0; y < H; y++){ L[y * W + x] = ac / (2 * r + 1); ac += tmp[Math.min(H - 1, y + r + 1) * W + x] - tmp[Math.max(0, y - r) * W + x]; } }
    }
    var m = /^#([0-9a-f]{6})$/i.exec(hex || ''), cr, cg, cb;
    if (m){ var v = parseInt(m[1], 16); cr = v >> 16 & 255; cg = v >> 8 & 255; cb = v & 255; } else { cr = sr / n; cg = sg / n; cb = sb / n; }
    for (p = 0; p < N; p++){ o = p * 4; if (out[p]){ d[o] = d[o + 1] = d[o + 2] = 255; d[o + 3] = 255; continue; }
      var sh = Math.min(1.08, Math.max(0.88, L[p] / (mean || 1))); d[o] = Math.min(255, cr * sh); d[o + 1] = Math.min(255, cg * sh); d[o + 2] = Math.min(255, cb * sh); d[o + 3] = 255; }
    cx.putImageData(id, 0, 0);
    return cv.toDataURL('image/jpeg', 0.9);
  });
}

/* ---------- the logo: read it, and lift it off a plain background ---------- */
function trimmed(cv){
  var w = cv.width, h = cv.height, d = cv.getContext('2d').getImageData(0, 0, w, h).data, x0 = w, x1 = -1, y0 = h, y1 = -1, x, y;
  for (y = 0; y < h; y++) for (x = 0; x < w; x++) if (d[(y * w + x) * 4 + 3] > 12){ if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  if (x1 < 0) return null;
  var o = document.createElement('canvas'); o.width = x1 - x0 + 1; o.height = y1 - y0 + 1;
  o.getContext('2d').drawImage(cv, x0, y0, o.width, o.height, 0, 0, o.width, o.height);
  return { url:o.toDataURL('image/png'), w:o.width, h:o.height };
}
function prepareLogo(file){
  var u = URL.createObjectURL(file);
  return loadImg(u).then(function(im){
    if (!im) { URL.revokeObjectURL(u); return null; }
    var nw = im.naturalWidth || 600, nh = im.naturalHeight || 600, vec = /svg/i.test(file.type) || /\.svg$/i.test(file.name);
    var sc = Math.min(vec ? 1000 / Math.max(nw, nh) : 1, 1000 / Math.max(nw, nh)), w = Math.max(1, Math.round(nw * sc)), h = Math.max(1, Math.round(nh * sc));
    var cv = document.createElement('canvas'); cv.width = w; cv.height = h; var cx = cv.getContext('2d');
    cx.drawImage(im, 0, 0, w, h); URL.revokeObjectURL(u);
    var id; try { id = cx.getImageData(0, 0, w, h); } catch(e){ return null; }
    var d = id.data, N = w * h, p, o, clear = 0;
    for (p = 0; p < N; p++) if (d[p * 4 + 3] < 250) clear++;
    var res = { small: !vec && Math.max(nw, nh) < 500, raw: trimmed(cv), cut: null };
    if (!res.raw) return null;
    if (clear / N > 0.005) return res;                       /* already has a transparent background */
    /* plain background: the four corners agree */
    function at(x, y){ o = (y * w + x) * 4; return [d[o], d[o + 1], d[o + 2]]; }
    function diff(a, b){ return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]); }
    var c = [at(1, 1), at(w - 2, 1), at(1, h - 2), at(w - 2, h - 2)], i, j, same = true;
    for (i = 0; i < 4; i++) for (j = i + 1; j < 4; j++) if (diff(c[i], c[j]) > 30) same = false;
    if (!same) return res;
    var bg = [(c[0][0] + c[1][0] + c[2][0] + c[3][0]) / 4, (c[0][1] + c[1][1] + c[2][1] + c[3][1]) / 4, (c[0][2] + c[1][2] + c[2][2] + c[3][2]) / 4];
    var T0 = 40, T1 = 120, dist = new Uint16Array(N);
    for (p = 0; p < N; p++){ o = p * 4; dist[p] = Math.abs(d[o] - bg[0]) + Math.abs(d[o + 1] - bg[1]) + Math.abs(d[o + 2] - bg[2]); }
    var out = new Uint8Array(N), st = [], x, y;
    function push(q){ if (!out[q] && dist[q] <= T0){ out[q] = 1; st.push(q); } }
    for (x = 0; x < w; x++){ push(x); push((h - 1) * w + x); } for (y = 0; y < h; y++){ push(y * w); push(y * w + w - 1); }
    while (st.length){ p = st.pop(); var px = p % w; if (px > 0) push(p - 1); if (px < w - 1) push(p + 1); if (p >= w) push(p - w); if (p < N - w) push(p + w); }
    var gone = 0; for (p = 0; p < N; p++) if (out[p]) gone++;
    if (gone / N < 0.02 || gone / N > 0.995) return res;
    /* soften the edge: a kept pixel beside a removed one, still close to the background colour, goes part clear */
    for (p = 0; p < N; p++){
      o = p * 4;
      if (out[p]){ d[o + 3] = 0; continue; }
      if (dist[p] >= T1) continue;
      var pxx = p % w, edge = (pxx > 0 && out[p - 1]) || (pxx < w - 1 && out[p + 1]) || (p >= w && out[p - w]) || (p < N - w && out[p + w]);
      if (edge) d[o + 3] = Math.round(255 * Math.max(0.15, (dist[p] - T0) / (T1 - T0)));
    }
    var c2 = document.createElement('canvas'); c2.width = w; c2.height = h; c2.getContext('2d').putImageData(id, 0, 0);
    res.cut = trimmed(c2);
    return res;
  });
}

/* ---------- drawings, used when there is no clean product photo ---------- */
function dark(hex){ var m = /^#?([0-9a-f]{6})$/i.exec(hex || ''); if (!m) return false; var v = parseInt(m[1], 16); return (0.299 * (v >> 16 & 255) + 0.587 * (v >> 8 & 255) + 0.114 * (v & 255)) < 70; }
function drawing(view, hex){
  var fill = /^#[0-9a-f]{6}$/i.test(hex || '') ? hex : '#e9e4dc', st = dark(fill) ? '#6b6660' : '#0F0F10';
  if (view === 'cap')
    return { svg:'<path d="M95,330 Q95,95 300,95 Q505,95 505,330 Z" fill="' + fill + '" stroke="' + st + '" stroke-width="4"/>' +
                 '<path d="M70,330 Q300,410 530,330 Q300,372 70,330 Z" fill="' + fill + '" stroke="' + st + '" stroke-width="4" stroke-linejoin="round"/>' +
                 '<path d="M70,330 Q300,410 530,330 Q300,372 70,330 Z" fill="#000" fill-opacity=".14"/>',
             inf:{ W:600, H:470, x0:95, x1:505, y0:95, y1:400, drawn:true } };
  var neck = view === 'back' ? 100 : 135;
  return { svg:'<path d="M300,70 Q380,' + neck + ' 460,70 L530,85 L745,235 L665,335 L645,300 L645,800 L115,800 L115,300 L95,335 L15,235 L230,85 Z" fill="' + fill + '" stroke="' + st + '" stroke-width="4" stroke-linejoin="round"/>' +
               (view === 'back' ? '' : '<path d="M300,70 Q380,' + (neck - 22) + ' 460,70" fill="none" stroke="' + st + '" stroke-width="3"/>'),
           inf:{ W:760, H:860, x0:15, x1:745, y0:70, y1:800, bx0:115, bx1:645, yt:70, drawn:true } };
}

/* ---------- the dialog ---------- */
var CSS = '.lp-dlg{border:0;padding:0;border-radius:20px;width:min(980px,calc(100vw - 24px));max-height:calc(100dvh - 24px);background:#FAF8F5;color:#0F0F10;font:400 15px/1.5 Inter,system-ui,sans-serif;box-shadow:0 30px 80px rgba(15,15,16,.35);overflow:hidden}' +
  '.lp-dlg::backdrop{background:rgba(15,15,16,.55)}' +
  '.lp-open{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;margin:12px 0 4px;border:1.5px solid #0F0F10;background:#fff;color:#0F0F10;border-radius:99px;padding:12px 16px;font:700 14.5px Inter,sans-serif;cursor:pointer}' +
  '.lp-open:hover{background:#0F0F10;color:#fff}.lp-open small{font-weight:500;opacity:.75}' +
  '.lp-in{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,1fr);max-height:calc(100dvh - 24px)}' +
  '.lp-l{background:#fff;padding:18px;display:flex;flex-direction:column;gap:10px;min-width:0}' +
  '.lp-r{padding:22px 22px 18px;overflow:auto;min-width:0;display:flex;flex-direction:column;gap:16px}' +
  '.lp-stage{position:relative;background:#fff;border:1px solid #eee7df;border-radius:14px;aspect-ratio:1/1;display:flex;align-items:center;justify-content:center;overflow:hidden}' +
  '.lp-stage svg{width:100%;height:100%;display:block}' +
  '.lp-stage .lp-wait{color:#8a847d;font-size:13.5px}' +
  '.lp-tag{position:absolute;left:10px;top:10px;background:#0F0F10;color:#fff;font:700 11px Inter,sans-serif;letter-spacing:.04em;text-transform:uppercase;border-radius:99px;padding:5px 10px}' +
  '.lp-tabs{display:flex;gap:6px;justify-content:center}' +
  '.lp-tabs button,.lp-chips button{font:700 13px Inter,sans-serif;border:1.5px solid #e2dcd4;background:#fff;color:#0F0F10;border-radius:99px;padding:8px 14px;cursor:pointer}' +
  '.lp-tabs button.on,.lp-chips button.on{background:#0F0F10;color:#fff;border-color:#0F0F10}' +
  '.lp-chips button.act{box-shadow:0 0 0 3px rgba(236,72,153,.35)}' +
  '.lp-note{font-size:12.5px;color:#6b6660;margin:0;text-align:center}' +
  '.lp-h{display:flex;justify-content:space-between;align-items:flex-start;gap:12px}' +
  '.lp-h h2{font:400 24px/1.15 "Archivo Black",Inter,sans-serif;margin:0}' +
  '.lp-h p{margin:4px 0 0;color:#6b6660;font-size:13.5px}' +
  '.lp-x{border:0;background:#efeae3;width:36px;height:36px;border-radius:50%;font-size:20px;line-height:1;cursor:pointer;flex:none}' +
  '.lp-sec>b{display:block;font:700 12px Inter,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#6b6660;margin-bottom:8px}' +
  '.lp-drop{border:2px dashed #cfc7bd;border-radius:14px;padding:20px 14px;text-align:center;background:#fff;cursor:pointer}' +
  '.lp-drop.over,.lp-drop:focus-visible{border-color:#EC4899;outline:0}' +
  '.lp-drop b{display:block;font-size:15px}.lp-drop span{font-size:12.5px;color:#6b6660}' +
  '.lp-file{display:flex;gap:12px;align-items:center;background:#fff;border:1px solid #eee7df;border-radius:14px;padding:10px}' +
  '.lp-thumb{width:64px;height:64px;border-radius:10px;flex:none;background:repeating-conic-gradient(#e9e4dc 0 25%,#fff 0 50%) 0 0/14px 14px;display:flex;align-items:center;justify-content:center}' +
  '.lp-thumb img{max-width:56px;max-height:56px}' +
  '.lp-file div{min-width:0;flex:1}.lp-file div b{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:14px}' +
  '.lp-file button{border:0;background:none;color:#7C3AED;font:700 13px Inter,sans-serif;padding:0;cursor:pointer;text-decoration:underline}' +
  '.lp-chk{display:flex;gap:8px;align-items:center;font-size:13.5px;margin-top:8px;cursor:pointer}' +
  '.lp-warn{font-size:12.5px;color:#9a5b00;background:#fff6e5;border-radius:10px;padding:8px 10px;margin:8px 0 0}' +
  '.lp-chips{display:flex;flex-wrap:wrap;gap:6px}' +
  '.lp-size{display:flex;align-items:center;gap:12px}.lp-size input{flex:1;accent-color:#EC4899;min-width:0}.lp-size output{font:700 14px Inter,sans-serif;white-space:nowrap}' +
  '.lp-hint{font-size:12.5px;color:#6b6660;margin:6px 0 0}' +
  '.lp-foot{margin-top:auto;display:flex;flex-direction:column;gap:8px}' +
  '.lp-go{border:0;border-radius:99px;padding:14px 18px;font:700 15px Inter,sans-serif;color:#fff;background:linear-gradient(90deg,#7C3AED,#EC4899 55%,#F97316);cursor:pointer}' +
  '.lp-go:disabled{opacity:.45;cursor:default}' +
  '.lp-guide{font-size:12px;color:#6b6660;margin:0}' +
  '@media (max-width:760px){.lp-dlg{width:100vw;max-width:100vw;max-height:100dvh;height:100dvh;border-radius:0;margin:0}.lp-in{display:block;max-height:100dvh;height:100dvh;overflow:auto}' +
  '.lp-l{padding:12px;position:sticky;top:0;z-index:2;box-shadow:0 6px 16px rgba(15,15,16,.08)}.lp-stage{aspect-ratio:auto;height:38dvh}.lp-note{display:none}.lp-r{padding:16px 14px 20px;overflow:visible}.lp-h h2{font-size:20px}}';

(function(){ var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s); })();
var D = null, ST = null;
function build(){
  if (D) return D;
  D = document.createElement('dialog'); D.className = 'lp-dlg'; D.setAttribute('aria-labelledby', 'lpTitle');
  D.innerHTML = '<div class="lp-in"><div class="lp-l"><div class="lp-stage" id="lpStage"></div><div class="lp-tabs" id="lpTabs"></div>' +
      '<p class="lp-note" id="lpNote"></p></div>' +
    '<div class="lp-r"><div class="lp-h"><div><h2 id="lpTitle">Preview your logo</h2><p id="lpSub"></p></div><button type="button" class="lp-x" id="lpX" aria-label="Close">&times;</button></div>' +
      '<div class="lp-sec"><b>1. Your logo</b><div id="lpLogo"></div><input type="file" id="lpIn" accept=".png,.jpg,.jpeg,.webp,.svg,.pdf,.ai,.eps" hidden></div>' +
      '<div class="lp-sec"><b>2. Where it goes</b><div class="lp-chips" id="lpPos"></div><p class="lp-hint" id="lpPosHint"></p></div>' +
      '<div class="lp-sec" id="lpSizeSec"><b>3. How wide</b><div class="lp-size"><input type="range" id="lpW" step="5" aria-label="Logo width in millimetres"><output id="lpWOut"></output></div><p class="lp-hint" id="lpWHint"></p></div>' +
      '<div class="lp-foot"><button type="button" class="lp-go" id="lpSave"></button>' +
      '<p class="lp-guide">This is a guide, not a proof. We confirm the final size and position with you on a proof before anything is printed or stitched. Embroidery is stitched thread, so very fine detail and colour fades may be simplified.</p></div></div></div>';
  document.body.appendChild(D);
  D.querySelector('#lpX').addEventListener('click', function(){ D.close(); });
  D.addEventListener('click', function(e){ if (e.target === D) D.close(); });
  var inp = D.querySelector('#lpIn');
  inp.addEventListener('change', function(){ if (inp.files[0]) takeFile(inp.files[0]); inp.value = ''; });
  D.querySelector('#lpLogo').addEventListener('click', function(e){
    if (e.target.closest('[data-pick]')) inp.click();
    else if (e.target.closest('[data-rm]')){ clearFile(); ST.file = null; ST.logo = null; ST.note = ''; renderLogo(); renderStage(); renderFoot(); }
  });
  D.querySelector('#lpLogo').addEventListener('keydown', function(e){ if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.lp-drop')){ e.preventDefault(); inp.click(); } });
  D.querySelector('#lpLogo').addEventListener('change', function(e){ if (e.target.id === 'lpCut'){ ST.cutOn = e.target.checked; renderLogo(); renderStage(); } });
  ['dragenter', 'dragover'].forEach(function(ev){ D.addEventListener(ev, function(e){ e.preventDefault(); var z = D.querySelector('.lp-drop'); if (z) z.classList.add('over'); }); });
  ['dragleave', 'drop'].forEach(function(ev){ D.addEventListener(ev, function(e){ e.preventDefault(); var z = D.querySelector('.lp-drop'); if (z) z.classList.remove('over'); }); });
  D.addEventListener('drop', function(e){ var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]; if (f) takeFile(f); });
  D.querySelector('#lpPos').addEventListener('click', function(e){
    var b = e.target.closest('button[data-p]'); if (!b) return;
    var p = b.dataset.p, def = posDef(ST.shape, p);
    if (ST.sel[p] != null && ST.act === p){ delete ST.sel[p]; ST.act = Object.keys(ST.sel)[0] || null; }
    else { if (ST.sel[p] == null) ST.sel[p] = def[5]; ST.act = p; }
    if (ST.act) ST.view = posDef(ST.shape, ST.act)[1];
    renderPos(); renderSize(); renderTabs(); renderStage(); renderFoot();
  });
  D.querySelector('#lpTabs').addEventListener('click', function(e){
    var b = e.target.closest('button[data-v]'); if (!b) return;
    ST.view = b.dataset.v;
    var inView = Object.keys(ST.sel).filter(function(p){ return posDef(ST.shape, p)[1] === ST.view; });
    if (inView.length && inView.indexOf(ST.act) < 0) ST.act = inView[0];
    renderTabs(); renderPos(); renderSize(); renderStage();
  });
  D.querySelector('#lpW').addEventListener('input', function(e){ if (ST.act){ ST.sel[ST.act] = +e.target.value; renderSize(true); renderStage(); } });
  D.querySelector('#lpSave').addEventListener('click', save);
  return D;
}
function $(s){ return D.querySelector(s); }

function takeFile(f){
  ST.note = '';
  if (!FILE_EXT.test(f.name)){ ST.note = f.name + ' is not a logo file we can use. Please choose a PNG, JPG, SVG or PDF.'; renderLogo(); return; }
  if (f.size > 25 * 1024 * 1024){ ST.note = 'That file is over 25 MB. Please choose a smaller one.'; renderLogo(); return; }
  ST.file = f; ST.logo = null; ST.busy = true; setFile(f); renderLogo();
  if (!SHOWN_EXT.test(f.name)){
    ST.busy = false;
    ST.note = 'We cannot show PDF, AI or EPS files on the garment here. Your file is saved and will go with your quote. To see a preview, choose a PNG, JPG or SVG of the same logo.';
    renderLogo(); renderStage(); renderFoot(); track('logo_preview_upload', { shown:0 }); return;
  }
  prepareLogo(f).then(function(L){
    ST.busy = false; ST.logo = L;
    if (!L) ST.note = 'We could not read that file. Please try a PNG or JPG.';
    else { ST.cutOn = !!L.cut; if (L.small) ST.note = 'This file is quite small. It is fine for a preview, but we may ask for a larger or vector file before we print.'; }
    renderLogo(); renderStage(); renderFoot(); track('logo_preview_upload', { shown: L ? 1 : 0 });
  });
}
function logoNow(){ var L = ST.logo; if (!L) return null; return (ST.cutOn && L.cut) ? L.cut : L.raw; }

function renderLogo(){
  var h, L = ST.logo, f = ST.file;
  if (!f) h = '<div class="lp-drop" data-pick tabindex="0" role="button"><b>Drop your logo here, or tap to choose</b><span>PNG, JPG or SVG shows on the garment. PDF, AI and EPS are saved for your quote.</span></div>';
  else {
    var now = logoNow();
    h = '<div class="lp-file"><span class="lp-thumb">' + (now ? '<img src="' + now.url + '" alt="">' : '') + '</span><div><b>' + esc(f.name) + '</b>' +
        (ST.busy ? '<span class="lp-hint">Reading your logo…</span>' : '<button type="button" data-pick>Change</button> &nbsp; <button type="button" data-rm>Remove</button>') + '</div></div>' +
        (L && L.cut ? '<label class="lp-chk"><input type="checkbox" id="lpCut"' + (ST.cutOn ? ' checked' : '') + '> Remove the logo background</label>' : '');
  }
  if (ST.note) h += '<p class="lp-warn">' + esc(ST.note) + '</p>';
  $('#lpLogo').innerHTML = h;
}
function renderPos(){
  $('#lpPos').innerHTML = POS[ST.shape].map(function(p){
    var on = ST.sel[p[0]] != null;
    return '<button type="button" data-p="' + esc(p[0]) + '" class="' + (on ? 'on' : '') + (ST.act === p[0] ? ' act' : '') + '" aria-pressed="' + on + '">' + esc(p[0]) + '</button>';
  }).join('');
  $('#lpPosHint').textContent = ST.shape === 'cap' ? 'The front panel is the most common place for a cap logo.' : 'Pick one or more. Left chest means the wearer\'s left. Tap a chosen position again to remove it.';
}
function fit(p){
  var def = posDef(ST.shape, p), L = logoNow(), ar = L ? L.h / L.w : 0.5, w = ST.sel[p], h = w * ar, capped = false;
  if (h > def[6]){ h = def[6]; w = h / ar; capped = true; }
  return { w:w, h:h, capped:capped };
}
function renderSize(keep){
  var sec = $('#lpSizeSec'); sec.hidden = !ST.act; if (!ST.act) return;
  var def = posDef(ST.shape, ST.act), r = $('#lpW'), f = fit(ST.act);
  if (!keep){ r.min = def[4][0]; r.max = def[4][1]; r.value = ST.sel[ST.act]; }
  $('#lpWOut').textContent = Math.round(f.w) + ' x ' + Math.round(f.h) + ' mm';
  $('#lpWHint').textContent = ST.act + ': usually ' + def[4][0] + ' to ' + def[4][1] + 'mm wide.' + (f.capped ? ' Your logo is tall, so it is held to ' + def[6] + 'mm high.' : '');
}
function views(){ return ST.shape === 'cap' ? [['cap', 'Front']] : [['front', 'Front'], ['back', 'Back']]; }
function renderTabs(){
  var v = views();
  $('#lpTabs').innerHTML = v.length < 2 ? '' : v.map(function(x){ return '<button type="button" data-v="' + x[0] + '" class="' + (ST.view === x[0] ? 'on' : '') + '">' + x[1] + '</button>'; }).join('');
}
function renderFoot(){
  var n = Object.keys(ST.sel).length, b = $('#lpSave');
  b.textContent = ST.o.saveLabel || 'Save logo and placement';
  b.disabled = !ST.file || !n;
}
/* What to draw on for a view: the photo, a built back, or a drawing. */
function source(view){
  var c = ST.src[view]; if (c) return c;
  var o = ST.o, want = view === 'back' ? o.back : o.front;
  return (ST.src[view] = blobUrl(want).then(function(u){
    if (!u) return null;
    return analysePhoto(u).then(function(inf){ return inf ? { url:u, inf:inf, kind:'photo' } : null; });
  }).then(function(got){
    if (got || view !== 'back') return got;
    return source('front').then(function(fr){
      if (!fr || fr.kind !== 'photo') return null;
      return synthBack(fr.url, o.hex).then(function(du){ return du ? { url:du, inf:fr.inf, kind:'built' } : null; });
    });
  }).then(function(got){
    if (got) return got;
    var dr = drawing(view, o.hex); return { svg:dr.svg, inf:dr.inf, kind:'drawn' };
  }));
}
function renderStage(){
  var view = ST.view, stage = $('#lpStage'), tick = ++ST.tick;
  if (!stage.firstChild) stage.innerHTML = '<span class="lp-wait">Loading the garment…</span>';
  source(view).then(function(s){
    if (tick !== ST.tick || !ST) return;
    var inf = s.inf, L = logoNow(), pxmm, loc;
    if (view === 'cap'){ var bw = inf.x1 - inf.x0, bh = inf.y1 - inf.y0; pxmm = bw / 230; loc = function(){ return [inf.x0 + bw * 0.5, inf.y0 + bh * 0.36]; }; }
    else { var bodyW = Math.max(inf.bx1 - inf.bx0, (inf.x1 - inf.x0) * 0.45), cxm = (inf.bx0 + inf.bx1) / 2, top = inf.yt != null ? inf.yt : inf.y0; pxmm = bodyW / 530;
      loc = function(def){ return [cxm + def[2] * pxmm, top + def[3] * pxmm]; }; }
    var marks = Object.keys(ST.sel).map(function(p){
      var def = posDef(ST.shape, p); if (!def || def[1] !== view) return '';
      var a = loc(def), f = fit(p), w = f.w * pxmm, h = f.h * pxmm, x = a[0] - w / 2, y = a[1] - h / 2, sw = Math.max(inf.W, inf.H) * 0.004;
      return (L ? '<image href="' + L.url + '" x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + h.toFixed(1) + '" preserveAspectRatio="xMidYMid meet"/>'
                : '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + h.toFixed(1) + '" fill="#EC4899" fill-opacity=".28"/>') +
        ((!L || p === ST.act) ? '<rect x="' + (x - sw).toFixed(1) + '" y="' + (y - sw).toFixed(1) + '" width="' + (w + 2 * sw).toFixed(1) + '" height="' + (h + 2 * sw).toFixed(1) + '" fill="none" stroke="#EC4899" stroke-width="' + sw.toFixed(1) + '" stroke-dasharray="' + (sw * 4).toFixed(1) + ' ' + (sw * 3).toFixed(1) + '" rx="' + (sw * 2).toFixed(1) + '"/>' : '');
    }).join('');
    var base = s.svg ? s.svg : '<image href="' + s.url + '" x="0" y="0" width="' + inf.W + '" height="' + inf.H + '"/>';
    var label = view === 'cap' ? 'Front' : view === 'back' ? 'Back' : 'Front';
    stage.innerHTML = '<svg viewBox="0 0 ' + inf.W + ' ' + inf.H + '" role="img" aria-label="' + esc(label + ' of the garment with your logo') + '" xmlns="http://www.w3.org/2000/svg">' + base + marks + '</svg><span class="lp-tag">' + label + '</span>';
    $('#lpNote').textContent = s.kind === 'drawn' ? 'Shown on a drawing in your colour, because this style has no flat product photo to place a logo on.' :
      s.kind === 'built' ? 'This brand publishes no back photo, so the back is drawn from the front outline in your colour.' :
      (ST.o.colour ? 'Shown on the actual garment in ' + ST.o.colour + '.' : 'Shown on the actual garment.');
  });
}
function save(){
  var list = Object.keys(ST.sel).map(function(p){ return { position:p, width_mm:Math.round(fit(p).w / 5) * 5 }; });
  track('logo_preview_save', { positions:list.length });
  var cb = ST.o.onSave; D.close();
  if (cb) cb(list, ST.file);
}
/* opts: { shape:'top'|'cap', front, back, hex, colour, sub, placements:[{position,width_mm}], saveLabel, onSave(list, file) } */
function open(opts){
  build();
  ST = { o:opts, shape:opts.shape === 'cap' ? 'cap' : 'top', sel:{}, act:null, view:'front', file:null, logo:null, cutOn:true, note:'', busy:false, src:{}, tick:0 };
  (opts.placements || []).forEach(function(p){ var def = posDef(ST.shape, p.position); if (def){ ST.sel[def[0]] = Math.min(def[4][1], Math.max(def[4][0], +p.width_mm || def[5])); if (!ST.act) ST.act = def[0]; } });
  if (!ST.act){ var first = POS[ST.shape][0]; ST.sel[first[0]] = first[5]; ST.act = first[0]; }
  ST.view = posDef(ST.shape, ST.act)[1];
  $('#lpSub').textContent = opts.sub || '';
  $('#lpStage').innerHTML = '';
  renderLogo(); renderPos(); renderSize(); renderTabs(); renderStage(); renderFoot();
  if (D.showModal) D.showModal(); else D.setAttribute('open', '');
  var me = ST;
  getFile().then(function(f){ if (f && ST === me && !ST.file){
    ST.file = f;
    if (SHOWN_EXT.test(f.name)){ ST.busy = true; renderLogo(); prepareLogo(f).then(function(L){ if (ST !== me) return; ST.busy = false; ST.logo = L; ST.cutOn = !!(L && L.cut); renderLogo(); renderStage(); renderFoot(); }); }
    else { renderLogo(); renderFoot(); }
  } });
  track('logo_preview_open', { shape:ST.shape });
}

window.AuraLogo = { open:open, supports:supports, getFile:getFile, setFile:setFile, clear:clearFile, placement:placement, setPlacement:setPlacement, canShow:function(name){ return SHOWN_EXT.test(name || ''); } };
})();
