/* ==========================================================================
   Aliha Imran — AI/ML Portfolio — Interactions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Custom cursor ---------- */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  if (!isTouch && cursorDot && cursorRing) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%,-50%)`;
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%,-50%)`;
      requestAnimationFrame(animateRing);
    }
    animateRing();

    const hoverables = document.querySelectorAll('a, button, .project-card, input, textarea');
    hoverables.forEach((el) => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('active'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('active'));
    });
  }

  /* ---------- Scroll progress bar ---------- */
  const scrollProgress = document.getElementById('scrollProgress');
  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (scrollProgress) scrollProgress.style.width = pct + '%';
  }

  /* ---------- Navbar scroll state ---------- */
  const navbar = document.getElementById('navbar');
  function updateNavbar() {
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }

  window.addEventListener('scroll', () => {
    updateScrollProgress();
    updateNavbar();
  }, { passive: true });
  updateScrollProgress();
  updateNavbar();

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle?.addEventListener('click', () => {
    navbar.classList.toggle('menu-open');
  });
  navLinks?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => navbar.classList.remove('menu-open'));
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal-up');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('.stat-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-count'), 10) || 0;
      const duration = 1400;
      const startTime = performance.now();

      function tick(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach((el) => counterObserver.observe(el));

  /* ---------- Skill progress bars ---------- */
  const skillBars = document.querySelectorAll('.skill-bar-item');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const item = entry.target;
      const level = item.getAttribute('data-level');
      const fill = item.querySelector('.skill-bar-fill');
      requestAnimationFrame(() => { fill.style.width = level + '%'; });
      skillObserver.unobserve(item);
    });
  }, { threshold: 0.4 });
  skillBars.forEach((el) => skillObserver.observe(el));

  /* ---------- Circular skill rings ---------- */
  const ringFills = document.querySelectorAll('.ring-fill');
  const circumference = 2 * Math.PI * 52; // r=52
  ringFills.forEach((ring) => {
    ring.style.strokeDasharray = `${circumference}`;
    ring.style.strokeDashoffset = `${circumference}`;
  });
  const ringObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const ring = entry.target;
      const pct = parseFloat(ring.getAttribute('data-pct')) || 0;
      const offset = circumference - (pct / 100) * circumference;
      requestAnimationFrame(() => { ring.style.strokeDashoffset = offset; });
      ringObserver.unobserve(ring);
    });
  }, { threshold: 0.5 });
  ringFills.forEach((el) => ringObserver.observe(el));

  /* ---------- Magnetic buttons ---------- */
  if (!isTouch) {
    document.querySelectorAll('.magnetic').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.4}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0,0)';
      });
    });
  }

  /* ---------- Typed terminal effect ---------- */
  const terminalEl = document.getElementById('typedTerminal');
  const terminalPhrases = [
    'generate_response(prompt)',
    'retrieve(context, k=5)',
    'agent.plan_and_execute()',
    'embed(document).store()'
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let typingForward = true;

  function typeLoop() {
    if (!terminalEl) return;
    const current = terminalPhrases[phraseIndex];

    if (typingForward) {
      charIndex++;
      terminalEl.textContent = current.slice(0, charIndex);
      if (charIndex >= current.length) {
        typingForward = false;
        setTimeout(typeLoop, 1400);
        return;
      }
    } else {
      charIndex--;
      terminalEl.textContent = current.slice(0, charIndex);
      if (charIndex <= 0) {
        typingForward = true;
        phraseIndex = (phraseIndex + 1) % terminalPhrases.length;
      }
    }
    setTimeout(typeLoop, typingForward ? 60 : 28);
  }
  typeLoop();

  /* ---------- Tech stack marquee (duplicate content for seamless loop) ---------- */
  const stackTrack = document.getElementById('stackTrack');
  const stackItems = [
    'Python', 'Machine Learning', 'Deep Learning', 'Generative AI',
    'LLMs', 'RAG', 'Agentic AI', 'LangChain', 'Vector Databases',
    'Prompt Engineering', 'FastAPI', 'Streamlit'
  ];
  if (stackTrack) {
    const buildSet = () => stackItems.map((item) => `<span>${item}</span>`).join('');
    stackTrack.innerHTML = buildSet() + buildSet();
  }

  /* ---------- Neural network canvas background ---------- */
  const canvas = document.getElementById('neuralCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height, nodes;
    const NODE_COUNT = 46;
    const MAX_DIST = 150;

    function resizeCanvas() {
      const hero = document.querySelector('.hero');
      width = canvas.width = hero.offsetWidth;
      height = canvas.height = hero.offsetHeight;
    }

    function initNodes() {
      nodes = Array.from({ length: NODE_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 1
      }));
    }

    function drawFrame() {
      ctx.clearRect(0, 0, width, height);

      // update
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
      });

      // connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const opacity = (1 - dist / MAX_DIST) * 0.18;
            ctx.strokeStyle = `rgba(108, 92, 246, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // nodes
      nodes.forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(79, 107, 246, 0.45)';
        ctx.fill();
      });

      requestAnimationFrame(drawFrame);
    }

    resizeCanvas();
    initNodes();
    drawFrame();

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resizeCanvas();
        initNodes();
      }, 200);
    });
  }

  /* ---------- Contact form (front-end only, no backend wired) ---------- */
  const contactForm = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  const submitLabel = document.getElementById('submitLabel');

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    submitLabel.textContent = 'Sending...';
    setTimeout(() => {
      submitLabel.textContent = 'Send Message';
      formNote.textContent = "Thanks! This form is a front-end demo — connect it to your email service to go live.";
      contactForm.reset();
    }, 900);
  });

  /* ---------- Back to top ---------- */
  const backToTop = document.getElementById('backToTop');
  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Resume button placeholder ---------- */
  const resumeBtn = document.getElementById('resumeBtn');
  resumeBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    formNote && (formNote.textContent = '');
    alert('Add your resume PDF link here — this button is ready to wire up.');
  });

});
