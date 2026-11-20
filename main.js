/* Ashram Home Healthcare — shared behavior */
(function () {
  const C = window.ASHRAM || {};
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const ic = id => '<svg><use href="#' + id + '"/></svg>';
  const esc = t => String(t).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

  /* ---- Contact details from config ---- */
  const tel = p => 'tel:+1' + String(p).replace(/\D/g, '').replace(/^1/, '');
  $$('[data-phone]').forEach(el => { if (C.phone){ el.textContent = C.phone; if (el.tagName === 'A') el.href = tel(C.phone); } });
  $$('a[data-phone-link]').forEach(a => { if (C.phone) a.href = tel(C.phone); });
  $$('[data-fax]').forEach(el => { if (C.fax) el.textContent = C.fax; });
  $$('[data-email]').forEach(el => { el.textContent = C.email; if (el.tagName === 'A') el.href = 'mailto:' + C.email; });
  $$('#yr').forEach(el => el.textContent = new Date().getFullYear());

  /* ---- Header ---- */
  const header = $('#header'), callBar = $('#callBar');
  let lastY = 0;
  function onScroll(){
    const y = scrollY;
    header.classList.toggle('is-solid', y > 30);
    if (y > 420 && y > lastY + 4) header.classList.add('is-hidden');
    else if (y < lastY - 4 || y < 420) header.classList.remove('is-hidden');
    if (callBar) callBar.classList.toggle('show', y > 420);
    lastY = y;
  }
  addEventListener('scroll', onScroll, {passive:true}); onScroll();

  const menu = $('#mobileNav'), menuBtn = $('#menuBtn');
  function setMenu(o){ menu.classList.toggle('open', o); menuBtn.setAttribute('aria-expanded', o); document.body.classList.toggle('locked', o || $('#flow').classList.contains('open')); }
  menuBtn.onclick = () => setMenu(true);
  $('#menuClose').onclick = () => setMenu(false);
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));

  /* ---- Reveal ---- */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }), {threshold:.12, rootMargin:'0px 0px -30px 0px'});
  $$('.reveal').forEach(el => io.observe(el));

  /* ---- Map ---- */
  const COUNTIES = [
    {k:'escambia', n:'Escambia', d:'M40 60 L170 60 L170 262 L156 298 L120 322 L66 334 L52 300 L64 240 L48 160 Z', lx:108, ly:170,
      towns:{'Pensacola':['32501','32502','32503','32504','32505','32506','32507','32514','32526','32534'],'Cantonment':['32533'],'Molino':['32577'],'Century':['32535'],'Perdido Key':['32507'],'Walnut Hill':['32568'],'McDavid':['32568']}},
    {k:'santarosa', n:'Santa Rosa', d:'M170 60 L300 60 L300 330 L246 334 L200 324 L156 298 L170 262 Z', lx:235, ly:170,
      towns:{'Milton':['32570','32583'],'Pace':['32571'],'Gulf Breeze':['32561','32563'],'Navarre':['32566'],'Jay':['32565'],'Bagdad':['32530']}},
    {k:'okaloosa', n:'Okaloosa', d:'M300 60 L440 60 L440 326 L372 336 L300 330 Z', lx:370, ly:220,
      towns:{'Crestview':['32536','32539'],'Fort Walton Beach':['32547','32548'],'Destin':['32541'],'Niceville':['32578'],'Mary Esther':['32569'],'Valparaiso':['32580'],'Baker':['32531'],'Shalimar':['32579']}},
    {k:'walton', n:'Walton', d:'M440 60 L590 60 L590 150 L566 158 L566 326 L500 332 L440 326 Z', lx:503, ly:220,
      towns:{'DeFuniak Springs':['32433','32435'],'Santa Rosa Beach':['32459'],'Miramar Beach':['32550'],'Freeport':['32439'],'Inlet Beach':['32461'],'Paxton':['32538']}}
  ];
  const CITIES = [['Pensacola',150,292,1],['Milton',228,236],['Gulf Breeze',196,318,0,'end'],['Navarre',262,322],['Crestview',366,128],['Fort Walton Beach',318,312],['Destin',398,326],['DeFuniak Springs',515,118],['Santa Rosa Beach',508,318]];
  function mapSVG(){
    let s = '<svg viewBox="0 0 800 420" role="img" aria-label="Map of Northwest Florida showing Escambia, Santa Rosa, Okaloosa, and Walton Counties">';
    s += '<rect width="800" height="60" fill="#EDE4D7"/><text x="320" y="38" font-family="Plus Jakarta Sans,sans-serif" font-size="13" font-weight="700" letter-spacing="6" fill="#17426E" opacity=".4">ALABAMA</text>';
    s += '<path d="M0 340 C60 336 100 344 160 336 C230 330 300 342 380 340 C460 338 520 334 600 332 C680 330 740 316 800 300 L800 420 L0 420 Z" fill="#CFE6EC"/>';
    s += '<path d="M590 60 L760 60 L760 150 L590 150 Z M566 158 L590 150 L760 150 L800 290 L720 326 L566 326 Z" fill="#E8DFD2" stroke="#fff" stroke-width="3"/>';
    COUNTIES.forEach(c => { s += '<path class="county" data-k="' + c.k + '" d="' + c.d + '"><title>' + c.n + ' County</title></path>'; });
    s += '<ellipse cx="182" cy="314" rx="34" ry="11" fill="#CFE6EC" transform="rotate(-12 182 314)"/><ellipse cx="452" cy="312" rx="66" ry="10" fill="#CFE6EC"/>';
    s += '<path d="M60 352 C200 347 400 350 570 342" fill="none" stroke="#F3E6D2" stroke-width="4" stroke-linecap="round"/>';
    COUNTIES.forEach(c => { s += '<text class="county-label" data-k="' + c.k + '" x="' + c.lx + '" y="' + c.ly + '" text-anchor="middle">' + c.n.toUpperCase() + '</text>'; });
    CITIES.forEach(c => {
      s += '<circle class="city-dot' + (c[3] ? ' hq' : '') + '" cx="' + c[1] + '" cy="' + c[2] + '" r="' + (c[3] ? 7 : 4.5) + '"/>';
      s += c[4] === 'end' ? '<text class="city-label" text-anchor="end" x="' + (c[1] - 8) + '" y="' + (c[2] + 16) + '">' + c[0] + '</text>'
                          : '<text class="city-label" x="' + (c[1] + 9) + '" y="' + (c[2] - 7) + '">' + c[0] + '</text>';
    });
    s += '<text x="40" y="398" font-family="Newsreader,serif" font-style="italic" font-size="20" fill="#17426E" opacity=".5">Gulf of Mexico</text></svg>';
    s += '<div class="map-legend"><span><i style="background:#2A9D96"></i>Our service area</span><span><i style="background:#E8742A"></i>Pensacola office</span></div>';
    return s;
  }
  $$('[data-map]').forEach(el => { el.innerHTML = mapSVG(); });
  function highlight(k){ $$('.county, .county-label').forEach(p => p.classList.toggle('on', p.dataset.k === k)); }
  const areaForm = $('#areaForm');
  if (areaForm) areaForm.addEventListener('submit', e => {
    e.preventDefault();
    const q = $('#areaInput').value.trim().toLowerCase(), r = $('#areaResult');
    if (!q) return;
    let hit = null;
    COUNTIES.forEach(c => Object.entries(c.towns).forEach(([t, z]) => { if (!hit && (t.toLowerCase() === q || z.includes(q) || (q.length > 3 && t.toLowerCase().startsWith(q)))) hit = {c, t}; }));
    if (!hit){ const c = COUNTIES.find(c => q.includes(c.n.toLowerCase())); if (c) hit = {c, t:c.n + ' County'}; }
    if (hit){ r.className = 'mini-result yes'; r.textContent = '✓ Yes, ' + hit.t + ' is in our service area (' + hit.c.n + ' County).'; highlight(hit.c.k); }
    else { r.className = 'mini-result maybe'; r.textContent = 'That may be outside our area. Contact us and we’ll let you know.'; highlight(null); }
  });

  /* ---- Form sending ---- */
  async function send(kind, data){
    if (!C.formEndpoint) { console.info('[Ashram] formEndpoint not set in config.js. Submission not sent:', kind, data); return true; }
    try {
      const res = await fetch(C.formEndpoint, {method:'POST', headers:{'Content-Type':'application/json','Accept':'application/json'}, body:JSON.stringify(Object.assign({_form:kind, _page:location.pathname}, data))});
      return res.ok;
    } catch (e) { return false; }
  }
  const validEmail = v => /^\S+@\S+\.\S+$/.test(v);

  const cf = $('#contactForm');
  if (cf) cf.addEventListener('submit', async e => {
    e.preventDefault();
    if (cf.querySelector('.hp input').value) return;
    const n = cf.querySelector('#c-name'), m = cf.querySelector('#c-email');
    let ok = true;
    [n, m].forEach(x => { const bad = !x.value.trim() || (x.type === 'email' && !validEmail(x.value)); x.classList.toggle('bad', bad); if (bad) ok = false; });
    if (!ok) return;
    const data = {}; cf.querySelectorAll('[name]').forEach(f => { if (f.name !== 'website') data[f.name] = f.value; });
    await send('contact', data);
    cf.classList.add('sent');
  });

  /* ================= GUIDED FLOW ================= */
  const OPTS = {
    audience:[['family','Care for me or a loved one','i-home','Patients and families'],['referral','I’m a healthcare provider','i-steth','Physician, hospital, case manager, social worker'],['career','I’m looking for a job','i-briefcase','Nurses, aides, and office roles'],['partner','Insurance or business inquiry','i-dollar','Payers, partners, vendors']],
    who:[['Myself','Myself','i-user'],['My parent','My parent','i-users'],['My spouse or partner','My spouse or partner','i-heart'],['My child','My child','i-sun'],['Someone else','Someone else','i-home']],
    situ:[['Coming home from the hospital','Coming home from the hospital or surgery','i-hospital'],['Wound care','A wound that needs care','i-bandage'],['IV therapy','IV medication at home','i-drop'],['Ongoing health condition','Managing an ongoing condition','i-steth'],['Help with daily living','Help bathing, dressing, moving','i-hand'],['Complex care','Complex care or longer nursing visits','i-clipboard'],['Not sure','Not sure yet','i-info']],
    county:[['Escambia','Escambia County','i-pin'],['Santa Rosa','Santa Rosa County','i-pin'],['Okaloosa','Okaloosa County','i-pin'],['Walton','Walton County','i-pin'],['Other','Somewhere else','i-map']],
    refRole:[['Physician / medical office','Physician or medical office','i-steth'],['Hospital / discharge planning','Hospital or discharge planning','i-building'],['Case manager / social worker','Case manager or social worker','i-users'],['Other provider','Other healthcare provider','i-hospital']],
    jobRole:[['RN','Registered Nurse (RN)','i-steth'],['LPN','Licensed Practical Nurse (LPN)','i-hospital'],['HHA / CNA','Home Health Aide / CNA','i-hand'],['Office','Office or intake','i-briefcase'],['Other','Other role','i-user']],
    topic:[['Insurance / payer','Insurance or payer partnership','i-dollar'],['Healthcare partnership','Healthcare partnership','i-network'],['Business inquiry','Vendor or business inquiry','i-building'],['Other','Something else','i-chat']]
  };
  const PENDING_NOTE = '<span class="if-pending">We’re completing AHCA licensure now. Reach out today and we’ll help you plan ahead.</span>';
  const PATHS = {
    family:{label:'Talk with our team', steps:[
      {id:'who', type:'single', opts:'who', q:'Who is the care for?', sub:'We’ll tailor everything to them.'},
      {id:'situ', type:'multi', opts:'situ', q:'What’s going on?', sub:'Choose all that apply.'},
      {id:'county', type:'single', opts:'county', q:'Where would care be needed?', sub:'We serve four Northwest Florida counties.'},
      {type:'form', fields:['name','phone','email'], q:'How can we reach you?', sub:'A member of our team will reach out to talk through your options.', btn:'Send'}],
      done:{pending:['We’ll reach out to answer your questions.','We’ll explain your care and coverage options.','We’ll contact you as soon as we’re licensed to begin care.'],
            open:['A member of our team will contact you shortly.','We’ll talk through care, coverage, and next steps.','Then we’ll coordinate with your doctor to begin care.']}},
    referral:{label:'Become a referral partner', steps:[
      {id:'role', type:'single', opts:'refRole', q:'What best describes you?', sub:'So we send the right information.'},
      {id:'county', type:'multi', opts:'county', q:'Where are your patients?', sub:'Choose all that apply.'},
      {type:'form', fields:['name','org','email','phone'], q:'How can we reach you?', sub:'We’ll introduce our team and our referral process.', btn:'Send'}],
      done:{pending:['We’ll reach out to introduce our team.','We’ll share our services and referral process.','We’ll let you know the day we begin accepting referrals.'],
            open:['Our intake team will contact you shortly.','We’ll share our referral process and contacts.','Send your first referral anytime.']}},
    career:{label:'Apply to join our team', steps:[
      {id:'role', type:'single', opts:'jobRole', q:'What role are you interested in?', sub:'We’re building our founding team.'},
      {id:'county', type:'multi', opts:'county', q:'Where would you like to work?', sub:'Choose all that apply.'},
      {type:'form', fields:['name','phone','email','note'], q:'How can we reach you?', sub:'No résumé needed yet. We’ll ask when we talk.', btn:'Apply'}],
      done:{pending:['We’ll review your information.','We’ll reach out to set up a conversation.','You’ll be among the first we consider as we hire.'],
            open:['We’ll review your information.','We’ll reach out to set up a conversation.','Interviews move quickly.']}},
    partner:{label:'Contact us', steps:[
      {id:'topic', type:'single', opts:'topic', q:'What would you like to discuss?', sub:'We’ll route you to the right person.'},
      {type:'form', fields:['name','org','email','message'], q:'Tell us a bit more', sub:'Our Director of Operations will review your message.', btn:'Send'}],
      done:{pending:['We’ll review your message.','We’ll respond by email.'], open:['We’ll review your message.','We’ll respond by email.']}}
  };
  const FIELDS = {
    name:{label:'Full name', type:'text', ac:'name', req:true},
    org:{label:'Organization', type:'text', ac:'organization', req:false},
    email:{label:'Email', type:'email', ac:'email', req:false},
    phone:{label:'Phone', type:'tel', ac:'tel', req:false},
    note:{label:'License or certification', type:'text', ac:'off', req:false},
    message:{label:'Message', type:'textarea', req:false}
  };
  const flow = $('#flow'), body = $('#flowBody'), prog = $('#flowProgress'), back = $('#flowBack'), next = $('#flowNext'), foot = $('#flowFoot');
  let st = {path:null, i:0, data:{}, direct:false}, lastFocus = null, sending = false;
  const AUD = {id:'audience', type:'single', opts:'audience', q:'How can we help?', sub:'Choose what fits you best.', stack:true};
  const steps = () => [AUD].concat(st.path ? PATHS[st.path].steps : []).concat(st.path ? [{type:'done'}] : []);
  const valid = s => s.type === 'single' ? !!st.data[s.id] : s.type === 'multi' ? (st.data[s.id] || []).length > 0 : true;

  function render(){
    const all = steps(), s = all[st.i], off = st.direct ? 1 : 0, total = (st.path ? all.length - 1 : 3) - off, pos = st.i - off;
    prog.innerHTML = Array.from({length: total}, (_, j) => '<span class="' + (j <= pos ? 'done' : '') + '"></span>').join('');
    let h = '<div class="fstep">';
    if (s.type !== 'done') h += '<span class="q-label">Step ' + (pos + 1) + ' of ' + total + '</span>';
    if (s.type === 'single' || s.type === 'multi'){
      const sel = st.data[s.id];
      h += '<h2>' + s.q + '</h2><p class="q-sub">' + s.sub + '</p><div class="choices' + (s.stack ? ' stack' : '') + '">';
      OPTS[s.opts].forEach(o => {
        const on = s.type === 'multi' ? (sel || []).includes(o[0]) : sel === o[0];
        h += '<button class="choice" data-v="' + esc(o[0]) + '" aria-pressed="' + on + '"><span class="ci">' + ic(o[2]) + '</span><span>' + o[1] + (o[3] ? '<small>' + o[3] + '</small>' : '') + '</span></button>';
      });
      h += '</div>';
    } else if (s.type === 'form'){
      h += '<h2>' + s.q + '</h2><p class="q-sub">' + s.sub + '</p>';
      s.fields.forEach(k => {
        const f = FIELDS[k], v = st.data['f_' + k] || '';
        h += '<div class="field"><label for="ff-' + k + '">' + f.label + (f.req || k === 'phone' || k === 'email' ? '' : ' <small>(optional)</small>') + '</label>' +
          (f.type === 'textarea' ? '<textarea id="ff-' + k + '" data-f="' + k + '">' + esc(v) + '</textarea>'
            : '<input id="ff-' + k + '" data-f="' + k + '" type="' + f.type + '" autocomplete="' + f.ac + '" value="' + esc(v) + '">') + '</div>';
      });
      h += '<p class="privacy-note" id="ffHint">' + ic('i-info') + '<span>A phone number or email is fine, whichever you prefer.</span></p>';
      h += '<p class="privacy-note">' + ic('i-lock') + '<span>Private and secure. Please don’t include medical details here. ' + PENDING_NOTE + '</span></p>';
    } else {
      const first = (st.data.f_name || '').split(' ')[0], D = PATHS[st.path].done;
      const list = arr => '<ol class="next-list">' + arr.map((d, j) => '<li><i>' + (j + 1) + '</i><span>' + d + '</span></li>').join('') + '</ol>';
      h += '<div class="done-wrap"><div class="done-check">' + ic('i-check') + '</div><h2>Thank you' + (first ? ', ' + esc(first) : '') + '</h2>' +
        '<p class="q-sub" style="margin:6px auto 0">Here’s what happens next:</p>' +
        '<div class="if-pending">' + list(D.pending) + '</div><div class="if-open">' + list(D.open) + '</div>' +
        '<p class="q-sub" style="margin-top:22px;font-size:15px">Questions? Email <a href="mailto:' + C.email + '">' + C.email + '</a>' +
        (C.phone ? ' or call <a href="' + tel(C.phone) + '">' + C.phone + '</a>' : '') + '.</p>' +
        '<button class="btn btn-primary" id="flowDone">Done</button></div>';
    }
    body.innerHTML = h + '</div>';
    body.scrollTop = 0;
    foot.style.display = s.type === 'done' ? 'none' : '';
    back.classList.toggle('hide', st.i === 0);
    next.disabled = !valid(s);
    next.innerHTML = s.type === 'form' ? s.btn + ' ' + ic('i-send') : 'Continue ' + ic('i-arrow-r');
    $('#flowTitleTxt').textContent = st.path ? PATHS[st.path].label : 'Ashram Home Healthcare';

    body.querySelectorAll('.choice').forEach(b => b.onclick = () => {
      const v = b.dataset.v;
      if (s.type === 'multi'){
        const arr = st.data[s.id] = st.data[s.id] || [];
        const at = arr.indexOf(v); at > -1 ? arr.splice(at, 1) : arr.push(v);
        b.setAttribute('aria-pressed', at === -1);
        next.disabled = !valid(s);
      } else {
        body.querySelectorAll('.choice').forEach(x => x.setAttribute('aria-pressed', 'false'));
        b.setAttribute('aria-pressed', 'true');
        if (s.id === 'audience' && st.path !== v){ const k = st.data; st.data = {f_name:k.f_name, f_email:k.f_email, f_phone:k.f_phone}; st.path = v; }
        st.data[s.id] = v;
        next.disabled = false;
        const at = st.i;
        setTimeout(() => { if (st.i === at) go(1); }, reduce ? 0 : 260);
      }
    });
    body.querySelectorAll('[data-f]').forEach(inp => inp.oninput = () => { st.data['f_' + inp.dataset.f] = inp.value; inp.classList.remove('bad'); });
    const d = $('#flowDone'); if (d) d.onclick = close;
  }
  async function go(dir){
    const s = steps()[st.i];
    if (dir > 0 && s.type === 'form'){
      if (sending) return;
      let ok = true, firstBad = null;
      s.fields.forEach(k => {
        const f = FIELDS[k], inp = body.querySelector('[data-f="' + k + '"]'), v = inp.value.trim();
        const bad = (f.req && !v) || (f.type === 'email' && v && !validEmail(v));
        inp.classList.toggle('bad', bad); if (bad){ ok = false; firstBad = firstBad || inp; }
      });
      const ph = body.querySelector('[data-f="phone"]'), em = body.querySelector('[data-f="email"]');
      if (ok && ph && em && !ph.value.trim() && !em.value.trim()){ ok = false; ph.classList.add('bad'); em.classList.add('bad'); firstBad = ph; }
      if (!ok){ firstBad.focus(); return; }
      sending = true; next.disabled = true;
      const out = {type:st.path};
      Object.keys(st.data).forEach(k => { out[k.replace(/^f_/, '')] = Array.isArray(st.data[k]) ? st.data[k].join(', ') : st.data[k]; });
      await send('flow-' + st.path, out);
      sending = false;
    }
    if (dir > 0 && !valid(s)) return;
    st.i = Math.max(0, Math.min(steps().length - 1, st.i + dir));
    render();
  }
  back.onclick = () => { if (st.direct && st.i === 1) st.direct = false; go(-1); };
  next.onclick = () => go(1);
  function open(path){
    lastFocus = document.activeElement;
    const cur = steps()[st.i];
    if (!st.path || (cur && cur.type === 'done') || (path && path !== st.path)) st = {path:null, i:0, data:{}, direct:false};
    if (path){ st.path = path; st.data.audience = path; st.i = Math.max(st.i, 1); st.direct = true; }
    render();
    flow.classList.add('open'); flow.setAttribute('aria-hidden', 'false');
    document.body.classList.add('locked');
    menu.classList.remove('open');
    setTimeout(() => $('#flowClose').focus(), 60);
  }
  function close(){
    flow.classList.remove('open'); flow.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('locked');
    const cur = steps()[st.i];
    if (cur && cur.type === 'done') st = {path:null, i:0, data:{}, direct:false};
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  $$('[data-open]').forEach(b => b.addEventListener('click', e => { e.preventDefault(); open(b.dataset.open); }));
  $('#flowClose').onclick = close;
  flow.addEventListener('click', e => { if (e.target === flow) close(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape'){ if (flow.classList.contains('open')) close(); else setMenu(false); }
    if (e.key === 'Tab' && flow.classList.contains('open')){
      const f = [...flow.querySelectorAll('button, input, textarea, a[href]')].filter(el => el.offsetParent !== null && !el.disabled);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]){ e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]){ e.preventDefault(); f[0].focus(); }
    }
  });
  // Services page: open the service named in the link (#wound etc.)
  const tgt = location.hash && document.getElementById(location.hash.slice(1));
  if (tgt && tgt.tagName === 'DETAILS'){ $$('details.svc').forEach(d => d.open = d === tgt); tgt.classList.add('in'); }
  // Deep link: page.html#start opens the family flow
  if (location.hash === '#start') open('family');
})();
