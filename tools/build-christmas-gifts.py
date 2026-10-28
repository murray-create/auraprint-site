"""Build christmas-corporate-gifts.html (28 Oct 2026).
Twelve gift themes that mirror the Instagram Christmas series. Each theme shows the Trends lifestyle photo
(hosted on media.auraprint.com.au/xmas/) and product cards that link to the live product pages.
Header, footer, styles and scripts are spliced from promo.html, same as build-promo-categories.py.
Run from prototype/:  python3 tools/build-christmas-gifts.py [--check]"""
import os, re, sys, json, html
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = 'https://auraprint.com.au/'
SLUG = 'christmas-corporate-gifts'
esc = lambda s: html.escape(str(s), quote=True)
QUOTE = 'quote.html?cat=Promotional%20Products&product=Christmas%20gifts'

# theme id, h2 (last word gets gradient), lifestyle photo, featured codes, extra Trends categories, copy, tip
THEMES = [
 ('coffee', 'For the client who runs on coffee', '129665_19', ['129665', '126946', '116136', '127309'], ['Coffee Cups'],
  'A reusable coffee cup goes out the door with your client every morning. Double wall cups, desk tumblers and brew flasks, all branded with your logo.',
  'Seen every morning. A coffee cup is one of the most used gifts you can give.'),
 ('wine', 'Raise a glass to a good year', '122387_3', ['122387', '120635', '125054', '122316'], ['Wine Carriers', 'Glassware'],
  'Wine glasses, wine bags and keepsake wine tables for the clients you want to thank properly.',
  'Tuck in a handwritten note. It turns a gift into a thank you.'),
 ('premium', 'For your best clients', '116496_5', ['116496', '116492', '118871', '125278'], ['Swiss Peak'],
  'Premium Swiss Peak gifts: rollerball pens, hard cover notebooks, laptop bags and wireless earbuds.',
  'On premium gifts, a small tone on tone logo looks classy and gets used. You see a proof before anything is made.'),
 ('summer', 'Christmas on the Coast is a summer thing', '117602_4', ['117602', '124812', '112565', '129450'], ['Camping & Outdoors', 'Picnic & BBQ'],
  'Up here December means sun, sand and backyards. Folding chairs, camp tumblers, picnic blankets and cooler seats for long days outside.',
  'Pick gifts that suit how your clients spend the break.'),
 ('bottles', 'The gift that goes everywhere', '116140_8', ['116140', '126867', '129246', '124012'], ['Drink Bottles - Metal'],
  'Insulated drink bottles go to the gym, the office, the car and the beach. Your logo goes with them.',
  'On metal bottles, laser engraving lasts longest. It will not wear off in the wash.'),
 ('desk', 'Gifts for the desk', '126261_9', ['126261', '123717', '123711', '129599'], ['Tech Accessories'],
  'Phone stands, lap desks, tablet cases and card trackers. Useful tech your clients use every working day.',
  'Useful beats novelty. Tech gifts get used daily, so your logo is seen daily.'),
 ('team', 'Thank the team this year', '121857_5', ['121857', '121662', '120902', '121130'], ['Backpacks'],
  'Backpacks and duffle bags make great staff gifts. They get carried every day and they say thank you every time.',
  'One style for every person, your logo on each. It makes the team feel like a team.'),
 ('care', 'A little self care', '114092_4', ['114092', '129240', '121927', '127142'], ['Personal Care', 'Health & Beauty'],
  'Toiletry bags, compact mirrors, lip balm and handheld massagers. Great for salons, physios, clinics and wellness businesses.',
  'Match the gift to your business. Wellness gifts from a wellness business feel right.'),
 ('home', 'Gifts for the kitchen', '126895_7', ['126895', '122272', '128024', '126255'], ['Home & Living'],
  'Pizza sets, bamboo pepper mills, ice trays and valet trays. Gifts that live in the home for years.',
  'Kitchen gifts stay in the house long after Christmas. So does your name.'),
 ('wrap', 'Wrap it right', '127012-7', ['127012', '127010', '104540', '125308'], ['Gift Boxes', 'Gift Bags'],
  'Branded pillow boxes, pen gift boxes and timber wine crates. Presentation makes a good gift feel great.',
  'The packaging is the first thing your client sees. Branded boxes get photographed, shared and kept.'),
 ('ute', 'Gifts for the ute', '111455_3', ['111455', '124138', '126809', '113323'], ['Automotive', 'Camping & Outdoors'],
  'For tradies, farmers and weekend campers: cooler baskets, rechargeable torches and hip flasks.',
  'Tradies want gear, not gadgets. Pick something tough.'),
]
FAQS = [
 ('When should I order Christmas gifts?', 'As early as you can. Decoration, proofing and freight all take time and December gets busy for every supplier. Send your numbers now and we will confirm timing on your quote before you commit.'),
 ('Is there a minimum order?', 'Minimums depend on the product and the decoration. Many gifts start from small runs. Each product page shows the price breaks, and your quote spells out the minimum for your choice.'),
 ('Can you put our logo on any of these?', 'Yes. Every gift on this page can carry your logo by print, engraving, embroidery or deboss, depending on the product. You approve a proof before anything is made.'),
 ('Do the prices include our logo?', 'The from prices are per unit before decoration. Open any product to price your own quantity with setup included, or ask us for a quote on a mix of gifts.'),
 ('Can we mix different gifts for different clients?', 'Yes. Plenty of businesses give premium gifts to their top clients and a simpler gift to everyone else. Tell us your list and budget and we will put options together.'),
]

def block(src, a, b):
    i = src.find(a); j = src.find(b, i); assert i != -1 and j != -1; return src[i:j + len(b)]

def main():
    src = open(os.path.join(ROOT, 'promo.html'), encoding='utf-8').read()
    style = re.search(r'(?is)<style>.*?</style>', src).group(0)
    header = block(src, '<!-- AURA:HEADER start', '<!-- AURA:HEADER end -->')
    footer = block(src, '<!-- AURA:FOOTER start', '<!-- AURA:FOOTER end -->')
    lb = [x for x in re.findall(r'(?s)<script type="application/ld\+json">(.*?)</script>', src) if 'LocalBusiness' in x][0]
    scripts = '\n'.join(re.findall(r'<script src="assets/[^"]+"></script>', src)) + '\n'
    cssv = re.search(r'aura\.css\?v=([\w]+)', src).group(1)
    cat = json.load(open(os.path.join(ROOT, 'data', 'promo-catalogue.json'), encoding='utf-8'))
    by = {str(p['code']).strip(): p for p in cat}

    def card(p):
        img = p.get('im') or p.get('img')
        stock = ('<span class="stock">In stock</span>' if (p.get('onHand') or 0) > 0 else '<span class="stock low">Made to order</span>')
        return (f'<a class="card" href="{esc(p["u"])}"><div class="thumb photo"><img loading="lazy" src="{esc(img)}" alt="{esc(p["name"])}" width="480" height="480"></div>'
                f'<div class="body"><h3>{esc(p["name"])}</h3><div style="display:flex;justify-content:space-between;align-items:center">'
                f'<div class="from">from <em>${p["from"]:,.2f}</em> ea</div>{stock}</div></div><div class="go">→</div></a>')

    used, sections, missing, itemlist = set(), [], [], []
    for tid, h2, photo, codes, cats, copy, tip in THEMES:
        picks = []
        for c in codes:
            p = by.get(c)
            if p and p.get('u'): picks.append(p); used.add(c)
            else: missing.append(c)
        extra = sorted([p for p in cat if p.get('u') and str(p['code']).strip() not in used and p.get('sup') == 'TR'
                        and any(x in (p.get('cats') or []) for x in cats) and (p.get('onHand') or 0) > 0],
                       key=lambda p: -(p.get('onHand') or 0))[:4]
        for p in extra: used.add(str(p['code']).strip())
        picks += extra
        itemlist += picks
        w = h2.split(); h2h = esc(' '.join(w[:-1])) + ' <span class="grad-text">' + esc(w[-1]) + '</span>'
        sections.append(f'''
<section class="pad xg" id="{tid}">
  <div class="wrap">
    <div class="xg-top">
      <img class="xg-photo" src="https://media.auraprint.com.au/xmas/{photo}.webp" alt="{esc(h2)}: branded gift example" width="900" height="900" loading="lazy">
      <div>
        <h2>{h2h}</h2>
        <p class="xg-copy">{esc(copy)}</p>
        <p class="xg-tip"><b>Tip.</b> {esc(tip)}</p>
        <a class="btn btn-aura" href="{QUOTE}%20-%20{esc(tid)}">Get a quote for these</a>
        <p class="xg-note">Photo shows a sample logo.</p>
      </div>
    </div>
    <div class="grid" style="margin-top:28px">{''.join(card(p) for p in picks)}</div>
  </div>
</section>''')

    nav = ''.join(f'<a href="#{t[0]}">{esc(t[1])}</a>' for t in THEMES)
    faq_json = json.dumps({"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
        {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in FAQS]}, ensure_ascii=False, separators=(',', ':'))
    il_json = json.dumps({"@context": "https://schema.org", "@type": "ItemList", "name": "Corporate Christmas gifts",
        "itemListElement": [{"@type": "ListItem", "position": i + 1, "url": SITE + p['u'].lstrip('/'), "name": p['name']} for i, p in enumerate(itemlist)]},
        ensure_ascii=False, separators=(',', ':'))
    title = 'Corporate Christmas Gifts Sunshine Coast | Aura Print'
    desc = 'Branded Christmas gifts for clients and staff on the Sunshine Coast. Coffee cups, wine gifts, Swiss Peak, bottles, tech and more with your logo.'
    css = '''<style>
.xg-nav{display:flex;flex-wrap:wrap;gap:8px;margin-top:22px}
.xg-nav a{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.25);color:#fff;border-radius:999px;padding:7px 14px;font-size:13.5px;font-weight:600}
.xg-top{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.1fr);gap:36px;align-items:center}
.xg-photo{width:100%;height:auto;aspect-ratio:1/1;object-fit:cover;border-radius:var(--radius)}
.xg h2{font-size:clamp(28px,3.6vw,44px);margin-bottom:14px;text-wrap:balance}
.xg-copy{font-size:17px;color:#4a4540;margin-bottom:14px;max-width:56ch}
.xg-tip{font-size:15px;color:#6b6560;background:#f6f1ea;border-radius:12px;padding:12px 16px;margin-bottom:20px;max-width:56ch}
.xg-note{font-size:12px;color:#8a847d;margin-top:10px}
.xg + .xg{border-top:1px solid #ece6de}
.xg:nth-of-type(even) .xg-top{grid-template-columns:minmax(0,1.1fr) minmax(0,1fr)}
.xg:nth-of-type(even) .xg-photo{order:2}
@media(max-width:820px){.xg-top,.xg:nth-of-type(even) .xg-top{grid-template-columns:minmax(0,1fr)}.xg:nth-of-type(even) .xg-photo{order:0}}
</style>'''
    page = f'''<!DOCTYPE html>
<html lang="en-AU">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{esc(title)}</title>
<meta name="description" content="{esc(desc)}">
<link rel="canonical" href="{SITE}{SLUG}.html">
<meta property="og:type" content="website">
<meta property="og:title" content="{esc(title)}">
<meta property="og:description" content="{esc(desc)}">
<meta property="og:url" content="{SITE}{SLUG}.html">
<meta property="og:image" content="https://media.auraprint.com.au/social/xmas/x01-gifts-that-get-used/01.jpg">
<meta property="og:locale" content="en_AU">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">{faq_json}</script>
<script type="application/ld+json">{il_json}</script>
<script type="application/ld+json">{lb}</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/aura.css?v={cssv}">
<link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
<link rel="apple-touch-icon" href="assets/apple-touch-icon.png">
<link rel="mask-icon" href="assets/aura-mark-black.svg" color="#EC4899">
{style}
{css}
</head>
<body>
{header}
<div class="page-hero">
  <div class="wrap">
    <div class="crumbs"><a href="/">Home</a> / <a href="promo.html">Promo &amp; Merch</a> / <b style="color:#fff">Christmas gifts</b></div>
    <h1>Corporate Christmas gifts <span class="grad-text">that get used</span></h1>
    <p>Branded gifts for your clients and your team, chosen for Sunshine Coast summers. Every gift below can carry your logo, and you approve a proof before anything is made.</p>
    <div class="xg-nav">{nav}</div>
  </div>
</div>
{''.join(sections)}
<section class="band">
  <div class="wrap" style="text-align:center;max-width:760px">
    <h2 style="font-size:clamp(28px,3.6vw,44px);margin-bottom:14px">Not sure what to <span class="grad-text">give?</span></h2>
    <p style="font-size:17px;margin-bottom:22px">Tell us how many clients and staff, your budget per gift and when you need them. We will put options together and confirm timing on your quote.</p>
    <a class="btn btn-aura" href="{QUOTE}">Get your Christmas quote</a>
    <p style="margin-top:16px"><a href="promo.html" style="text-decoration:underline">Or browse all promotional products</a></p>
  </div>
</section>
<section class="pad faq">
  <div class="wrap" style="max-width:860px">
    <h2 style="font-size:clamp(26px,3.4vw,40px);margin-bottom:30px">Christmas gift <span class="grad-text">questions</span></h2>
{''.join(f'      <details><summary>{esc(q)}</summary><p>{esc(a)}</p></details>' + chr(10) for q, a in FAQS)}  </div>
</section>
{footer}
{scripts}</body>
</html>
'''
    if missing: print('MISSING featured codes (no live page):', missing)
    print('products linked:', len(itemlist), ' photos:', [t[2] for t in THEMES])
    if '--check' not in sys.argv:
        open(os.path.join(ROOT, SLUG + '.html'), 'w', encoding='utf-8').write(page)
        print('WROTE', SLUG + '.html', len(page) // 1024, 'KB')

if __name__ == '__main__':
    main()
