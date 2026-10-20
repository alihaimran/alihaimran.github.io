const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

/* ---------- Theme: dark / light (black & white) ---------- */
const themeBtn = $('#themeBtn');
function setTheme(t) {
  document.body.dataset.theme = t;
  themeBtn.textContent = t === 'dark' ? '○ Light' : '● Dark';
  try { localStorage.setItem('theme', t); } catch (e) {}
}
themeBtn.addEventListener('click', () => setTheme(document.body.dataset.theme === 'dark' ? 'light' : 'dark'));
try { setTheme(localStorage.getItem('theme') || 'dark'); } catch (e) {}

/* ---------- Mobile menu ---------- */
const burger = $('#burger'), menu = $('#menu');
burger.addEventListener('click', () => { burger.classList.toggle('open'); menu.classList.toggle('open'); });
$$('#menu a').forEach(a => a.addEventListener('click', () => { burger.classList.remove('open'); menu.classList.remove('open'); }));

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

/* ---------- 3D hero: rotating wireframe + point sphere ---------- */
(function hero3D() {
  const cv = $('#gl'), ctx = cv.getContext('2d');
  let W, H, R, dpr;
  function size() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    const r = cv.getBoundingClientRect();
    W = r.width; H = r.height;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    R = Math.min(W, H) * 0.28;
  }
  size(); addEventListener('resize', size);

  const phi = (1 + Math.sqrt(5)) / 2;
  const ico = [];
  [-1, 1].forEach(a => [-phi, phi].forEach(b => {
    ico.push([a, b, 0], [0, a, b], [b, 0, a]);
  }));
  const edges = [];
  for (let i = 0; i < ico.length; i++)
    for (let j = i + 1; j < ico.length; j++) {
      const d = Math.hypot(ico[i][0] - ico[j][0], ico[i][1] - ico[j][1], ico[i][2] - ico[j][2]);
      if (Math.abs(d - 2) < 0.01) edges.push([i, j]);
    }
  const norm = Math.hypot(1, phi);
  const icoN = ico.map(v => v.map(c => c / norm));

  const sphere = [];
  const N = 160;
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2, rad = Math.sqrt(1 - y * y), th = i * 2.399963;
    sphere.push([Math.cos(th) * rad, y, Math.sin(th) * rad]);
  }

  let ax = 0.4, ay = 0, tx = 0, ty = 0, mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    mx = (e.clientX / innerWidth - .5); my = (e.clientY / innerHeight - .5);
  });

  function rot(v, a, b) {
    let [x, y, z] = v;
    let c = Math.cos(b), s = Math.sin(b);
    [x, z] = [x * c + z * s, -x * s + z * c];
    c = Math.cos(a); s = Math.sin(a);
    [y, z] = [y * c - z * s, y * s + z * c];
    return [x, y, z];
  }
  function proj(p, scale) {
    const d = 4, k = d / (d + p[2]);
    return [W / 2 + p[0] * scale * k, H / 2 + p[1] * scale * k, k];
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);
    const fg = getComputedStyle(document.body).getPropertyValue('--fg').trim() || '#fff';
    ctx.strokeStyle = fg; ctx.fillStyle = fg;
    tx += (my * 1.2 - tx) * 0.05; ty += (mx * 1.6 - ty) * 0.05;
    ay += 0.006; ax += 0.003;

    // outer point sphere
    sphere.forEach(v => {
      const p = rot(v, ax * 0.5 + ty * 0.5, -ay * 0.6 + tx * 0.5);
      const [x, y, k] = proj(p, R * 1.75);
      ctx.globalAlpha = Math.max(0.08, (p[2] + 1) / 2) * 0.7;
      ctx.beginPath(); ctx.arc(x, y, 1.4 * k, 0, 7); ctx.fill();
    });

    // two icosahedrons, counter-rotating
    [[1.0, 1, 0.75], [0.52, -1.6, 0.4]].forEach(([sc, dir, alpha]) => {
      const pts = icoN.map(v => proj(rot(v, ax * dir + ty, ay * dir + tx), R * 1.5 * sc));
      ctx.lineWidth = 1;
      edges.forEach(([i, j]) => {
        ctx.globalAlpha = alpha * 0.55;
        ctx.beginPath(); ctx.moveTo(pts[i][0], pts[i][1]); ctx.lineTo(pts[j][0], pts[j][1]); ctx.stroke();
      });
      pts.forEach(p => {
        ctx.globalAlpha = alpha;
        ctx.beginPath(); ctx.arc(p[0], p[1], 3 * p[2] * sc + 1, 0, 7); ctx.fill();
      });
    });

    // core
    ctx.globalAlpha = 1;
    ctx.beginPath(); ctx.arc(W / 2, H / 2, 5 + Math.sin(performance.now() / 500) * 1.5, 0, 7); ctx.fill();
    requestAnimationFrame(frame);
  }
  frame();
})();

/* ---------- Count-up, code typing, terminal ---------- */
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
      (m, str, kw) => str ? `<span class="s">${m}</span>` : kw ? `<span class="k">${m}</span>` : `<span class="p">${m}</span>`);
}
let typedCode = false;
function typeCode() {
  if (typedCode) return; typedCode = true;
  let i = 0;
  (function f() { $('#code').innerHTML = highlight(codeText.slice(0, ++i)); if (i < codeText.length) setTimeout(f, 28); })();
}
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
  (function addLine() {
    const l = termLines[i % termLines.length];
    const row = document.createElement('div');
    row.className = 'term-row';
    row.innerHTML = `<b>${l.p}</b><span>${l.t}</span>`;
    body.appendChild(row);
    while (body.children.length > 7) body.removeChild(body.firstChild);
    i++;
    setTimeout(addLine, 1300);
  })();
}

/* ---------- Scroll reveal ---------- */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting || e.target.classList.contains('show')) return;
  const el = e.target; el.classList.add('show');
  $$('[data-count]', el).forEach(countUp);
  if (el.id === 'about') typeCode();
  if (el.id === 'lab') buildTerminal();
}), { threshold: .15 });
$$('.reveal').forEach(el => io.observe(el));

/* ---------- 3D tilt cards ---------- */
$$('.tilt').forEach(c => {
  c.addEventListener('mousemove', e => {
    const r = c.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    c.style.setProperty('--mx', x + 'px'); c.style.setProperty('--my', y + 'px');
    c.style.transform = `rotateX(${(.5 - y / r.height) * 14}deg) rotateY(${(x / r.width - .5) * 16}deg) translateY(-8px)`;
  });
  c.addEventListener('mouseleave', () => c.style.transform = '');
});

/* ---------- Copy email ---------- */
$('#copy').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText('alihaimran676@gmail.com'); } catch (e) {}
  const t = $('#toast'); t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 1800);
});

/* ---------- Progress bar + active nav link ---------- */
const navLinks = $$('#menu a'), secs = navLinks.map(a => $(a.getAttribute('href')));
addEventListener('scroll', () => {
  const h = document.documentElement;
  $('#prog').style.width = (scrollY / (h.scrollHeight - innerHeight) * 100) + '%';
  let idx = -1;
  secs.forEach((s, i) => { if (s && s.getBoundingClientRect().top < innerHeight * .4) idx = i; });
  navLinks.forEach((a, i) => a.classList.toggle('on', i === idx));
});
