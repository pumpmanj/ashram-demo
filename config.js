/* =========================================================
   ASHRAM SITE SETTINGS — the only file you need to edit
   for launch-day changes.
   ========================================================= */
window.ASHRAM = {
  // Flip to true the day AHCA licensure is granted.
  // Removes every "pending" banner, switches buttons from
  // "Request information" to "Request care", and shows
  // launch-only sections.
  licensed: false,

  // Flip to true the day Joint Commission accreditation is granted.
  // Separate from licensure: the "Pending Joint Commission
  // Accreditation" notices stay up until this is true.
  accredited: false,

  // Fill in when ready — call buttons appear automatically.
  phone: "",          // e.g. "(850) 555-0123"
  fax: "",            // e.g. "(850) 555-0124"
  email: "Ashramhhc@outlook.com",

  // Where form submissions are sent. Create a free form at
  // formspree.io and paste its endpoint here, e.g.
  // "https://formspree.io/f/abcdwxyz". Until then, forms show
  // a thank-you message but nothing is sent.
  formEndpoint: "",

  // Résumé upload on the Careers application. Needs a Formspree plan
  // that includes file uploads (Personal or higher). On the free plan,
  // set this to false and applicants are asked to email their résumé.
  resumeUploads: true
};
(function (c, d) {
  var h = d.documentElement;
  h.classList.toggle("licensed", !!c.licensed);
  h.classList.toggle("accredited", !!c.accredited);
  h.classList.toggle("has-phone", !!c.phone);
  h.classList.toggle("has-fax", !!c.fax);
})(window.ASHRAM, document);
