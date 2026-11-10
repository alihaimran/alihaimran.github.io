/* ===== CONFIG =====
   Contact form: paste your Formspree endpoint (https://formspree.io/f/xxxxxxxx) into FORM_ENDPOINT.
   Create a free form at formspree.io with alihaimran676@gmail.com and copy its URL here.
   While FORM_ENDPOINT is empty, the form opens the visitor's email app with the message prefilled. */
const FORM_ENDPOINT = '';
const EMAIL = 'alihaimran676@gmail.com';

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
document.documentElement.classList.add('js');
$('#year').textContent = new Date().getFullYear();

/* toast */
const toast = $('#toast');
let tt;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(tt);
  tt = setTimeout(() => toast.classList.remove('show'), 2400);
}

/* mobile menu */
const nav = $('#nav'), burger = $('#burger');
function setMenu(open) {
  nav.classList.toggle('open', open);
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
  burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}
burger.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
$$('#menu a').forEach(a => a.addEventListener('click', () => setMenu(false)));
addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

/* scroll progress + active link */
const bar = $('#progress'), links = $$('#menu a'), secs = links.map(a => $(a.getAttribute('href')));
let ticking = false;
function onScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.transform = `scaleX(${max > 0 ? Math.min(scrollY / max, 1) : 0})`;
  let idx = 0;
  secs.forEach((s, i) => { if (s.getBoundingClientRect().top < innerHeight * .4) idx = i; });
  links.forEach((a, i) => a.classList.toggle('on', i === idx));
  ticking = false;
}
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
onScroll();

/* back to top */
$('#top').addEventListener('click', e => {
  e.preventDefault();
  scrollTo({ top: 0, behavior: still ? 'auto' : 'smooth' });
});

/* fade-in on scroll */
const io = new IntersectionObserver((es, o) => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); o.unobserve(e.target); }
}), { threshold: .1 });
$$('.reveal').forEach(el => io.observe(el));

/* resume: warn if the PDF has not been added yet */
$('#cv').addEventListener('click', async e => {
  const href = e.currentTarget.href;
  try {
    const r = await fetch(href, { method: 'HEAD' });
    if (!r.ok) throw 0;
  } catch (err) {
    e.preventDefault();
    showToast('Resume not uploaded yet. Please email me.');
  }
});

/* contact form */
const form = $('#form'), note = $('#formNote'), send = $('#send');
const fields = ['fName', 'fEmail', 'fMsg'].map(id => $('#' + id));
fields.forEach(f => f.addEventListener('input', () => f.classList.remove('err')));
form.addEventListener('submit', async e => {
  e.preventDefault();
  let ok = true;
  fields.forEach(f => {
    const bad = !f.value.trim() || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value.trim()));
    f.classList.toggle('err', bad);
    if (bad && ok) { f.focus(); ok = false; }
  });
  if (!ok) { note.textContent = 'Complete all fields with a valid email.'; return; }
  const [name, email, message] = fields.map(f => f.value.trim());
  if (!FORM_ENDPOINT) {
    const subject = `Portfolio enquiry from ${name}`;
    location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`${message}\n\n${name}\n${email}`)}`;
    note.textContent = `Opening your email app. If nothing opens, write to ${EMAIL}.`;
    return;
  }
  send.disabled = true;
  note.textContent = 'Sending...';
  try {
    const r = await fetch(FORM_ENDPOINT, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) });
    if (!r.ok) throw 0;
    form.reset();
    note.textContent = 'Message sent. Thank you.';
    showToast('Message sent');
  } catch (err) {
    note.textContent = `Could not send. Please email ${EMAIL} directly.`;
  } finally {
    send.disabled = false;
  }
});
