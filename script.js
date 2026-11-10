/* ===== CONFIG =====
   Contact form: paste your Formspree endpoint (https://formspree.io/f/xxxxxxxx) below.
   Create a free form at formspree.io using alihaimran676@gmail.com, then copy its URL here.
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
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

/* theme toggle (saved, falls back to system preference) */
const root = document.documentElement, themeBtn = $('#theme');
function setTheme(t) {
  root.dataset.theme = t;
  themeBtn.setAttribute('aria-label', t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  $('meta[name="theme-color"]').content = t === 'dark' ? '#080808' : '#f7f7f7';
  try { localStorage.setItem('theme', t); } catch (e) {}
}
let saved = null;
try { saved = localStorage.getItem('theme'); } catch (e) {}
setTheme(saved || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'));
themeBtn.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

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

/* active nav link + back to top */
const links = $$('#menu a'), secs = links.map(a => $(a.getAttribute('href')));
const top = $('#top');
function onScroll() {
  let idx = 0;
  secs.forEach((s, i) => { if (s.getBoundingClientRect().top < innerHeight * .4) idx = i; });
  links.forEach((a, i) => a.classList.toggle('on', i === idx));
  top.classList.toggle('show', scrollY > 600);
}
addEventListener('scroll', onScroll, { passive: true });
onScroll();
top.addEventListener('click', () => scrollTo({ top: 0, behavior: still ? 'auto' : 'smooth' }));

/* scroll reveal */
const io = new IntersectionObserver((es, o) => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); o.unobserve(e.target); }
}), { threshold: .12 });
$$('.reveal').forEach(el => io.observe(el));

/* count-up stats */
const cio = new IntersectionObserver((es, o) => es.forEach(e => {
  if (!e.isIntersecting) return;
  o.unobserve(e.target);
  const el = e.target, to = +el.dataset.n, suf = el.dataset.suffix || '', t0 = performance.now();
  (function f(t) {
    const p = Math.min((t - t0) / 1200, 1);
    el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))) + suf;
    if (p < 1) requestAnimationFrame(f);
  })(t0);
}), { threshold: .6 });
if (!still) $$('[data-n]').forEach(el => cio.observe(el));

/* hero: lightweight network animation */
const cv = $('#net'), ctx = cv.getContext('2d');
let W, H, pts = [], raf;
function size() {
  const d = Math.min(devicePixelRatio || 1, 2);
  W = cv.clientWidth; H = cv.clientHeight;
  cv.width = W * d; cv.height = H * d;
  ctx.setTransform(d, 0, 0, d, 0, 0);
  const n = Math.min(60, Math.round(W * H / 18000));
  pts = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3 }));
}
function draw() {
  ctx.clearRect(0, 0, W, H);
  const c = root.dataset.theme === 'dark' ? '255,255,255' : '8,8,8';
  pts.forEach((p, i) => {
    if (!still) { p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1; }
    ctx.fillStyle = `rgba(${c},.5)`;
    ctx.beginPath(); ctx.arc(p.x, p.y, 1.8, 0, 6.3); ctx.fill();
    for (let j = i + 1; j < pts.length; j++) {
      const q = pts[j], d = Math.hypot(p.x - q.x, p.y - q.y);
      if (d < 140) { ctx.strokeStyle = `rgba(${c},${.18 * (1 - d / 140)})`; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
    }
  });
  if (!still) raf = requestAnimationFrame(draw);
}
size(); draw();
addEventListener('resize', () => { cancelAnimationFrame(raf); size(); draw(); });
document.addEventListener('visibilitychange', () => {
  cancelAnimationFrame(raf);
  if (!document.hidden && !still) draw();
});

/* copy buttons */
$$('[data-copy]').forEach(b => b.addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(b.dataset.copy); showToast('Email copied'); }
  catch (e) { showToast(b.dataset.copy); }
}));

/* CV download: warn if the file has not been added yet */
$('#cv').addEventListener('click', async e => {
  try {
    const r = await fetch(e.currentTarget.href, { method: 'HEAD' });
    if (!r.ok) throw 0;
  } catch (err) {
    e.preventDefault();
    showToast('CV not uploaded yet. Please email me.');
  }
});

/* contact form */
const form = $('#form'), note = $('#formNote'), send = $('#send');
const fields = ['fName', 'fEmail', 'fSubject', 'fMsg'].map(id => $('#' + id));
fields.forEach(f => f.addEventListener('input', () => f.classList.remove('err')));
form.addEventListener('submit', async e => {
  e.preventDefault();
  let ok = true;
  fields.forEach(f => {
    const bad = !f.value.trim() || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value));
    f.classList.toggle('err', bad);
    if (bad && ok) { f.focus(); ok = false; }
  });
  if (!ok) { note.textContent = 'Please complete all fields with a valid email.'; return; }
  const [name, email, subject, message] = fields.map(f => f.value.trim());
  if (!FORM_ENDPOINT) {
    location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`${message}\n\n${name}\n${email}`)}`;
    note.textContent = 'Opening your email app. If nothing opens, write to ' + EMAIL + '.';
    return;
  }
  send.disabled = true; note.textContent = 'Sending...';
  try {
    const r = await fetch(FORM_ENDPOINT, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) });
    if (!r.ok) throw 0;
    form.reset(); note.textContent = 'Thanks, your message was sent.'; showToast('Message sent');
  } catch (err) {
    note.textContent = 'Could not send. Please email ' + EMAIL + ' directly.';
  } finally { send.disabled = false; }
});
