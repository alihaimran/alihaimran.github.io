const skills = ["Python","TensorFlow","Scikit-learn","RAG","FastAPI","ChromaDB","Groq API","NLP","Computer Vision","Feature Engineering","Streamlit","Deep Learning"];
const marqueeEl = document.getElementById('marquee');
let marqueeHTML = '';
for(let i=0;i<2;i++){
  skills.forEach((s,idx)=>{
    marqueeHTML += `<span class="${idx%3===0?'hi':''}">${s} ✦</span>`;
  });
}
marqueeEl.innerHTML = marqueeHTML;

/* Distinct reveal-on-scroll: up / left / scale */
const revealSelectors = ['.reveal-up', '.reveal-left', '.reveal-scale'];
revealSelectors.forEach(sel=>{
  const els = document.querySelectorAll(sel);
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  els.forEach(el => obs.observe(el));
});

/* Cap-strip staggered polaroid entrance */
const capCards = document.querySelectorAll('.reveal-cap');
const capIo = new IntersectionObserver((entries)=>{
  entries.forEach((e)=>{
    if(e.isIntersecting){
      const idx = Array.from(capCards).indexOf(e.target);
      setTimeout(()=> e.target.classList.add('visible'), idx * 140);
      capIo.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });
capCards.forEach(el => capIo.observe(el));

/* Skill bars fill on scroll into view */
const skillFills = document.querySelectorAll('.skill-fill');
const skillIo = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      setTimeout(()=> e.target.classList.add('filled'), 150);
      skillIo.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });
skillFills.forEach(el => skillIo.observe(el));

/* Cursor-following spotlight (desktop only) */
const spotlight = document.getElementById('spotlight');
if(spotlight && window.matchMedia('(pointer:fine)').matches){
  let raf = null;
  document.addEventListener('mousemove', (e)=>{
    if(raf) return;
    raf = requestAnimationFrame(()=>{
      document.documentElement.style.setProperty('--mx', e.clientX + 'px');
      document.documentElement.style.setProperty('--my', e.clientY + 'px');
      raf = null;
    });
  });
}

/* Smooth crossfade headline — loops forever */
const typeOutput = document.getElementById('typeOutput');
const headlineLines = [
  `AI that doesn't just predict —<br>it <span class="accent-word">decides.</span>`,
  `I build machines that<br>read, reason, and <span class="accent-word">respond.</span>`
];

function showLine(index){
  typeOutput.style.opacity = '0';
  typeOutput.style.transform = 'translateY(8px)';
  setTimeout(()=>{
    typeOutput.innerHTML = headlineLines[index];
    typeOutput.style.opacity = '1';
    typeOutput.style.transform = 'translateY(0)';
    setTimeout(()=> showLine((index + 1) % headlineLines.length), 2600);
  }, 500);
}

if(typeOutput){
  typeOutput.style.opacity = '0';
  typeOutput.innerHTML = headlineLines[0];
  requestAnimationFrame(()=>{ typeOutput.style.opacity = '1'; });
  setTimeout(()=> showLine(1), 2600);
}
