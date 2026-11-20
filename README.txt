ASHRAM HOME HEALTHCARE — WEBSITE
================================

Upload ALL files in this folder to the GitHub repo (replacing the old index.html).
Vercel will redeploy automatically. index.html is the home page.

IMPORTANT: Only edit config.js yourself. Send every other change to Claude,
because the pages are generated from a master template and direct edits
to the .html files would be overwritten by the next update.

FILES
  index.html, services.html, about.html, referrals.html, careers.html,
  contact.html, privacy.html  ... the pages
  styles.css   ... design
  main.js      ... interactive features (forms, map, guided steps)
  config.js    ... SETTINGS: the only file you need for launch-day changes
  og-image.png ... preview image when the link is shared

LAUNCH-DAY CHECKLIST (all in config.js)
  1. Phone/fax ready?        Fill in  phone: "(850) ..."  and  fax: "..."
                             -> call buttons appear everywhere automatically
  2. Forms delivering?       Create a free form at formspree.io, paste its URL
                             into  formEndpoint: "https://formspree.io/f/..."
                             (until then, forms say "thank you" but send nothing)
  3. AHCA license granted?   Change  licensed: false  ->  licensed: true
                             -> removes the "Pending AHCA Licensure" notices,
                                switches wording to "taking patients", and shows
                                the "Ask for Ashram by name" section.
                                "Pending Joint Commission Accreditation" STAYS up.
  3b. Joint Commission       Change  accredited: false  ->  accredited: true
      accreditation granted?  -> removes the Joint Commission pending notices
  2b. Résumé uploads:       Need a Formspree plan with file uploads (Personal or
                             higher). Staying on the free plan? Set
                             resumeUploads: false  (applicants are asked to email
                             their résumé instead).
  4. New domain + email?     Change  email: "..."  in config.js

ONCE THE DOMAIN IS LIVE
  - In each page's <head>, change  og:image  content="og-image.png"  to the full
    address, e.g.  https://yourdomain.com/og-image.png  (needed for link previews)
  - Have the privacy policy (privacy.html) reviewed before launch
  - Set up a Google Business Profile for the Pensacola office
