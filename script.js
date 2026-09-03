// =========================================================
// NAVBAR: sticky/blur on scroll + active section highlight
// =========================================================
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('main section[id]');

function onScroll() {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  },
  { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
);
sections.forEach((section) => sectionObserver.observe(section));

// =========================================================
// MOBILE MENU
// =========================================================
const navToggle = document.getElementById('navToggle');
const navMobile = document.getElementById('navMobile');

navToggle.addEventListener('click', () => {
  const isOpen = navMobile.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navMobile.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navMobile.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// =========================================================
// SCROLL REVEAL for section content
// =========================================================
const revealTargets = document.querySelectorAll(
  '.section-head, .about-body, .skills-grid, .projects-list, .architecture, .timeline, .services-grid, .engineering-grid, .contact-grid'
);
revealTargets.forEach((el) => el.classList.add('fade-up'));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealTargets.forEach((el) => revealObserver.observe(el));

// =========================================================
// HERO NETWORK VISUAL (procedural node graph)
// =========================================================
(function buildNetwork() {
  const svg = document.getElementById('netSvg');
  if (!svg) return;
  const lineGroup = document.getElementById('netLines');
  const nodeGroup = document.getElementById('netNodes');
  const W = 480, H = 480;
  const nodeCount = 14;
  const nodes = [];

  for (let i = 0; i < nodeCount; i++) {
    const angle = (i / nodeCount) * Math.PI * 2;
    const radius = 90 + Math.random() * 90;
    const x = W / 2 + Math.cos(angle) * radius + (Math.random() - 0.5) * 30;
    const y = H / 2 + Math.sin(angle) * radius + (Math.random() - 0.5) * 30;
    nodes.push({ x, y });
  }
  nodes.push({ x: W / 2, y: H / 2 }); // center hub

  const centerIdx = nodes.length - 1;
  nodes.forEach((n, i) => {
    if (i === centerIdx) return;
    if (Math.random() > 0.4) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', n.x);
      line.setAttribute('y1', n.y);
      line.setAttribute('x2', nodes[centerIdx].x);
      line.setAttribute('y2', nodes[centerIdx].y);
      lineGroup.appendChild(line);
    }
    const next = nodes[(i + 1) % (nodes.length - 1)];
    if (Math.random() > 0.55) {
      const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line2.setAttribute('x1', n.x);
      line2.setAttribute('y1', n.y);
      line2.setAttribute('x2', next.x);
      line2.setAttribute('y2', next.y);
      lineGroup.appendChild(line2);
    }
  });

  nodes.forEach((n, i) => {
    const isCenter = i === centerIdx;
    const r = isCenter ? 7 : 2.5 + Math.random() * 2.5;
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', n.x);
    circle.setAttribute('cy', n.y);
    circle.setAttribute('r', r);
    circle.setAttribute('fill', isCenter ? 'url(#nodeGlow)' : '#00e5cc');
    circle.setAttribute('opacity', isCenter ? '1' : String(0.35 + Math.random() * 0.5));
    if (!isCenter) {
      circle.style.animation = `pulse ${2 + Math.random() * 3}s ease-in-out ${Math.random() * 2}s infinite`;
    }
    nodeGroup.appendChild(circle);
  });
})();

// =========================================================
// PROJECT MODAL
// =========================================================
const projectData = {
  orin: {
    title: 'Orin',
    desc: 'RAG-based AI chatbot with a FastAPI backend, Llama 3.3 70B, ChromaDB vector storage, long-term memory and streaming responses. Built to hold context across sessions and answer with retrieved, grounded information rather than relying on the model alone.',
    tags: ['Python', 'FastAPI', 'RAG', 'ChromaDB', 'LLM', 'SSE'],
    num: '01',
    live: 'https://alihaimran.pythonanywhere.com',
    github: 'https://github.com/devaspir'
  },
  akademus: {
    title: 'Akademus.ai',
    desc: 'AI-powered platform built with Python, combining intelligent AI functionality with a modern user experience.',
    tags: ['Python', 'Generative AI', 'AI', 'Backend'],
    num: '02',
    live: '#',
    github: 'https://github.com/devaspir'
  },
  pdf: {
    title: 'PDF Chatbot',
    desc: 'Document-aware AI chatbot that allows users to ask questions about uploaded PDF documents using retrieval-augmented generation.',
    tags: ['Python', 'RAG', 'PDF Parsing', 'LLM', 'Vector Database'],
    num: '03',
    live: '#',
    github: 'https://github.com/devaspir'
  }
};

const modalBackdrop = document.getElementById('modalBackdrop');
const modalClose = document.getElementById('modalClose');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalTags = document.getElementById('modalTags');
const modalActions = document.getElementById('modalActions');
const modalNum = document.getElementById('modalNum');

function openModal(key) {
  const data = projectData[key];
  if (!data) return;
  modalNum.textContent = data.num;
  modalTitle.textContent = data.title;
  modalDesc.textContent = data.desc;
  modalTags.innerHTML = data.tags.map((t) => `<span>${t}</span>`).join('');
  modalActions.innerHTML = `
    <a href="${data.live}" class="btn btn-sm btn-primary" target="_blank" rel="noopener">Live Demo</a>
    <a href="${data.github}" class="btn btn-sm btn-outline" target="_blank" rel="noopener">GitHub</a>
  `;
  modalBackdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalBackdrop.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-modal-open]').forEach((btn) => {
  btn.addEventListener('click', () => openModal(btn.dataset.modalOpen));
});
modalClose.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', (e) => {
  if (e.target === modalBackdrop) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// =========================================================
// TERMINAL TYPING ANIMATION
// =========================================================
(function typeTerminal() {
  const el = document.getElementById('terminalBody');
  if (!el) return;
  const lines = [
    { text: '$ python ai_system.py', cls: '' },
    { text: 'Initializing AI pipeline...', cls: 'dim' },
    { text: 'Loading embeddings...', cls: 'dim' },
    { text: 'Connecting vector database...', cls: 'dim' },
    { text: 'Starting LLM...', cls: 'dim' },
    { text: 'System ready.', cls: '' }
  ];

  const termObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runTyping();
          termObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  termObserver.observe(el);

  function runTyping() {
    let lineIndex = 0;
    let charIndex = 0;
    el.innerHTML = '';

    function typeChar() {
      if (lineIndex >= lines.length) {
        el.innerHTML += '<span class="terminal-cursor"></span>';
        return;
      }
      const current = lines[lineIndex];
      if (charIndex === 0) {
        el.innerHTML += `<div class="${current.cls}" id="tline${lineIndex}"></div>`;
      }
      const lineEl = document.getElementById(`tline${lineIndex}`);
      lineEl.textContent = current.text.slice(0, charIndex + 1);
      charIndex++;

      if (charIndex < current.text.length) {
        setTimeout(typeChar, 18 + Math.random() * 22);
      } else {
        lineIndex++;
        charIndex = 0;
        setTimeout(typeChar, 220);
      }
    }
    typeChar();
  }
})();

// =========================================================
// CONTACT FORM VALIDATION
// =========================================================
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

function setError(inputId, errId, message) {
  const input = document.getElementById(inputId);
  const err = document.getElementById(errId);
  input.classList.toggle('error', Boolean(message));
  err.textContent = message || '';
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  formNote.textContent = '';
  formNote.classList.remove('success');

  const name = document.getElementById('fName').value.trim();
  const email = document.getElementById('fEmail').value.trim();
  const subject = document.getElementById('fSubject').value.trim();
  const message = document.getElementById('fMessage').value.trim();

  let valid = true;

  if (!name) { setError('fName', 'errName', 'Please enter your name.'); valid = false; }
  else setError('fName', 'errName', '');

  if (!email) { setError('fEmail', 'errEmail', 'Please enter your email.'); valid = false; }
  else if (!isValidEmail(email)) { setError('fEmail', 'errEmail', 'Please enter a valid email.'); valid = false; }
  else setError('fEmail', 'errEmail', '');

  if (!subject) { setError('fSubject', 'errSubject', 'Please add a subject.'); valid = false; }
  else setError('fSubject', 'errSubject', '');

  if (!message) { setError('fMessage', 'errMessage', 'Please write a message.'); valid = false; }
  else if (message.length < 10) { setError('fMessage', 'errMessage', 'Message should be at least 10 characters.'); valid = false; }
  else setError('fMessage', 'errMessage', '');

  if (!valid) return;

  // NOTE: This form is validated on the client only. To actually send
  // messages, connect it to a backend endpoint or a service like
  // Formspree / EmailJS and replace this block with the request call.
  formNote.textContent = "Thanks — your message is ready to send. Connect this form to a backend to deliver it.";
  formNote.classList.add('success');
  contactForm.reset();
});

// =========================================================
// RESUME LINK — graceful fallback if no resume file is linked yet
// =========================================================
const resumeLink = document.getElementById('resumeLink');
resumeLink.addEventListener('click', (e) => {
  if (resumeLink.getAttribute('href') === '#') {
    e.preventDefault();
    formNote?.scrollIntoView;
  }
});
