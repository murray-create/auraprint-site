# Aura CRM — print-industry MIS improvements

Written for Claude continuing the build. Think like a seasoned print
production manager who also answers the phone, not like a SaaS CRM
marketer.

Murray’s brief: the CRM is already good; move it to a subdomain; add the
**traditional CRM + print-floor** pieces that are missing — especially
**customer order history**. Do not rebuild it as generic sales CRM.

Companion: [`CLAUDE.md`](../CLAUDE.md) (hard rules, repo map, website P0).

---

## 1. Verdict

This is not a prototype. `crm.html` is a working **print MIS** with a
quote-as-hub, live Supabase writes, Stripe, versioned proofs, staff-only
job cost, GSC and supplier Vault. That is ahead of most shops this size
(they are still on Excel + a Facebook message thread).

What it is *not* yet: the tool a printer reaches for when the phone rings.

> “Hi, it’s Sarah from Coastline — can we get the same A-frames as last
> October, but two extra, and send them to the new Caloundra site?”

Today that question takes four screens and a memory. After this work it
should take one contact record and a **Reorder** button.

Keep the Print Geek visual language (pink `#F01A9A`, blue `#43B7FF`).
Improve information architecture and workflows. Do not restyle for the
sake of it.

---

## 2. What a print shop CRM actually is

Generic CRMs (HubSpot, Salesforce) are built around **leads and
pipeline**. A print CRM is built around **jobs and history**.

The objects that matter, in order:

1. **Organisation** — the account (cafe group, real-estate office, school,
   council, trade printer).
2. **People at that account**, with **roles** (orders / approves art /
   pays invoices / takes delivery). These are often four different humans.
3. **Jobs** — every quote, order, reprint, sample, make-ready, credit.
4. **Artwork** — the approved PDF for that job, versioned, reusable.
5. **Addresses** — bill-to vs ship-to vs install-at. Real-estate and
   schools will have a dozen.
6. **Money** — COD vs 7/14/30 day trade terms, credit hold, GP.
7. **Supply** — which trade house ran it, their job number, our PO,
   promised date vs actual.

Aura already has 1, 3 (partial), 6 (partial) and 7 (partial). The hole is
**2, 4, 5, and a proper 3 (history you can reorder from)**.

Industry names for the same idea: job jacket / docket / works order /
repeat last job. EFI Pace, PrintIQ, Tharstern, PrintVis, and even old
PrintSmith all revolve around this. We do not need their complexity. We
need the 20% a one-to-three person Sunshine Coast shop uses every hour.

---

## 3. Preserve — do not regress

| Capability | Where |
|---|---|
| Quote as hub, 7-step journey | `openQuote()`, `STAGE_LABELS` |
| Silent stage jump, no email | `stageForward` / `stageBack` |
| Stripe un-pay blocked | `stageBack` throws if provider is stripe |
| Proofs versioned per order item | `order_items → proofs(...)` select |
| Production gated on paid + approved | existing proof/order logic |
| Staff-only `job_costs` | RLS + never on customer pages |
| 1.30× minimum sell | price editor |
| `convert_quote_to_order` RPC | keep the RPC, don’t reimplement in JS |
| Soft-delete contacts | `archived` / `archive_reason` |
| Leads → convert to quote | `leadToQuote` |
| Resend composer + PDF attach | live write block |
| GSC Search view | `loadSearch` / `gsc-report` |
| Supplier Vault (write-only password) | `editAccess` / `saveAccess` |
| Shop origin vs staff origin | `q._origin === 'shop'` |

The Cowork artifact meta at the top of `crm.html` is stale. The second
script block (`LIVE WRITE ACTIONS`) is the real write path. Change that
path. Then delete shadowed prototype functions (`advance`, in-memory
`duplicateQuote`, etc.) so there is one flow.

---

## 4. The gaps, in print-manager language

### 4.1 Customer 360 / order history  ← Murray’s explicit ask

**Today**

- Contact has tabs: Information, Quotes & Orders, Invoices, Notes.
- Quotes & Orders is a thin table: number, value, status. No product,
  no date, no reorder.
- Match is `quotesOfContact = quotes.filter(q => q.contact === name)`.
  Rename Sarah and the history vanishes.
- Org has a similar thin table plus a static Notes field.
- Contact Notes tab is literally
  `Staff notes and activity history live here.`
- “New quote” on the contact header calls `go('sales')` — it does **not**
  open `newQuote(name)`.

**What the floor needs on one screen (contact + org)**

Header strip, always visible:

- Name, role, org, mobile (tap-to-call), email.
- Terms: COD / 7 / 14 / 30. Credit hold flag if overdue.
- Lifetime value (already calculated) **and** last job date.
- Primary ship-to suburb.

Then four working tabs:

1. **History** (default) — every job, newest first.
   Columns: date, job/quote #, what they bought (first line of
   description, not just “QU-00xx”), qty, value, status, due/promised,
   **Reorder**.
   Filter chips: All / Open / Produced last 12 months / Lost quotes.
2. **People** (org) / **Info** (contact) — roles, ABN, terms, default
   addresses.
3. **Artwork** — last approved files by product (“2025 Christmas pull-up,
   v3 approved 12 Nov”). Reuse on reorder.
4. **Activity** — timeline. Quote sent, viewed, accepted, proof viewed,
   paid, note, call. The notification bell already knows most of these
   events; they are just not stored against the person.

**Reorder** is the money button. It must:

- Copy line descriptions, qty (editable), supplier, artwork link / last
  approved proof file.
- Create a **new** quote (new number), status draft, linked
  `repeat_of_quote_id`.
- Recalculate price from live `product_prices` / `bc_prices`. If the SKU
  has no live price, copy last sell but flag **“price unchecked — confirm
  against current rate card”**.
- Never reuse the old quote number. Never hard-code `QU-001019`
  (`duplicateQuote` is broken today).

Persist via Supabase, not the in-memory `D.quotes.unshift`.

Also fix the join: store `contact_id` and `organisation_id` on quotes
(and orders). Display name is a label, not a key.

### 4.2 The job jacket (what the floor actually looks at)

Quote detail is already dense: stepper, lines, job cost, proof card,
shipping card. It is a *sales* screen. Add a **Job jacket** view (print
CSS, A4) and a **Day board**.

**Job jacket / docket** — one A4, printable, no GP numbers:

- Job #, customer, order contact + phone, due date, delivery method
  (pickup Baringa / courier / install).
- Each line: description as spec block (size, stock, laminate, print),
  qty, supplier, supplier job ref.
- Artwork: approved version + “wait — not approved”.
- Packing / site notes (“leave at sales office, ask for Dan”).
- QR or URL back to the CRM job.

Staff must be able to hit **Print jacket** from quote detail in one click.

**Day board** — new nav item under Workspace, default landing after
Dashboard for daily use:

Columns (kanban): *Waiting art · Proof out · Ready to produce · With
supplier · Ready to pickup/dispatch · Overdue*.

Cards: job #, customer, one-line product, due date (red if today-or-past,
amber if tomorrow), supplier.

This is the 7:30am view. Dashboard charts are for Sunday night.

The current stepper is Quote → Order → Invoice → Paid → In Production →
Dispatched → Google Review. That is a **commercial** journey. The floor
also needs **production** states that are not “paid”. A job can be paid
and still waiting on artwork. A trade-account job can be in production
before paid. Those are different axes — do not smash them into one
stepper. Keep the commercial stepper; add a `production_status` (or
reuse `orders.status` with a richer enum) and show it on the day board.

Suggested production enum:

`waiting_artwork | proof_pending | on_hold | ready | with_supplier | in_production | ready_to_collect | dispatched | complete | cancelled`

Hold reason is mandatory on `on_hold`: waiting art / waiting proof /
waiting customer / waiting stock / credit hold.

### 4.3 Artwork-waiting is a first-class stage

Most print delays are not print. They are “we invoiced them and they
haven’t sent the PDF”.

- Customer-facing: keep WeTransfer / artwork link (already on orders as
  `artwork_link` + `order_files`).
- Staff-facing: a job with no usable file cannot sit in “In Production”.
  Put it on **Waiting art**. Badge it on the contact and the day board.
- Preflight status already exists on `order_files.preflight_status` —
  surface it. “File received, not preflighted” ≠ “ready”.

Do not start the production clock until (a) terms allow and (b) a file is
approved or explicitly “print as supplied — customer accepts risk”.

### 4.4 Commercial terms (trade vs retail)

Default today: production blocked until paid + approved. Correct for
website/COD work.

Account customers (trade printers, agencies, local businesses Murray
trusts) need:

- `organisations.payment_terms`: `cod | days_7 | days_14 | days_30`
- `credit_limit_cents` (nullable)
- `on_stop` boolean — if true, new orders cannot move to production;
  quoting is still allowed.
- Per-job override: “take a 50% deposit” / “produce on account”.

Show a quiet chip on the job: `COD` or `30 days · $X outstanding`.
If they are 60+ days overdue, make it loud.

Do not auto-grant 30 days to every org with an ABN.

### 4.5 People have roles, not just a job title

Free-text `contacts.role` (“Events Coordinator”) is useful context and
should stay. Add a multi-select **job role** used by workflows:

`orders | art_approver | accounts | delivery | owner`

When sending a proof, default To: art_approver (fallback: orderer).
When sending an invoice, default To: accounts (fallback: orderer).
When SMS-ing “ready to collect”, default: delivery or orderer.

Quote/order records should snapshot:

- `ordered_by_contact_id`
- `approver_contact_id`
- `bill_to_contact_id`
- `deliver_to_address_id`

So when Sarah leaves Coastline Cafe, last year’s jobs still make sense.

### 4.6 Address book

`suburb` on org/contact is not enough. Add `addresses`:

- `organisation_id`, label (`Billing`, `Caloundra store`, `Warehouse`),
  lines, suburb, state, postcode, delivery notes, is_default_bill,
  is_default_ship.

Pickup at Baringa is a first-class method, not an empty ship-to.

Carriers already exist in `trackingUrlFor` / `CARRIERS`. Keep them.
Add **method**: `pickup | courier | local_delivery | install | trade_drop`.

### 4.7 Supplier purchase orders

`job_costs.supplier_ref` is a sticky note. Real flow:

1. Job accepted (and paid, or on account).
2. Staff chooses supplier (already on job cost).
3. **Raise PO** — our number `PO-00xx`, supplier, lines, expected date,
   our job # in their reference field.
4. When the supplier invoice arrives, confirm cost (already have
   “real figure from the supplier invoice”).
5. Day board moves *With supplier* → *Ready to collect/dispatch*.

POs can be a simple `purchase_orders` table plus a printable PDF.
Do not automate Premier/LEP portals in v1. Murray will still click the
trade site. The CRM’s job is to remember **what we ordered, from whom,
under which job**.

### 4.8 Global search (phone-first)

`#gsearch` placeholder: “Search products… (press Enter)”. On Enter it
`go('products')`. That is a catalogue search sitting in the slot that
should be the **shop phone**.

Replace with command-palette search (keyboard `/` or Ctrl-K):

Look up, in one box, against:

- quote / order / invoice numbers (`QU-`, `AP-`, `INV-`)
- contact name, email, phone (strip spaces, match 04xx)
- organisation name / ABN
- tracking number
- supplier job ref
- then products (current behaviour) as a lower-ranked group

Results grouped: **People · Jobs · Products**. Enter opens the record.
This is the highest-leverage UX change in the file after History/Reorder.

Also: click-to-call `tel:` on every phone; click-to-mail already exists.

### 4.9 Activity, notes, tasks

Notes tab is a stub. Implement `activities`:

- `type`: `note | call | email | stage | proof | payment | file`
- `body`, `created_at`, `created_by`, `contact_id`, `organisation_id`,
  `quote_id` (all nullable except type + created_at)
- Auto-write an activity when a quote is viewed, accepted, paid, a proof
  is decided, an email is sent. The bell (`buildNotifs`) already derives
  these from columns — persist them so the contact timeline isn’t empty
  on a quiet day.

Pin notes (“prefers SMS”, “never laminate matte”, “accounts is Karen,
not the owner”).

Optional v2: a **Follow up** task on unaccepted quotes older than n days,
and on proofs sent but not viewed. Do not build a full task product first.

### 4.10 Quote UX bugs to fix while you are in there

- Contact “New quote” / “Create first quote” must call `newQuote(name)`
  (and pass `contact_id` once that column exists), not `go('sales')`.
- `duplicateQuote` must hit Supabase and allocate the next number the
  same way `nqSave` does. Delete the hard-coded `QU-001019`.
- Settings needs a real view: margin default, terms defaults, Google
  review URL, pickup address, invoice footer, who gets Cc’d
  (`admin@auraprint.com.au` is hard-coded in the composer).
- Dashboard “Run sync now” and “Sep 2025” — either wire them or remove
  them. Decorative controls erode trust on a floor tool.
- Templates nav is fake cards. Point it at the real `artwork-templates`
  / `templates/` data, or hide it until true.
- Topbar avatar is hard-coded “Murray Boyton / Owner”. Use
  `auth.user()`.

### 4.11 Money screens a manager actually uses

Keep job cost. Add, on the job and on a thin **Margin this week** dash
tile (staff only):

- Quoted sell (inc) vs confirmed cost (ex) vs freight vs GP $ and %.
- Flag jobs with GP below a threshold (use `staff_config.margin`, already
  loaded as `MARGIN_MULT`).
- Lost-quote reason is already collected (`lost_note`) — show a simple
  lost-jobs list so Murray can see “lost on price vs lost on turnaround”.

Do not build a full accounting package. Xero/MYOB stays the books.
The CRM holds **job economics**, not BAS.

---

## 5. UX principles for this CRM

These are constraints, not vibe.

1. **Two-second phone test.** From lock screen to “last job + reorder”
   in under two seconds on a laptop, and usable on a phone (the existing
   drawer nav is a start). If the phone is ringing, they never click
   Dashboard → Quotes → filter → open.
2. **History is the default tab** on a customer, not “Contact Information”.
3. **One job number the customer can quote back.** Don’t make them say
   “the pink pull-ups for the event”. Show the human description *and*
   the number.
4. **Due date is louder than status.** Status is for the board; lateness
   is for panic. Colour: red due today/overdue, amber tomorrow, else quiet.
5. **Never hide the next action.** On a job: the primary button is the
   next thing (Send quote / Chase proof / Mark ready / Print jacket /
   Reorder). Secondary actions in a ⋯ menu.
6. **Staff and customer see different numbers.** GP never on jacket, PDF,
   or proof page.
7. **Don’t add empty nav.** Settings, Templates, Sync, date chip — wire
   or remove. A print manager learns to ignore greyed fiction, then
   ignores real buttons too.
8. **Keyboard.** `/` search, `n` new quote, `Esc` close modal. The file
   already closes nav on Esc.
9. **Mobile:** quote detail stepper already wraps poorly conceptually —
   on small screens show a compact status chip + “Move stage” sheet, not
   seven labelled steps. Day board stacks to a due-date list.
10. **Language of the floor.** Waiting art, proof out, with LEP, ready
    to collect — not “opportunity stage 4”.

Visual: keep existing tokens. Increase density on list tables (more rows,
less card chrome) on History and Day board. Big type is for the customer
site, not the docket.

---

## 6. Suggested schema (additive)

Inspect live Supabase before applying. Names are suggestions.

```text
organisations
  + payment_terms text          -- cod|days_7|days_14|days_30
  + credit_limit_cents int
  + on_stop bool default false
  + default_bill_address_id uuid
  + default_ship_address_id uuid

contacts
  + workflow_roles text[]       -- {orders, art_approver, accounts, delivery, owner}

addresses
  id, organisation_id, label, line1, line2, suburb, state, postcode,
  notes, is_default_bill, is_default_ship

quotes
  + contact_id uuid
  + organisation_id uuid
  + repeat_of_quote_id uuid
  + due_at timestamptz
  + delivery_method text        -- pickup|courier|local_delivery|install|trade_drop
  + deliver_to_address_id uuid
  + ordered_by_contact_id / approver_contact_id / bill_to_contact_id

orders
  + production_status text      -- see enum in §4.2
  + hold_reason text
  + due_at timestamptz          -- copy from quote, staff-editable
  + purchase_order_id uuid

purchase_orders
  id, po_number, supplier_code, quote_id, order_id,
  status, expected_at, lines jsonb, created_at

activities
  id, type, body, created_at, created_by,
  contact_id, organisation_id, quote_id, order_id

artwork_assets
  id, organisation_id, contact_id, quote_id, order_item_id,
  filename, storage_path, kind, approved_at, label
  -- v1 can be a view over order_files + proofs; promote if reuse needs it
```

RLS: staff full access; these tables never go public. Customer pages keep
using access tokens as they do today.

---

## 7. Subdomain cutover (approved direction)

Target: `https://crm.auraprint.com.au`

GitHub Pages serves one CNAME per repo (`auraprint.com.au`). Do **not**
try to host the CRM as a second host from this same Pages site.

Practical options (pick the one Murray already has a login for):

1. **Cloudflare Pages or Netlify** project `aura-crm`, root = a `/crm`
   publish folder or a copied `crm.html` as `index.html`. CNAME `crm` to
   that project. Fastest.
2. **Second GitHub repo** `auraprint-crm` + its own Pages + CNAME `crm`.
   Cleaner long-term if the file splits.
3. Stay on this repo but publish CRM via Cloudflare in front of Pages
   with a path rule — more moving parts, avoid unless already in use.

Cutover checklist:

1. Copy `crm.html` (+ any extracted JS) to the new host as `/`.
2. Add `https://crm.auraprint.com.au` to Supabase Auth redirect URLs
   and allowed origins. Confirm MFA still challenges.
3. Confirm Resend / `gsc-report` / Vault Edge Functions accept the new
   Origin.
4. `admin.html` and `/crm.html` on the marketing site: 301 to the
   subdomain (keep for a month).
5. `robots.txt` already Disallows `/crm.html`; subdomain sends
   `noindex, nofollow` and is absent from `sitemap.xml`.
6. Only then delete or stub `crm.html` on the public origin.

Do not couple the subdomain move to the History/Reorder feature. Ship
the move as its own PR so auth can be verified in isolation.

---

## 8. Phased delivery

Do not start a rewrite. Patch `crm.html` (or the extracted files after
the move) in this order.

### Phase A — make the phone usable (1–2 sittings)

1. Global search: jobs / people / phone / tracking, then products.
2. Contact + org **History** tab with product description, date, status.
3. Wire Notes → `activities` (manual note + auto from existing events).
4. Fix New quote from contact to pre-fill. Fix `duplicateQuote` as
   **Reorder** (new number, live price check, `repeat_of_quote_id`).
5. Join quotes by `contact_id`, not name string.
6. Kill or hide fake Settings / Sep 2025 / Run sync now / Support
   button (`#supportBtn` is already `display:none`).

### Phase B — the floor (next)

7. `due_at` on quote/order, coloured on lists.
8. Day board kanban from `production_status`.
9. Waiting-art as a real state; surface `order_files` / proof status.
10. Printable job jacket (no GP).
11. Delivery method + address book (even if v1 is one ship-to + pickup).

### Phase C — commercial

12. Org payment terms, on-stop, credit chip on job.
13. Production-gate policy: COD vs on-account.
14. Purchase orders (manual, printable).
15. Real Settings view (margin, review URL, default Cc, pickup address).

### Phase D — subdomain + hygiene

16. Host CRM on `crm.auraprint.com.au`.
17. Split the 256 KB file into modules **after** the host works.
18. Auth user in the topbar; remove hard-coded “Murray Boyton”.

Out of scope until asked: customer login portal, Xero sync, voice agent
on 1300 291 277, apparel reactivation, mobile native app.

---

## 9. Implementation notes for Claude

- Prefer additive columns and new tables. Migrate existing quotes by
  matching `contact_name` / `company` once, then stop using the string
  join.
- `refreshFromSupabase` already fans out 12 queries. If you add
  activities, page them (`sbAll` / `sbPage` exist) and attach by id in
  JS. Don’t N+1 inside `drawContacts`.
- Money stays integer cents in the DB (`price_inc_cents`). UI formats
  with the existing `money()` helper.
- Customer PDFs: `crmPdf()` — do not leak cost fields if you extend it.
- Tests: there is no CRM test harness. Verify by clicking the live write
  path against a **draft** quote in Supabase, not against a paid Stripe
  invoice.
- Never commit Vault contents, Stripe secret keys, or banking details
  into this doc or into issues.

---

## 10. Acceptance tests (Phase A)

A staff member can:

1. Type a phone number or `QU-` number in the top box and land on the
   record without touching Products.
2. Open a contact and see last year’s jobs with what was printed, not
   just quote numbers.
3. Click **Reorder** on a pull-up banner job and get a new draft quote
   with the same spec, a new number, and either a live price or a
   “confirm price” flag.
4. Leave a note “prefers SMS”, refresh, and still see it.
5. Click **New quote** on that contact and have the name/email/org
   already filled.

If those five work, the CRM has become a print-shop CRM. Everything else
in this document is how it becomes a print-shop **MIS**.
