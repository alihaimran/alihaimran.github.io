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

const heroStack = document.getElementById('heroStack');
if(heroStack && window.matchMedia('(min-width: 901px)').matches){
  const cards = heroStack.querySelectorAll('.float-card');
  heroStack.addEventListener('mousemove', (e)=>{
    const rect = heroStack.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    cards.forEach((card, i)=>{
      const depth = (i + 1) * 4;
      card.style.transform = `translate(${px * depth}px, ${py * depth}px)`;
    });
  });
  heroStack.addEventListener('mouseleave', ()=>{
    cards.forEach(card => card.style.transform = '');
  });
}
