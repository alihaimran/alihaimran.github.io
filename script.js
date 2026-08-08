document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Navbar scroll state + progress ---------- */
  const navbar = document.getElementById('navbar');
  const navProgress = document.getElementById('navProgress');
  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    navProgress.style.width = progress + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
  }));

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll('main section[id], header#hero');
  const navItems = document.querySelectorAll('.nav-link');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach(link => link.classList.toggle('active', link.dataset.section === id));
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px' });
  sections.forEach(s => sectionObserver.observe(s));

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- Cursor glow ---------- */
  const cursorGlow = document.getElementById('cursorGlow');
  if (!prefersReducedMotion && window.matchMedia('(hover:hover)').matches) {
    let mx = window.innerWidth / 2, my = window.innerHeight / 2, cx = mx, cy = my;
    window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    function animateGlow() {
      cx += (mx - cx) * 0.15;
      cy += (my - cy) * 0.15;
      cursorGlow.style.transform = `translate(${cx}px, ${cy}px)`;
      requestAnimationFrame(animateGlow);
    }
    animateGlow();
  } else {
    cursorGlow.style.display = 'none';
  }

  /* ---------- Magnetic buttons ---------- */
  if (!prefersReducedMotion) {
    document.querySelectorAll('.magnetic').forEach(el => {
      el.addEventListener('mousemove', e => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = 'translate(0,0)'; });
    });
  }

  /* ---------- Project card tilt ---------- */
  if (!prefersReducedMotion) {
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(900px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(900px) rotateY(0) rotateX(0) translateY(0)';
      });
    });
  }

  /* ---------- Skill bars fill on view ---------- */
  const skillBars = document.querySelectorAll('.skill-bar');
  const skillObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelector('.skill-fill').style.width = entry.target.dataset.value + '%';
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  skillBars.forEach(bar => skillObserver.observe(bar));

  /* ---------- Stat counters ---------- */
  const statNums = document.querySelectorAll('.stat-num');
  const statObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 1200;
        const start = performance.now();
        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target) + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  statNums.forEach(el => statObserver.observe(el));

  /* ---------- Testimonial slider ---------- */
  const testiWrap = document.getElementById('testiWrap');
  const testiTrack = document.getElementById('testiTrack');
  const testiSlides = testiTrack ? testiTrack.querySelectorAll('.testi-slide') : [];
  const testiPrev = document.getElementById('testiPrev');
  const testiNext = document.getElementById('testiNext');
  const testiDotsWrap = document.getElementById('testiDots');
  let testiIndex = 0;
  let testiTimer = null;

  if (testiTrack && testiSlides.length) {
    testiSlides.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goToTesti(i));
      testiDotsWrap.appendChild(dot);
    });
    const dots = testiDotsWrap.querySelectorAll('.testi-dot');

    function goToTesti(i) {
      testiIndex = (i + testiSlides.length) % testiSlides.length;
      testiTrack.style.transform = `translateX(-${testiIndex * 100}%)`;
      dots.forEach((d, idx) => d.classList.toggle('active', idx === testiIndex));
    }
    function nextTesti() { goToTesti(testiIndex + 1); }
    function prevTesti() { goToTesti(testiIndex - 1); }

    testiNext.addEventListener('click', () => { nextTesti(); restartAutoplay(); });
    testiPrev.addEventListener('click', () => { prevTesti(); restartAutoplay(); });

    function startAutoplay() {
      if (prefersReducedMotion || testiSlides.length < 2) return;
      testiTimer = setInterval(nextTesti, 6000);
    }
    function restartAutoplay() {
      clearInterval(testiTimer);
      startAutoplay();
    }
    testiWrap.addEventListener('mouseenter', () => clearInterval(testiTimer));
    testiWrap.addEventListener('mouseleave', startAutoplay);
    startAutoplay();
  }

  /* ---------- Contact form (mailto fallback) ---------- */
  const form = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const name = data.get('name');
    const email = data.get('email');
    const subject = data.get('subject');
    const message = data.get('message');
    const body = `From: ${name} (${email})%0D%0A%0D%0A${encodeURIComponent(message)}`;
    window.location.href = `mailto:alihaimran676@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
    formNote.textContent = 'Opening your email client…';
    form.reset();
  });

  /* ---------- Hero neural canvas ---------- */
  function buildNodeCanvas(canvas, options) {
    const ctx = canvas.getContext('2d');
    let w, h, nodes = [];
    const count = options.count;
    const linkDist = options.linkDist;
    const color = options.color;
    let pointer = { x: null, y: null };

    function resize() { w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight; }
    function init() {
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
      }));
    }
    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < linkDist) {
            ctx.strokeStyle = `rgba(${color},${(1 - dist / linkDist) * 0.32})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        if (pointer.x !== null) {
          const dx = n.x - pointer.x, dy = n.y - pointer.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 170) {
            ctx.strokeStyle = `rgba(34,211,238,${(1 - dist / 170) * 0.45})`;
            ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(pointer.x, pointer.y); ctx.stroke();
          }
        }
        ctx.fillStyle = 'rgba(238,241,246,0.5)';
        ctx.beginPath(); ctx.arc(n.x, n.y, 1.5, 0, Math.PI * 2); ctx.fill();
      }
      if (!prefersReducedMotion) requestAnimationFrame(draw);
    }
    canvas.parentElement.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left; pointer.y = e.clientY - rect.top;
    });
    canvas.parentElement.addEventListener('mouseleave', () => { pointer.x = null; pointer.y = null; });
    window.addEventListener('resize', () => { resize(); init(); });
    resize(); init(); draw();
  }

  const heroCanvas = document.getElementById('heroCanvas');
  buildNodeCanvas(heroCanvas, { count: window.innerWidth < 720 ? 28 : 55, linkDist: 140, color: '124,92,252' });

  const contactCanvas = document.getElementById('contactCanvas');
  buildNodeCanvas(contactCanvas, { count: window.innerWidth < 720 ? 16 : 30, linkDist: 130, color: '124,92,252' });
});
