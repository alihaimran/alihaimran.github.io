const skills = ["Python","TensorFlow","Scikit-learn","RAG","FastAPI","ChromaDB","Groq API","NLP","Computer Vision","Feature Engineering","Streamlit","Deep Learning"];
const marqueeEl = document.getElementById('marquee');
let marqueeHTML = '';
for(let i=0;i<2;i++){
  skills.forEach((s,idx)=>{
    marqueeHTML += `<span class="${idx%3===0?'hi':''}">${s} ✦</span>`;
  });
}
marqueeEl.innerHTML = marqueeHTML;

const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

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

/* Smooth crossfade headline — no typing, just fade out / fade in, loops forever */
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
