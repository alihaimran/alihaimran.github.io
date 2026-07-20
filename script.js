try{
  const skills = ["Python","TensorFlow","Scikit-learn","RAG","FastAPI","ChromaDB","Groq API","NLP","Computer Vision","Feature Engineering","Streamlit","Deep Learning"];
  const marqueeEl = document.getElementById('marquee');
  if(marqueeEl){
    let marqueeHTML = '';
    for(let i=0;i<3;i++){
      skills.forEach((s,idx)=>{
        marqueeHTML += `<span class="${idx%3===0?'hi':''}">${s} ✦</span>`;
      });
    }
    marqueeEl.innerHTML = marqueeHTML;
  }
}catch(e){ console.error('marquee error', e); }

try{
  const highlights = [
    {title:"Orin — Long-Term Memory Chatbot", desc:"Built a RAG chatbot with a custom memory system that persists user facts across sessions."},
    {title:"Akademus.ai — Shipped to Production", desc:"Took a learning assistant from RAG pipeline design to a live, deployed Streamlit app."},
    {title:"AI/ML Traineeship — Devaspir", desc:"Shipped supervised ML models from prototype through testing to production deployment."}
  ];
  const hlEl = document.getElementById('hlScroll');
  if(hlEl){
    let hlHTML = '';
    for(let i=0;i<2;i++){
      highlights.forEach(h=>{
        hlHTML += `<div class="hl-card"><h4>${h.title}</h4><p>${h.desc}</p></div>`;
      });
    }
    hlEl.innerHTML = hlHTML;
  }
}catch(e){ console.error('highlight scroll error', e); }

try{
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
}catch(e){ console.error('reveal error', e); }

try{
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
}catch(e){ console.error('spotlight error', e); }
