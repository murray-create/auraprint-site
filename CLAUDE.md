# Aura Print — Claude operating manual

This file is the always-on brief for Claude Code / Claude Cowork working in
`murray-create/auraprint-site`. Read it before touching anything. For the
print-shop CRM/MIS work, also read [`docs/print-crm-improvements.md`](docs/print-crm-improvements.md).

Owner: **Murray Boyton** (`murray@boyton.com.au`, GitHub `murray-create`).
Business: **Aura Print & Promo** — Sunshine Coast print, signage and promo.
Site: [https://auraprint.com.au](https://auraprint.com.au)
Shop / studio: 4/1 Packer Road, Baringa QLD 4551
Phone: 1300 291 277
ABN: 75 642 501 493
Brand: Print Geek — hot pink `#F01A9A`, light blue `#43B7FF`, ink `#111018`.

This repo was originally built in Claude Cowork. Grok produced this handoff
on 27 Aug 2026 after a live-site + repo audit. Treat the live Supabase data
and this file as source of truth, not the Cowork artifact meta comment in
`crm.html` (it still says “clickable design direction, not the final build”
— the live write path has since been wired).

---

## Hard rules — never violate

1. **Never invent prices.** Sell prices, cost, GP and “from” figures come
   from Supabase (`bc_prices`, `product_prices`, `product_online_rules`) or
   a staff-confirmed supplier rate card. If a price is missing, show
   “POA / call for price”, never a guessed number.
2. **`node build.mjs` regenerates product and category HTML** from
   `data/products.json` + `data/categories.json`. Hand-edits to generated
   product pages are clobbered on the next build. Change the generator or
   the JSON, then rebuild.
3. **Do not commit secrets.** `assets/config.js` is public (GitHub Pages).
   It already holds a Web3Forms key, banking identifiers and a Supabase
   publishable key. Do not add service-role keys, Vault passwords, SMTP
   credentials, Stripe secret keys, or extra API tokens. Do not copy the
   BSB / account / PayID into docs, issues, or chat logs.
4. **Do not put the CRM on the public marketing origin.** Target host is
   `crm.auraprint.com.au` (noindex, staff auth, separate deploy). Until
   that cutover, `crm.html` stays `noindex` and is already Disallowed in
   `robots.txt`.
5. **Do not reverse Stripe money in the CRM.** Stage-back already refuses
   to silently un-pay a Stripe invoice. Keep that invariant.
6. **Job cost / margin is staff-only.** `job_costs` is RLS-protected and
   must never render on `myquote.html`, `invoice.html`, `proof.html` or
   any customer-facing page.
7. **Production is blocked until paid + proof approved**, except for
   account/trade customers once that policy exists (see CRM doc). Do not
   weaken the default COD path.
8. **Australian English.** organise, colour, fulfilment, metre, neighbour.
9. **GST-inclusive customer prices.** Staff cost screens may show ex-GST;
   customer PDFs and the shop always inc-GST.
10. **Fix JSON-LD geo if you touch homepage schema.** Current PrintShop
    coordinates (`-26.7594, 153.0932`) are wrong. Baringa / Aura is
    approximately `-26.8026, 153.0684` — verify on Google Maps before
    shipping, do not copy a guessed pin.

---

## What this repo is

Public static HTML on **GitHub Pages** (`CNAME` → `auraprint.com.au`),
`.nojekyll`. Custom SSG: `build.mjs`. Live pricing and the staff CRM talk
to Supabase project `pwjxkzifitybvtnrfxfi`.

```
index.html, print.html, promo.html, signage.html   marketing
{product}.html                                     generated product pages
assets/aura.js, aura.css, aura-cart.js, …          public front-end
assets/config.js                                   public runtime config
data/products.json, categories.json                SSG inputs
data/promo-catalogue.json                          ~1,587 promo SKUs, ~1.1 MB
crm.html                                           staff CRM/MIS (~256 KB, one file)
admin.html                                         redirect → crm.html
quote.html, myquote.html, invoice.html, proof.html customer job documents
checkout.html, cart.html, order.html               shop
tools/                                             deploy + import scripts
```

Trade network (do not invent extra suppliers): Premier Collection,
PromoBrands (API), EasySigns, CMYKhub, LEP Colour (manual portals).
Apparel (Aussie Pacific) is deactivated — Print + Promotional only.

Auth on CRM: Supabase email/password + TOTP MFA + hCaptcha.
Email: Resend via Edge Function. GSC: `gsc-report` Edge Function.
Supplier passwords: Supabase Vault, never the front end.

---

## Architecture — today vs where we are going

**Today:** marketing site and staff CRM share `auraprint.com.au`. CRM is a
single `crm.html` with in-page CSS/JS, gated by Supabase auth. That is a
real, working print MIS (quotes, orders, invoices, proofs, job cost, GSC),
not a mock.

**Target (Murray has approved):**

| Host | What lives there | Who |
|---|---|---|
| `auraprint.com.au` | Marketing + shop + customer quote/proof/invoice pages | Public |
| `crm.auraprint.com.au` | Staff CRM / MIS | Staff only, MFA |

Cutover rules:

- New host is `noindex, nofollow`. Do not add it to `sitemap.xml`.
- Keep `admin.html` → CRM redirect until bookmarks die, then 301 to the
  subdomain.
- CORS / Supabase auth: add `https://crm.auraprint.com.au` to allowed
  redirect URLs and site origins **before** flipping DNS.
- Do not rewrite the CRM from scratch as a side effect of the move.
  Move the existing app first (even if it stays one HTML file), then
  slice it. A greenfield React CRM that loses proofing or job cost is a
  regression.
- DNS: CNAME `crm` → whatever hosts the staff app (Pages project, Cloudflare
  Pages, or a tiny static bucket). GitHub Pages only serves one CNAME per
  repo, so the CRM almost certainly needs its **own** Pages project or a
  Cloudflare/Netlify site pointing at a `/crm` folder or a second repo.

Suggested split when you *do* break the file up (after the subdomain
works): `crm/index.html` + `crm/js/{auth,quotes,contacts,proofs,search}.js`.
Not a new framework unless Murray asks.

---

## How to change things without making a mess

**Product copy / specs:** edit `data/products.json` (and category JSON),
run `npm run build`, commit the generated HTML with the JSON.

**Product prices:** CRM → Products → click SKU, or write `product_prices` /
`bc_prices` in Supabase. Minimum sell is **1.30× cost**. Do not hard-code
price tables into HTML.

**Nav / chrome on product pages:** many generated pages omit static nav;
`assets/aura.js` injects a fallback. Change the injector or the generator,
not one page.

**Cache bust:** homepage currently pins `aura.css?v=20260826c`. `build.mjs`
still stamps an older `V='20260710a'` on generated pages. If you change
`aura.css` / `aura.js` / cart JS, bump **both** or users will see a mix.

**Shop cart:** `assets/aura-cart.js`. Header on the live site has been
missing a cart icon — that is a P0 conversion bug, not a redesign.

---

## Website backlog (do these; don't boil the ocean)

Priority is conversion and correctness, not a visual redesign.

### P0 — this week

- Cart icon + count in the global header (and the `aura.js` fallback nav).
- Stop leaking new secrets into `assets/config.js`. Move Web3Forms /
  banking display off the public file if you touch checkout copy.
- Align cache-bust query on generated pages with homepage.
- Confirm JSON-LD geo against Google Maps, then fix.

### P1 — conversion

- Same-day claim (“order by 8am”) must match what the floor can actually
  turn. If it is stationery-only, say so on the homepage hero.
- Quote / enquiry forms should land in CRM Leads (they already do) and
  notify; do not add a second inbox.
- Product pages: visible “from” price from Supabase, then configure.
  Never a fake “from $X”.
- 404 + sitemap stay generated by `build.mjs`.

### P2 — SEO / content

- Keep service pages (same-day, real estate, trade terms) unique.
- GSC lives in the CRM Search view — use it to pick the next blog, don't
  guess keywords.
- Do not mass-generate AI blog posts.

### P3 — do not do unless asked

- Do not migrate the public site to Next/React.
- Do not add a customer login portal until the staff CRM is on its
  subdomain and customer 360 exists.
- Do not install a phone voice agent from this repo. Voice AI for
  `1300 291 277` is a separate telephony product (Vapi / Retell / Twilio),
  not a website feature.

---

## CRM — start here

The CRM is **already a print MIS**, not a Salesforce clone. Preserve:

- Quote as the hub (one record walks Quote → Order → Invoice → Paid →
  In Production → Dispatched → Google Review).
- Silent stage jump (records only, no customer email).
- Versioned proofs per order item; production blocked until paid + approved
  (COD default).
- `job_costs` staff-only economics (supplier, freight, confirmed vs estimate).
- Stripe payment links, Resend composer, GSC, Vault-backed supplier logins.
- Soft-delete / archive on contacts.
- `convert_quote_to_order` RPC.
- Live price editor with 1.30× floor.

The Cowork meta in `crm.html` is stale. The second script block
(`LIVE WRITE ACTIONS`) overrides the in-memory prototype. When you change
a flow, change the **live write** path, then delete the dead prototype
function if it is fully shadowed.

Known landmines in the current file:

- **Settings** nav is fake (`data-v="dash"`).
- **Top search** (`#gsearch`) only searches products.
- Contact **Notes** tab is a stub: “Staff notes and activity history live here.”
- **New quote** from a contact record runs `go('sales')` instead of
  `newQuote(contactName)` — it does not pre-fill the person.
- `quotesOfContact` matches on **name string**, not `contact_id`.
- `duplicateQuote()` hard-codes `QU-001019` and does not persist to Supabase.
- Dashboard “Run sync now” and the “Sep 2025” date chip look decorative.
- Templates view is a static card grid, not the real artwork templates.

Read [`docs/print-crm-improvements.md`](docs/print-crm-improvements.md)
before adding CRM features. Implement in the order given there. First
slice is **customer 360 + global search + notes timeline**, not a
greenfield rewrite.

---

## Supabase tables the CRM already reads

`organisations`, `contacts`, `quotes`, `quote_items`, `orders`,
`order_items` (nested `proofs`), `invoices`, `payments`, `suppliers`,
`leads`, `job_costs` (staff RLS), `staff_config` (margin multiplier,
default ~1.52), `order_files`.

Inspect live schema in the Supabase dashboard before adding columns.
Prefer additive migrations. Do not rename `quote_number` / `order_number`
formats without a redirect map — customers and staff search by those
strings daily.

---

## Definition of done (every change)

- No invented prices.
- Customer-facing pages still inc-GST, still Australian English.
- `crm.html` / staff app still MFA-gated; job cost still staff-only.
- Generated product pages come from `build.mjs`, not one-off HTML.
- If you touch CSS/JS, bump the cache-bust actually used on those pages.
- Do not commit `.env`, service-role keys, or Vault contents.
- If you add a CRM field, it has a place on the **contact or job record**,
  not only on a dashboard widget.

---

## How to talk to Murray

He is the owner-operator on the floor and on the phone. Prefer:

- “When someone rings, you can see last year’s pull-ups and reorder in two taps.”
- Not: “We should adopt a normalised activity-stream microservice.”

Ship small, visible wins on the CRM he already uses. Ask before a rewrite.
