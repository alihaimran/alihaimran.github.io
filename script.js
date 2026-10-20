const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* cursor light */
addEventListener('pointermove', e => {
  const l = $('#light');
  l.style.setProperty('--x', e.clientX + 'px');
  l.style.setProperty('--y', e.clientY + 'px');
});

/* lit-edge cards follow the cursor */
$$('.glow').forEach(c => c.addEventListener('pointermove', e => {
  const r = c.getBoundingClientRect();
  c.style.setProperty('--mx', e.clientX - r.left + 'px');
  c.style.setProperty('--my', e.clientY - r.top + 'px');
}));

/* scroll-driven 3D panel: tilted -> flat */
const stage = $('#stage'), panel = $('#panel');
function tilt() {
  const r = stage.getBoundingClientRect();
  const p = still ? 1 : Math.min(1, Math.max(0, (innerHeight * 0.95 - r.top) / (innerHeight * 0.6)));
  panel.style.setProperty('--p', p.toFixed(3));
}
addEventListener('scroll', tilt, { passive: true });
addEventListener('resize', tilt);
tilt();

/* agent log inside the panel */
const lines = [
  ['query', '"summarize the latest RAG paper"'],
  ['embed', 'encoding query to a 1536-dim vector'],
  ['retrieve', 'top-k=5 chunks from ChromaDB'],
  ['rank', 'reranking context by relevance'],
  ['agent', 'planning the next tool call'],
  ['llm', 'generating a grounded answer'],
  ['done', 'response streamed in 412 ms'],
];
const log = $('#log');
lines.forEach(([k, t]) => {
  const d = document.createElement('div');
  d.innerHTML = `<b>${k}</b>${t}`;
  log.appendChild(d);
});
let logged = false;
function playLog() {
  if (logged) return; logged = true;
  $$('div', log).forEach((d, i) => setTimeout(() => d.classList.add('on'), still ? 0 : i * 450));
}

/* count up stats */
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
  if (e.target.id === 'panel') playLog();
  else $$('[data-n]', e.target).forEach(countUp);
  o.unobserve(e.target);
}), { threshold: .35 }).observe(panel);
const so = new IntersectionObserver((es, o) => es.forEach(e => {
  if (!e.isIntersecting) return;
  $$('[data-n]', e.target).forEach(countUp);
  o.unobserve(e.target);
}), { threshold: .4 });
so.observe($('.stats'));

/* copy email */
$('#copy').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText('alihaimran676@gmail.com'); } catch (e) {}
  const t = $('#toast'); t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 1800);
});
