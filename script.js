const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

/* ---------- Page switching ---------- */
const pages = $$('.page'), tabs = $$('.tab');
function show(n) {
  pages.forEach((p, i) => p.classList.toggle('active', i === n));
  tabs.forEach((t, i) => t.classList.toggle('active', i === n));
  window.scrollTo(0, 0);
  setTimeout(observe, 100);
}
tabs.forEach(t => t.addEventListener('click', () => show(+t.dataset.page)));
$$('[data-go]').forEach(b => b.addEventListener('click', () => show(+b.dataset.go)));

/* ---------- Theme (rose / black) ---------- */
const themeBtn = $('#themeBtn');
function setTheme(t) {
  document.body.dataset.theme = t;
  themeBtn.textContent = t === 'rose' ? '◐ Black' : '◐ Rose';
  try { localStorage.setItem('theme', t); } catch (e) {}
}
themeBtn.addEventListener('click', () =>
  setTheme(document.body.dataset.theme === 'rose' ? 'black' : 'rose'));
try { setTheme(localStorage.getItem('theme') || 'rose'); } catch (e) {}

/* ---------- Typing effect ---------- */
const roles = ['AI/ML Engineer', 'Generative AI Engineer', 'RAG & LLM Developer', 'Agentic AI Builder'];
let ri = 0, ci = 0, del = false;
(function type() {
  const w = roles[ri];
  $('#typed').textContent = w.slice(0, ci);
  if (!del && ci++ === w.length) { del = true; return setTimeout(type, 1400); }
  if (del && --ci === 0) { del = false; ri = (ri + 1) % roles.length; }
  setTimeout(type, del ? 40 : 90);
})();

/* ---------- Robot eyes follow the mouse ---------- */
document.addEventListener('mousemove', e => {
  $$('.eye').forEach(eye => {
    const r = eye.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    const a = Math.atan2(dy, dx), d = Math.min(9, Math.hypot(dx, dy) / 30);
    $('i', eye).style.transform = `translate(${Math.cos(a) * d}px,${Math.sin(a) * d}px)`;
  });
});

/* ---------- Scroll reveal ---------- */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) e.target.classList.add('show');
}), { threshold: .15 });
function observe() { $$('.reveal').forEach(el => io.observe(el)); }
observe();

/* ---------- Particle background ---------- */
const cv = $('#bg'), ctx = cv.getContext('2d');
let W, H, pts = [];
function resize() {
  W = cv.width = innerWidth; H = cv.height = innerHeight;
  pts = Array.from({ length: Math.min(70, W / 18) }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    vx: (Math.random() - .5) * .5, vy: (Math.random() - .5) * .5
  }));
}
addEventListener('resize', resize); resize();
(function draw() {
  ctx.clearRect(0, 0, W, H);
  const col = getComputedStyle(document.body).getPropertyValue('--acc').trim();
  ctx.fillStyle = col; ctx.strokeStyle = col;
  pts.forEach((p, i) => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > W) p.vx *= -1;
    if (p.y < 0 || p.y > H) p.vy *= -1;
    ctx.globalAlpha = .6; ctx.beginPath(); ctx.arc(p.x, p.y, 1.8, 0, 7); ctx.fill();
    for (let j = i + 1; j < pts.length; j++) {
      const q = pts[j], d = Math.hypot(p.x - q.x, p.y - q.y);
      if (d < 130) {
        ctx.globalAlpha = (1 - d / 130) * .25;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
      }
    }
  });
  requestAnimationFrame(draw);
})();
