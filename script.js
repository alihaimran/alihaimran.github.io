const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
const WA_NUMBER = '923094146324'; // +92 309 4146324

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

/* cards: light follows the cursor */
$$('.g').forEach(c => c.addEventListener('pointermove', e => {
  const r = c.getBoundingClientRect();
  c.style.setProperty('--mx', e.clientX - r.left + 'px');
  c.style.setProperty('--my', e.clientY - r.top + 'px');
}));

/* dashboard: tilted -> flat while scrolling */
const stage = $('#stage'), dash = $('#dash');
function tilt() {
  const r = stage.getBoundingClientRect();
  const p = still ? 1 : Math.min(1, Math.max(0, (innerHeight * 0.92 - r.top) / (innerHeight * 0.55)));
  dash.style.setProperty('--p', p.toFixed(3));
}
addEventListener('scroll', tilt, { passive: true });
addEventListener('resize', tilt);
tilt();

/* skill bars grow when the dashboard is in view */
const bars = $$('.bars i');
bars.forEach(b => b.style.setProperty('--g', still ? 1 : 0));
new IntersectionObserver((es, o) => es.forEach(e => {
  if (!e.isIntersecting) return;
  bars.forEach(b => b.style.setProperty('--g', 1));
  o.disconnect();
}), { threshold: .5 }).observe(dash);

/* count up (experience years) */
const counter = $('[data-n]');
function countUp(el) {
  const to = +el.dataset.n, t0 = performance.now();
  (function f(t) {
    const p = Math.min((t - t0) / 1400, 1);
    el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(f);
  })(t0);
}
if (!still) {
  counter.textContent = '0';
  new IntersectionObserver((es, o) => es.forEach(e => {
    if (!e.isIntersecting) return;
    countUp(e.target); o.unobserve(e.target);
  }), { threshold: .6 }).observe(counter);
}

/* gallery image lightbox */
const lb = $('#lightbox'), lbImg = $('#lbImg');
function closeLb() { lb.hidden = true; lbImg.src = ''; }
$$('.shot-btn').forEach(b => b.addEventListener('click', () => {
  if (!b.querySelector('img')) return;
  lbImg.src = b.dataset.full;
  lbImg.alt = b.dataset.alt || '';
  lb.hidden = false;
  $('#lbClose').focus();
}));
$('#lbClose').addEventListener('click', closeLb);
lb.addEventListener('click', e => { if (e.target !== lbImg) closeLb(); });
addEventListener('keydown', e => { if (e.key === 'Escape' && !lb.hidden) closeLb(); });

/* active nav link */
const links = $$('#menu a'), secs = links.map(a => $(a.getAttribute('href')));
addEventListener('scroll', () => {
  let idx = 0;
  secs.forEach((s, i) => { if (s && s.getBoundingClientRect().top < innerHeight * .4) idx = i; });
  links.forEach((a, i) => a.classList.toggle('on', i === idx));
}, { passive: true });

/* toast + copy buttons (email, phone) */
const toast = $('#toast');
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1800);
}
$$('[data-copy]').forEach(b => b.addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(b.dataset.copy); } catch (e) {}
  showToast(b.dataset.msg || 'Copied');
}));

/* contact form -> opens WhatsApp with a prefilled message */
const form = $('#waForm');
form.addEventListener('submit', e => {
  e.preventDefault();
  const name = $('#fName'), topic = $('#fTopic').value, msg = $('#fMsg').value.trim();
  name.classList.toggle('err', !name.value.trim());
  if (!name.value.trim()) { name.focus(); return; }
  const text = `Hi Aliha, I'm ${name.value.trim()}.\nI'm reaching out about: ${topic}.` + (msg ? `\n\n${msg}` : '');
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
});
$('#fName').addEventListener('input', e => e.target.classList.remove('err'));
