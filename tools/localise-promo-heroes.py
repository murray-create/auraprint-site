#!/usr/bin/env python3
"""Download the handful of promo product photos used on the homepage and host them
locally as webp. Deliberate: media.promobrands.com.au is a third-party host and the
EasySigns 404 incident is the reason nothing on this site hotlinks supplier images.
Re-runnable; skips files that already exist unless --force."""
import json, sys, io, urllib.request, pathlib
FORCE='--force' in sys.argv
HEROES={  # homepage card slug -> catalogue code
 'pens':'P200', 'bottles':'S777', 'totes':'RB1018C',
 'keyrings':'A4200', 'lanyards':'L151', 'eco':'T927.ECO',
}
from PIL import Image
cat={i['code'].strip():i for i in json.load(open('data/promo-catalogue.json'))}
out=pathlib.Path('assets/img/promo'); out.mkdir(parents=True,exist_ok=True)
for slug,code in HEROES.items():
    item=cat.get(code)
    if not item or not item.get('img'):
        print('MISSING catalogue entry',code); continue
    dest=out/f'{slug}.webp'
    if dest.exists() and not FORCE:
        print('skip',dest); continue
    req=urllib.request.Request(item['img'],headers={'User-Agent':'Mozilla/5.0'})
    raw=urllib.request.urlopen(req,timeout=45).read()
    im=Image.open(io.BytesIO(raw))
    if im.mode in ('RGBA','LA','P'):
        bg=Image.new('RGB',im.size,(255,255,255))
        im=im.convert('RGBA'); bg.paste(im,mask=im.split()[-1]); im=bg
    else:
        im=im.convert('RGB')
    im.thumbnail((640,640),Image.LANCZOS)
    im.save(dest,'WEBP',quality=82,method=6)
    print(f'{dest}  {im.size[0]}x{im.size[1]}  {dest.stat().st_size//1024}KB  <- {code} {item["name"]}')
