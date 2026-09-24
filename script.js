// Theme (maroon <-> black)
const root = document.documentElement;
if (localStorage.getItem('theme') === 'black') root.setAttribute('data-theme', 'black');

document.getElementById('themeBtn').onclick = () => {
  const black = root.getAttribute('data-theme') === 'black';
  if (black) {
    root.removeAttribute('data-theme');
    localStorage.setItem('theme', 'maroon');
  } else {
    root.setAttribute('data-theme', 'black');
    localStorage.setItem('theme', 'black');
  }
};

// Mobile menu
const nav = document.getElementById('nav');
document.getElementById('menuBtn').onclick = () => nav.classList.toggle('open');
nav.querySelectorAll('a').forEach(a => a.onclick = () => nav.classList.remove('open'));

// Typing effect
const roles = ['AI/ML Engineer', 'GenAI & LLM Systems', 'RAG Developer', 'Agentic AI Builder'];
let r = 0, c = 0, del = false;
const el = document.getElementById('typing');
(function type() {
  const word = roles[r];
  el.textContent = word.substring(0, c);
  if (!del && c < word.length) { c++; setTimeout(type, 90); }
  else if (!del) { del = true; setTimeout(type, 1400); }
  else if (c > 0) { c--; setTimeout(type, 45); }
  else { del = false; r = (r + 1) % roles.length; setTimeout(type, 300); }
})();

// Scroll reveal
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('show'); });
}, { threshold: .15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();
