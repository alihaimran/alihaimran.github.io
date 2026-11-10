:root{--black:#080808;--dark:#171717;--mid:#777777;--light:#d1d1d1;--white:#fff;
  --bg:#f7f7f7;--surface:#fff;--alt:#efefef;--text:#080808;--muted:#5c5c5c;--border:#d1d1d1;--inv:#080808;--inv-t:#fff;--nav:rgba(247,247,247,.85)}
:root[data-theme="dark"]{--bg:#080808;--surface:#171717;--alt:#0f0f0f;--text:#fff;--muted:#a3a3a3;--border:#2a2a2a;--inv:#fff;--inv-t:#080808;--nav:rgba(8,8,8,.85)}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth;scroll-padding-top:80px}
body{background:var(--bg);color:var(--text);font:400 1rem/1.7 'Manrope',system-ui,sans-serif;overflow-x:hidden;-webkit-font-smoothing:antialiased;transition:background .3s,color .3s}
a{color:inherit;text-decoration:none}
ul,ol{list-style:none}
svg{fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
:focus-visible{outline:2px solid var(--text);outline-offset:3px}
.wrap{max-width:1100px;margin:0 auto;padding:0 24px}
.skip{position:fixed;left:12px;top:-60px;z-index:200;background:var(--inv);color:var(--inv-t);padding:10px 18px;border-radius:8px;font-weight:700;transition:top .2s}
.skip:focus{top:12px}
.toast{position:fixed;bottom:28px;left:50%;transform:translate(-50%,30px);opacity:0;z-index:99;background:var(--inv);color:var(--inv-t);padding:10px 22px;border-radius:30px;font-weight:700;font-size:.9rem;transition:.35s;pointer-events:none}
.toast.show{opacity:1;transform:translate(-50%,0)}

/* buttons */
.btn{display:inline-flex;align-items:center;justify-content:center;padding:13px 26px;border-radius:999px;font:700 .92rem 'Manrope',sans-serif;cursor:pointer;border:1px solid var(--text);transition:transform .25s,background .25s,color .25s}
.btn.solid{background:var(--inv);color:var(--inv-t)}
.btn.line{background:transparent;color:var(--text);border-color:var(--border)}
.btn.line:hover{border-color:var(--text)}
.btn:hover{transform:translateY(-2px)}
.btn.sm{padding:9px 20px;font-size:.85rem}
.btn:disabled{opacity:.5;cursor:wait;transform:none}
.btns{display:flex;flex-wrap:wrap;gap:12px}

/* nav */
.nav{position:fixed;top:0;left:0;right:0;z-index:50;display:flex;align-items:center;justify-content:space-between;padding:14px 5vw;background:var(--nav);backdrop-filter:blur(14px);border-bottom:1px solid var(--border)}
.logo{font-weight:800;letter-spacing:.14em;font-size:.95rem}
.nav nav{display:flex;gap:28px}
.nav nav a{position:relative;font-size:.88rem;font-weight:600;color:var(--muted);padding:4px 0;transition:color .25s}
.nav nav a::after{content:"";position:absolute;left:0;right:0;bottom:-2px;height:2px;background:var(--text);transform:scaleX(0);transform-origin:left;transition:transform .3s}
.nav nav a:hover,.nav nav a.on{color:var(--text)}
.nav nav a:hover::after,.nav nav a.on::after{transform:scaleX(1)}
.nav-r{display:flex;gap:10px}
.icon-btn{width:40px;height:40px;border-radius:50%;border:1px solid var(--border);background:transparent;color:var(--text);cursor:pointer;display:grid;place-items:center;transition:border-color .25s}
.icon-btn:hover{border-color:var(--text)}
.icon-btn svg{width:18px;height:18px}
.burger{display:none;position:relative}
.burger i{position:absolute;left:11px;right:11px;height:2px;background:var(--text);border-radius:2px;transition:.3s}
.burger i:nth-child(1){top:15px}.burger i:nth-child(2){top:23px}
.burger.open i:nth-child(1){top:19px;transform:rotate(45deg)}
.burger.open i:nth-child(2){top:19px;transform:rotate(-45deg)}

/* hero */
.hero{position:relative;min-height:100vh;display:flex;align-items:center;padding:120px 0 80px;overflow:hidden}
#net{position:absolute;inset:0;width:100%;height:100%;opacity:.7}
.hero-in{position:relative;z-index:2}
.tag{display:inline-flex;align-items:center;gap:10px;font-size:.85rem;font-weight:600;color:var(--muted);border:1px solid var(--border);padding:6px 16px;border-radius:999px;background:var(--surface);margin-bottom:28px}
.tag i{width:8px;height:8px;border-radius:50%;background:var(--text);animation:pulse 2s infinite}
@keyframes pulse{50%{opacity:.3}}
.hero h1{font-size:clamp(2.6rem,8vw,6rem);line-height:1.02;font-weight:800;letter-spacing:-.04em;max-width:900px}
.lead{max-width:600px;margin:26px 0 34px;color:var(--muted);font-size:1.1rem}
.social{display:flex;gap:22px;margin-top:36px}
.social a{font-size:.88rem;font-weight:700;border-bottom:1px solid var(--border);padding-bottom:2px;transition:border-color .25s}
.social a:hover{border-color:var(--text)}
.hero-in>*{animation:rise .8s both}
.hero-in>*:nth-child(2){animation-delay:.1s}.hero-in>*:nth-child(3){animation-delay:.2s}.hero-in>*:nth-child(4){animation-delay:.3s}.hero-in>*:nth-child(5){animation-delay:.4s}
@keyframes rise{from{opacity:0;transform:translateY(24px)}}

/* sections */
.sec{padding:110px 0}
.sec.alt{background:var(--alt)}
.sec h2{font-size:clamp(1.9rem,4.5vw,3rem);font-weight:800;letter-spacing:-.03em;line-height:1.1;margin-bottom:44px;max-width:760px}
.body{color:var(--muted);font-size:1.08rem;margin-bottom:16px;max-width:520px}
.split{display:grid;gap:48px}
.stats{display:grid;grid-template-columns:repeat(2,1fr);gap:1px;background:var(--border);border:1px solid var(--border);border-radius:16px;overflow:hidden}
.stats li{background:var(--surface);padding:24px}
.stats b{display:block;font-size:1.7rem;font-weight:800;letter-spacing:-.02em}
.stats span{font-size:.85rem;color:var(--muted)}
.grid{display:grid;gap:16px}
.card{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:28px;transition:transform .3s,border-color .3s}
.card:hover{transform:translateY(-4px);border-color:var(--text)}
.card h3{font-size:1.15rem;font-weight:700;margin-bottom:14px}
.chips{display:flex;flex-wrap:wrap;gap:8px}
.chips span{font-size:.8rem;font-weight:600;padding:5px 14px;border:1px solid var(--border);border-radius:999px;color:var(--muted)}
.svc svg{width:30px;height:30px;margin-bottom:18px}
.svc h3{margin-bottom:8px}
.svc p,.proj p{color:var(--muted);font-size:.95rem}
.proj{display:flex;flex-direction:column;gap:12px;padding:0 0 28px;overflow:hidden}
.proj>*:not(.vis){margin:0 28px}
.proj h3{margin-bottom:0}
.proj .btns{margin-top:auto;padding-top:8px}
.vis{height:170px;display:grid;place-items:center;background:var(--inv);color:var(--inv-t);position:relative;overflow:hidden}
.vis::before{content:"";position:absolute;inset:0;opacity:.18;background-image:radial-gradient(currentColor 1px,transparent 1px);background-size:18px 18px}
.vis span{position:relative;font-size:4.5rem;font-weight:800;letter-spacing:-.05em}

/* timeline */
.timeline{position:relative;padding-left:36px;max-width:760px}
.timeline::before{content:"";position:absolute;left:7px;top:6px;bottom:0;width:1px;background:var(--border)}
.dot{position:absolute;left:0;top:8px;width:15px;height:15px;border-radius:50%;background:var(--inv);border:3px solid var(--bg)}
.timeline h3{font-size:1.35rem;font-weight:700}
.meta{color:var(--muted);font-weight:600;margin-bottom:14px}
.list li{position:relative;padding:4px 0 4px 22px;color:var(--muted)}
.list li::before{content:"";position:absolute;left:0;top:.95em;width:8px;height:1px;background:var(--text)}

/* quotes */
.quote blockquote{font-size:1.3rem;line-height:1.5;font-weight:600;margin-bottom:20px}
.quote figcaption{color:var(--muted);font-size:.9rem;font-weight:600}

/* contact */
.form{display:grid;gap:16px}
.form label{display:grid;gap:6px;font-size:.82rem;font-weight:700}
.form input,.form textarea{width:100%;font:400 .95rem 'Manrope',sans-serif;color:var(--text);background:var(--bg);border:1px solid var(--border);border-radius:10px;padding:12px 14px;transition:border-color .25s}
.form input:focus,.form textarea:focus{outline:none;border-color:var(--text)}
.form .err{border-color:#b3261e}
.form textarea{resize:vertical}
.hp{position:absolute;left:-9999px}
.note{min-height:1.4em;font-size:.88rem;color:var(--muted)}
.links{display:grid;gap:0;align-content:start}
.links li{padding:18px 0;border-bottom:1px solid var(--border);display:grid;gap:2px}
.links span{font-size:.78rem;color:var(--muted);font-weight:700}
.links a{font-weight:700;font-size:1.05rem;width:fit-content;border-bottom:1px solid transparent;transition:border-color .25s}
.links a:hover{border-color:var(--text)}
.links li:last-child{border:0}

/* footer */
.foot{border-top:1px solid var(--border);padding:48px 0 32px;background:var(--surface)}
.foot-in{display:grid;gap:24px}
.foot p{color:var(--muted);font-size:.9rem}
.foot nav{display:flex;flex-wrap:wrap;gap:20px}
.foot nav a{font-size:.9rem;font-weight:600;color:var(--muted);transition:color .25s}
.foot nav a:hover{color:var(--text)}
.top{position:fixed;right:20px;bottom:20px;z-index:60;width:46px;height:46px;border-radius:50%;border:0;background:var(--inv);color:var(--inv-t);cursor:pointer;display:grid;place-items:center;opacity:0;visibility:hidden;transform:translateY(12px);transition:.3s}
.top.show{opacity:1;visibility:visible;transform:none}
.top svg{width:20px;height:20px}

/* reveal */
.js .reveal{opacity:0;transform:translateY(26px);transition:opacity .7s,transform .7s}
.js .reveal.in{opacity:1;transform:none}

/* responsive (mobile first upward) */
@media(min-width:700px){
  .grid.two,.grid.skills{grid-template-columns:repeat(2,1fr)}
  .grid.three{grid-template-columns:repeat(2,1fr)}
  .stats{grid-template-columns:repeat(3,1fr)}
  .foot-in{grid-template-columns:1fr auto auto;align-items:start}
  .copy{grid-column:1/-1}
}
@media(min-width:960px){
  .split{grid-template-columns:1fr 1fr;align-items:start}
  .grid.three{grid-template-columns:repeat(3,1fr)}
  .grid.skills .wide{grid-column:span 2}
  .split.contact{grid-template-columns:1.2fr .8fr}
}
@media(max-width:899px){
  .burger{display:grid}
  .nav nav{display:none}
  .nav.open nav{display:flex;position:absolute;top:100%;left:0;right:0;flex-direction:column;gap:0;padding:8px 5vw 16px;background:var(--bg);border-bottom:1px solid var(--border)}
  .nav.open nav a{padding:14px 0;border-top:1px solid var(--border);font-size:1rem}
  .nav nav a::after{display:none}
  .sec{padding:80px 0}
}
@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important;scroll-behavior:auto!important}.js .reveal{opacity:1;transform:none}}
