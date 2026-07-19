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
