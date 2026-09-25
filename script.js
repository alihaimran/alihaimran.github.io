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
$$('.go-page2').forEach(b => b.addEventListener('click', () => go(1)));
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

/* ---------- AI core: orbit satellites + connecting lines ---------- */
(function buildCore() {
  const layer = $('#satLayer'), svg = $('#coreLines');
  if (!layer || !svg) return;
  const NS = 'http://www.w3.org/2000/svg';
  const sats = ['Python', 'LLMs', 'RAG', 'Agentic AI', 'LangChain', 'FastAPI', 'ChromaDB', 'Vision'];
  sats.forEach((t, i) => {
    const a = (i / sats.length) * Math.PI * 2 - Math.PI / 2;
    const r = 43;
    const x = 50 + r * Math.cos(a), y = 50 + r * Math.sin(a);
    const line = document.createElementNS(NS, 'line');
    line.setAttribute('x1', 50); line.setAttribute('y1', 50);
    line.setAttribute('x2', x); line.setAttribute('y2', y);
    line.setAttribute('class', 'core-line');
    line.style.animationDelay = (-Math.random() * 2) + 's';
    svg.appendChild(line);
    const tag = document.createElement('span');
    tag.className = 'sat-tag';
    tag.style.left = x + '%'; tag.style.top = y + '%';
    tag.style.animationDelay = (-Math.random() * 5) + 's';
    tag.textContent = t;
    layer.appendChild(tag);
  });
})();

/* ---------- Core field: subtle parallax tilt ---------- */
const coreField = $('#coreField');
document.addEventListener('mousemove', e => {
  if (!coreField) return;
  const x = (e.clientX / innerWidth - .5), y = (e.clientY / innerHeight - .5);
  coreField.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
});

/* ---------- HUD coordinate ticker (decorative telemetry) ---------- */
(function ticker() {
  const el = $('#hudCoords');
  if (!el) return;
  const baseLat = 31.5204, baseLng = 74.3587;
  setInterval(() => {
    const lat = (baseLat + (Math.random() - .5) * 0.002).toFixed(4);
    const lng = (baseLng + (Math.random() - .5) * 0.002).toFixed(4);
    el.textContent = `${lat}° N · ${lng}° E`;
  }, 2200);
})();

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

/* ---------- Skills: floating bubble field ---------- */
let bubblesBuilt = false;
function buildBubbles() {
  if (bubblesBuilt) return; bubblesBuilt = true;
  $$('.bf-zone').forEach(zone => {
    const items = zone.dataset.items.split(',');
    items.forEach((t, i) => {
      const b = document.createElement('span');
      b.className = 'bubble';
      b.textContent = t;
      const size = 0.82 + Math.random() * 0.5;
      b.style.setProperty('--sz', size.toFixed(2));
      b.style.left = (8 + Math.random() * 64) + '%';
      b.style.top = (i * (100 / items.length) + Math.random() * 8) + '%';
      b.style.animationDuration = (4 + Math.random() * 3).toFixed(1) + 's';
      b.style.animationDelay = (-Math.random() * 4).toFixed(1) + 's';
      zone.appendChild(b);
    });
  });
}

/* ---------- AI Lab: animated terminal log ---------- */
const termLines = [
  { p: '&gt; query', t: '"summarize the latest RAG paper"' },
  { p: 'embed', t: 'encoding query → 1536-dim vector' },
  { p: 'retrieve', t: 'top-k=5 chunks from ChromaDB ✓' },
  { p: 'rank', t: 'reranking context by relevance' },
  { p: 'agent', t: 'planning next tool call…' },
  { p: 'llm', t: 'generating grounded response' },
  { p: 'done', t: 'response streamed ✓ (412ms)' },
];
let termBuilt = false;
function buildTerminal() {
  if (termBuilt) return; termBuilt = true;
  const body = $('#termBody');
  let i = 0;
  function addLine() {
    const l = termLines[i % termLines.length];
    const row = document.createElement('div');
    row.className = 'term-row';
    row.innerHTML = `<b>${l.p}</b><span>${l.t}</span>`;
    body.appendChild(row);
    while (body.children.length > 7) body.removeChild(body.firstChild);
    body.scrollTop = body.scrollHeight;
    i++;
    setTimeout(addLine, 1300);
  }
  addLine();
}

const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting || e.target.classList.contains('show')) return;
  const el = e.target; el.classList.add('show');
  $$('[data-count]', el).forEach(countUp);
  if (el.id === 'about') typeCode();
  if (el.id === 'skills') buildBubbles();
  if (el.id === 'lab') buildTerminal();
}), { threshold: .2 });
function observe() { $$('.reveal').forEach(el => io.observe(el)); }
observe();

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
  secs.forEach((s, i) => { if (s && s.getBoundingClientRect().top < innerHeight * .45) idx = i; });
  dots.forEach((d, i) => d.classList.toggle('on', i === idx));
});

/* ---------- Cursor glow ---------- */
const gc = $('#gc');
document.addEventListener('mousemove', e => { gc.style.left = e.clientX + 'px'; gc.style.top = e.clientY + 'px'; });

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
