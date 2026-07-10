/* AURA site configuration */
window.AURA_CONFIG = {
  /* Tawk.to live chat: paste your property ID here, e.g. "68123abc.../1abc2def3".
     Get it from tawk.to Dashboard > Administration > Chat Widget (the part of the
     widget code after 'embed.tawk.to/'). Leave empty to use the built-in demo bot. */
  tawkId: "6a47acded339301d469eebb0/1jsjvmhi0",

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
     via the password-protected admin inbox. */
  supabaseUrl: "https://pwjxkzifitybvtnrfxfi.supabase.co",
  supabaseKey: "sb_publishable_HYMPZZd4CPpmWktzmht7Jg_xD1C-QZ1",

  /* Business details printed on tax invoices (invoice.html).
     Fill in bsb/acc (and payid if you have one) to show EFT details;
     leave blank to hide that section's numbers. */
  business: {
    name: "Aura Print",
    abn: "75 642 501 493",
    address1: "4/1 Packer Road",
    address2: "Baringa QLD 4551",
    phone: "0404 601 314",
    email: "admin@auraprint.com.au",
    accName: "Murray Alexander Boyton t/a Aura Print",
    bsb: "034-168",
    acc: "510720",
    payid: "0404 601 314"
  }
};
