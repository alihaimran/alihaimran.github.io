// ================================
// Smooth Active Navbar
// ================================

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("nav ul li a");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const sectionTop = section.offsetTop - 120;

        if (pageYOffset >= sectionTop) {
            current = section.getAttribute("id");
        }

    });

    navLinks.forEach(link => {

        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + current) {
            link.classList.add("active");
        }

    });

});

// ================================
// Reveal Animation
// ================================

const observer = new IntersectionObserver((entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("show");

}

});

});

document.querySelectorAll(".section,.card").forEach(el=>{

el.classList.add("hidden");

observer.observe(el);

});

// ================================
// Typing Effect
// ================================

const text = [
"Python Backend Developer",
"AI / ML Engineer",
"Generative AI Engineer"
];

let count = 0;
let index = 0;
let currentText = "";
let letter = "";

(function type(){

if(count===text.length){

count=0;

}

currentText=text[count];

letter=currentText.slice(0,++index);

document.querySelector(".hero-left h2").textContent=letter;

if(letter.length===currentText.length){

count++;

index=0;

setTimeout(type,1500);

}

else{

setTimeout(type,80);

}

})();
