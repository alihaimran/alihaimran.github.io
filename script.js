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

/* Typewriter headline — loops forever: line1 -> line2 -> line1 -> ... */
const typeOutput = document.getElementById('typeOutput');
const headlineLines = [
  [{t:"AI"},{t:"that"},{t:"doesn't"},{t:"just"},{t:"predict"},{t:"—"},{t:"it"},{t:"decides.", accent:true}],
  [{t:"I"},{t:"build"},{t:"machines"},{t:"that"},{t:"read,"},{t:"reason,"},{t:"and"},{t:"respond.", accent:true}]
];

function typeLine(tokens, onDone){
  let i = 0;
  function step(){
    if(i >= tokens.length){ onDone(); return; }
    const tok = tokens[i];
    const span = document.createElement('span');
    if(tok.accent) span.className = 'accent-word';
    span.textContent = tok.t + (i < tokens.length - 1 ? ' ' : '');
    typeOutput.appendChild(span);
    i++;
    setTimeout(step, 190);
  }
  step();
}

function eraseAndShow(index){
  typeOutput.style.transition = 'opacity .35s ease';
  typeOutput.style.opacity = '0';
  setTimeout(()=>{
    typeOutput.innerHTML = '';
    typeOutput.style.opacity = '1';
    typeLine(headlineLines[index], ()=>{
      setTimeout(()=> eraseAndShow((index + 1) % headlineLines.length), 1800);
    });
  }, 380);
}

if(typeOutput){
  typeLine(headlineLines[0], ()=>{
    setTimeout(()=> eraseAndShow(1), 1800);
  });
}
