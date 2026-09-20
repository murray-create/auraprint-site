/* AURA site configuration */
window.AURA_CONFIG = {
  /* Live chat removed (Murray, 21 Jul 2026). Leave tawkId empty; the chat
     widget and the built-in fallback bot have both been taken out of aura.js. */
  tawkId: "",

  /* Google Analytics 4: create a GA4 property at analytics.google.com,
     add a Web data stream for auraprint.com.au, and paste the
     "G-XXXXXXXXXX" Measurement ID here. Leave empty to disable.
     Events wired: page views, tel_click, generate_lead, newsletter_signup. */
  ga4Id: "G-SN65LGSK5Q",

  /* ------------------------------------------------------------------ *
     GOOGLE ADS CONVERSION TRACKING

     adsId is the Google Ads tag ID, "AW-XXXXXXXXXX", found under
     Tools > Data manager > Google tag in the Ads account. Leave it empty
     and no Ads tag loads, exactly like ga4Id above.

     adsLabels are the per-action conversion labels. In Google Ads go to
     Goals > Conversions > Summary, create each action as a Website
     conversion, open it, choose "Install the tag yourself", and copy the
     send_to value. It looks like "AW-1234567890/AbC-D_efGhIjKlM". Paste
     the WHOLE string, tag ID included.

       lead     - someone submitted a quote or contact form
       purchase - a self-serve shop order was placed (value is sent)
       call     - someone tapped the phone number

     Each one is independent: fill in only the ones you have created and
     the rest stay silent. Nothing here changes GA4, which keeps recording
     these same events whether or not Google Ads is set up.

     Also import generate_lead and purchase from GA4 as conversions in the
     Ads account. Two paths to the same truth means a blocked tag or a
     broken GA4 link cannot leave you flying blind.
   * ------------------------------------------------------------------ */
  adsId: "",
  adsLabels: {
    lead:     "",
    purchase: "",
    call:     ""
  },

  /* LEP Print Portal white-label URL */
  portalUrl: "https://printportal.cloud/wl/159459",

  /* Web3Forms access key: enquiry + quote forms email you on every submission.
     Get a free key at web3forms.com - enter admin@auraprint.com.au, check that
     inbox for the access key, and paste it here. Until then the forms show a
     friendly "call or email us" fallback instead of silently failing. */
  web3formsKey: "3b1dfdc0-cfad-4985-abe6-43a73f47c348",

  /* Supabase (Aura CRM database). Every enquiry is stored in the leads table.
     The publishable key below is safe to expose: it can only INSERT enquiries,
     never read them (enforced by row-level security). Staff read the leads
     via the password-protected admin inbox.

     supabaseUrl points at Aura's OWN api. host, not directly at supabase.co.
     Why: school, government, hospital and large-corporate web filters block
     unfamiliar third-party API domains. On 31 Aug 2026 that silently ate a real
     enquiry from an Education Queensland address - the alert email arrived, the
     CRM row never existed - and it would equally stop that customer opening
     their quote or approving a proof, because those pages read from here too.
     A filter sees the business's own domain instead.

     api.auraprint.com.au is a Cloudflare Worker (script "aura-api", source in
     api-proxy/ alongside this repo). It forwards to the Supabase project
     untouched, so the publishable key and row-level security are still the only
     things deciding what a caller may do.

     supabaseFallbackUrl is the direct host, used by assets/aura.js only if the
     proxy cannot be reached, so neither host failing alone can lose a lead. */
  supabaseUrl: "https://api.auraprint.com.au",
  supabaseFallbackUrl: "https://pwjxkzifitybvtnrfxfi.supabase.co",

  /* Staff CRM talks to Supabase directly. Murray is not behind a customer's web
     filter, and keeping the login on the original host means the sign-in
     session is untouched by the proxy. */
  supabaseDirectUrl: "https://pwjxkzifitybvtnrfxfi.supabase.co",
  supabaseKey: "sb_publishable_HYMPZZd4CPpmWktzmht7Jg_xD1C-QZ1",

  /* ------------------------------------------------------------------ *
     LETTERBOX DISTRIBUTION, PUBLIC PRICING

     margin and minFee are the source of truth and are used everywhere.

     cost.* are a FALLBACK ONLY. The booking form and the letterbox area
     pages read the live Australia Post rate from the um_rates table and
     apply the margin to it, so when Australia Post moves a rate the public
     price moves with it and the margin holds. These figures are used only
     when that fetch fails, and they are what is printed into the HTML so
     the pages are still correct with JavaScript off.

     VERIFIED 19 Sep 2026 against the Australia Post Post Charges Guide
     MS11 effective 1 Sep 2026, page 10, Unaddressed Mail. All four match
     the guide. The guide states "Unless noted otherwise, prices are
     inclusive of GST", so these are GST inclusive, same state, under 50g.
     (um_rates previously held 0.420 for standardSmall. That was a typo,
     corrected to 0.405 in the database on 19 Sep 2026.)

     margin is margin ON SALE, matching the CRM: sell = cost / (1 - margin).
     40.5c / 0.85 = 47.6c. That is NOT cost x 1.15, which would be 46.6c.
     Murray confirmed margin on sale, 19 Sep 2026.

     minFee is the minimum charge on delivery-only jobs. Waived when Aura
     prints the flyer as well.
   * ------------------------------------------------------------------ */
  letterbox: {
    margin: 0.15,
    minFee: 250,
    cost: { standardSmall: 40.5, standardLarge: 63.5,
            premiumSmall: 51.6, premiumLarge: 80.9 }
  },

  /* Business details printed on tax invoices (invoice.html) and the CRM PDF.
     Fill in bsb/acc (and payid if you have one) to show EFT details;
     leave blank to hide that section's numbers.
     `phone` is the number shown on invoices (1300 business line).
     `terms` is a short terms block printed at the foot of the invoice/PDF. */
  business: {
    name: "Aura Print",
    abn: "75 642 501 493",
    address1: "4/1 Packer Road",
    address2: "Baringa QLD 4551",
    phone: "1300 291 277",
    email: "admin@auraprint.com.au",
    accName: "Murray Alexander Boyton t/a Aura Print",
    bsb: "034-168",
    acc: "510720",
    payid: "0404 601 314",
    terms: "Full payment is required before production begins. Prices are in AUD and include GST. Goods remain the property of Aura Print & Promo until paid in full. Full terms: auraprint.com.au/trade-terms.html"
  }
};
