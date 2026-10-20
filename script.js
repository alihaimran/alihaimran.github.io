const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

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

/* count up */
function countUp(el) {
  const to = +el.dataset.n, t0 = performance.now();
  (function f(t) {
    const p = Math.min((t - t0) / 1400, 1);
    el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(f);
  })(t0);
}
new IntersectionObserver((es, o) => es.forEach(e => {
  if (!e.isIntersecting) return;
  countUp(e.target); o.unobserve(e.target);
}), { threshold: .6 }).observe($('[data-n]'));

/* active nav link */
const links = $$('.nav nav a'), secs = links.map(a => $(a.getAttribute('href')));
addEventListener('scroll', () => {
  let idx = 0;
  secs.forEach((s, i) => { if (s && s.getBoundingClientRect().top < innerHeight * .4) idx = i; });
  links.forEach((a, i) => a.classList.toggle('on', i === idx));
}, { passive: true });

/* copy email */
$('#copy').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText('alihaimran676@gmail.com'); } catch (e) {}
  const t = $('#toast'); t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 1800);
});
