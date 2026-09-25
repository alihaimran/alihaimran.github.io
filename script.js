const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

/* ---------- Page switching with wipe transition ---------- */
const pages = $$('.page'), wipe = $('#wipe');
let current = 0, busy = false;
function go(n) {
  if (busy || n === current) return;
  busy = true;
  wipe.animate([{ transform: 'translateY(100%)' }, { transform: 'translateY(0)' }],
    { duration: 550, easing: 'ease-in-out', fill: 'forwards' }).onfinish = () => {
    pages.forEach((p, i) => p.classList.toggle('active', i === n));
    document.body.dataset.page = n;
    current = n;
    window.scrollTo(0, 0);
    observe();
    wipe.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-100%)' }],
      { duration: 550, easing: 'ease-in-out', fill: 'forwards' }).onfinish = () => busy = false;
  };
}
$('#touch').addEventListener('click', () => go(1));
$('#back').addEventListener('click', () => go(0));
$('#logo').addEventListener('click', () => go(0));

/* ---------- Theme: maroon / beige ---------- */
const themeBtn = $('#themeBtn');
function setTheme(t) {
  document.body.dataset.theme = t;
  themeBtn.textContent = t === 'maroon' ? '◐ Beige' : '◐ Maroon';
  try { localStorage.setItem('theme', t); } catch (e) {}
}
themeBtn.addEventListener('click', () => setTheme(document.body.dataset.theme === 'maroon' ? 'beige' : 'maroon'));
try { setTheme(localStorage.getItem('theme') || 'maroon'); } catch (e) {}

/* ---------- Typing roles ---------- */
const roles = ['intelligent AI/ML systems', 'RAG & LLM applications', 'autonomous AI agents', 'products people can use'];
let ri = 0, ci = 0, del = false;
(function type() {
  const w = roles[ri];
  $('#typed').textContent = w.slice(0, ci);
  if (!del && ci++ === w.length) { del = true; return setTimeout(type, 1500); }
  if (del && --ci === 0) { del = false; ri = (ri + 1) % roles.length; }
  setTimeout(type, del ? 35 : 80);
})();

/* ---------- AI Core: orbiting skills ---------- */
function orbit(el, items) {
  items.forEach((t, i) => {
    const a = (i / items.length) * Math.PI * 2;
    const s = document.createElement('div');
    s.className = 'sat';
    s.style.left = 50 + 50 * Math.cos(a) + '%';
    s.style.top = 50 + 50 * Math.sin(a) + '%';
    s.innerHTML = `<span>${t}</span>`;
    el.appendChild(s);
  });
}
orbit($('#o1'), ['Python', 'LLMs', 'RAG', 'Agentic AI', 'LangChain', 'FastAPI']);
orbit($('#o2'), ['ChromaDB', 'Embeddings', 'Streamlit', 'Groq']);

/* ---------- AI Core: neural network ---------- */
(function buildNet() {
  const svg = $('#net'), layers = [4, 5, 3], xs = [38, 100, 162], NS = 'http://www.w3.org/2000/svg';
  const pos = layers.map((n, l) => Array.from({ length: n }, (_, i) => [xs[l], 100 + (i - (n - 1) / 2) * 30]));
  for (let l = 0; l < pos.length - 1; l++)
    pos[l].forEach(a => pos[l + 1].forEach(b => {
      const ln = document.createElementNS(NS, 'line');
      ln.setAttribute('x1', a[0]); ln.setAttribute('y1', a[1]); ln.setAttribute('x2', b[0]); ln.setAttribute('y2', b[1]);
      ln.style.animationDelay = (Math.random() * -1.2) + 's';
      svg.appendChild(ln);
    }));
  pos.flat().forEach(p => {
    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('cx', p[0]); c.setAttribute('cy', p[1]); c.setAttribute('r', 4);
    c.style.animationDelay = (Math.random() * 2) + 's';
    svg.appendChild(c);
  });
})();

/* ---------- Live agent log ---------- */
const logs = ['Loading vectors…', 'Embedding query…', 'Retrieving top-k…', 'Ranking context…', 'Generating answer…', 'Response ready ✓'];
let li = 0;
setInterval(() => { $('#log').textContent = logs[li = (li + 1) % logs.length]; }, 1700);

/* ---------- Mouse: cursor glow + stage tilt ---------- */
const gc = $('#gc'), stage = $('#stage');
document.addEventListener('mousemove', e => {
  gc.style.left = e.clientX + 'px'; gc.style.top = e.clientY + 'px';
  const x = (e.clientX / innerWidth - .5), y = (e.clientY / innerHeight - .5);
  stage.style.transform = `rotateY(${x * 18}deg) rotateX(${-y * 18}deg)`;
});

/* ---------- Scroll reveal + section animations ---------- */
function countUp(el) {
  const to = +el.dataset.count, t0 = performance.now();
  (function f(t) {
    const p = Math.min((t - t0) / 1600, 1);
    el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(f);
  })(t0);
}
const codeText = `const aliha = {
  role: "AI/ML Engineer",
  focus: ["LLMs", "RAG", "Agentic AI"],
  stack: ["Python", "FastAPI", "LangChain"],
  status: "Open to work",
  openToWork: true
};`;
function highlight(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/("[^"]*")|\b(const|true)\b|\b([a-zA-Z]+)(?=:)/g,
      (m, str, kw, prop) => str ? `<span class="s">${m}</span>` : kw ? `<span class="k">${m}</span>` : `<span class="p">${m}</span>`);
}
let typedCode = false;
function typeCode() {
  if (typedCode) return; typedCode = true;
  let i = 0;
  (function f() { $('#code').innerHTML = highlight(codeText.slice(0, ++i)); if (i < codeText.length) setTimeout(f, 28); })();
}
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting || e.target.classList.contains('show')) return;
  const el = e.target; el.classList.add('show');
  $$('[data-w]', el).forEach(b => b.style.width = b.dataset.w + '%');
  $$('[data-count]', el).forEach(countUp);
  if (el.id === 'about') typeCode();
}), { threshold: .2 });
function observe() { $$('.reveal').forEach(el => io.observe(el)); }
observe();

/* ---------- Skills marquee ---------- */
const tech = ['Python', 'LLMs', 'RAG', 'Agentic AI', 'LangChain', 'FastAPI', 'Flask', 'Streamlit', 'ChromaDB', 'Vector DBs', 'Groq', 'JavaScript'];
$('#track').innerHTML = [...tech, ...tech].map(t => `<span>${t}</span>`).join('');

/* ---------- Project cards: 3D tilt + spotlight ---------- */
$$('.tilt').forEach(c => {
  c.addEventListener('mousemove', e => {
    const r = c.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    c.style.setProperty('--mx', x + 'px'); c.style.setProperty('--my', y + 'px');
    c.style.transform = `perspective(700px) rotateX(${(.5 - y / r.height) * 10}deg) rotateY(${(x / r.width - .5) * 12}deg) translateY(-6px)`;
  });
  c.addEventListener('mouseleave', () => c.style.transform = '');
});

/* ---------- Magnetic buttons ---------- */
$$('.magnetic').forEach(b => {
  b.addEventListener('mousemove', e => {
    const r = b.getBoundingClientRect();
    b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px,${(e.clientY - r.top - r.height / 2) * .35}px)`;
  });
  b.addEventListener('mouseleave', () => b.style.transform = '');
});

/* ---------- Copy email ---------- */
$('#copy').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText('alihaimran676@gmail.com'); } catch (e) {}
  const t = $('#toast'); t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 1800);
});

/* ---------- Scroll progress + dot nav spy ---------- */
const dots = $$('#dots a'), secs = dots.map(a => $(a.getAttribute('href')));
addEventListener('scroll', () => {
  const h = document.documentElement;
  $('#prog').style.width = (scrollY / (h.scrollHeight - innerHeight) * 100) + '%';
  let idx = 0;
  secs.forEach((s, i) => { if (s.getBoundingClientRect().top < innerHeight * .45) idx = i; });
  dots.forEach((d, i) => d.classList.toggle('on', i === idx));
});

/* ---------- Particle network background ---------- */
const cv = $('#bg'), ctx = cv.getContext('2d');
let W, H, pts = [];
function resize() {
  W = cv.width = innerWidth; H = cv.height = innerHeight;
  pts = Array.from({ length: Math.min(80, W / 16) }, () => ({
    x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .5, vy: (Math.random() - .5) * .5
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
      if (d < 130) { ctx.globalAlpha = (1 - d / 130) * .25; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
    }
  });
  requestAnimationFrame(draw);
})();
