/* Generates /courses/<slug>/index.html for every course in index.html's `var C=[...]`
   and sitemap.xml.   Run from the repo root:  node tools/build-courses.mjs  */
import fs from 'fs';
const s=fs.readFileSync('index.html','utf8');
const a=s.indexOf('var C=[')+6,e=s.indexOf('];',s.indexOf('Placement-ready professional profile'))+1;
const C=new Function('return '+s.slice(a,e))();
const slug=n=>n.toLowerCase().replace(/&/g,'and').replace(/\+/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const css=s.slice(s.indexOf('<style>')+7,s.indexOf('</style>'));
const gtm=s.slice(s.indexOf('<!-- Google tag'),s.indexOf('<meta charset'));
const trk=s.slice(s.indexOf('/* NISHLAB lead tracking'),s.lastIndexOf('</script>'));
const esc=t=>String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
const inr=v=>v?'₹'+v.toLocaleString('en-IN'):'Ask on demo';
const extra=`
.crumb{margin:28px 0 22px}.crumb a{color:var(--steel);text-decoration:none}.crumb a:hover{color:var(--text)}
.cad.one{grid-template-columns:1fr}
.cp-hero{padding:8px 0 28px}
.cp-hero h1{font-family:var(--display);font-size:clamp(2.2rem,6vw,4rem);font-weight:800;letter-spacing:-.035em;line-height:1;margin:10px 0 0;text-wrap:balance}
.cp-sec{margin-top:64px}
.cp-sec .head{margin-bottom:24px}
.pgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:20px}
.pcard{border:1px solid var(--line);border-radius:14px;background:var(--panel);overflow:hidden;display:flex;flex-direction:column}
.pcard h3{padding:18px 20px 0}
.pcard p{margin:8px 0 0;padding:0 20px;color:var(--muted);font-size:.94rem}
.ptags{display:flex;flex-wrap:wrap;gap:6px;padding:12px 20px 18px;margin-top:auto}
.ptags span{font-family:var(--mono);font-size:.7rem;letter-spacing:.06em;text-transform:uppercase;color:var(--steel);border:1px solid var(--line);border-radius:999px;padding:3px 9px}
.pv-stage{position:relative;aspect-ratio:4/3;background:radial-gradient(ellipse at 50% 40%,#1c2630,#0e1114 75%);border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:center}
.pv-stage canvas{position:absolute;inset:0;width:100%;height:100%;display:block;cursor:grab;touch-action:pan-y}
.pv-stage canvas:active{cursor:grabbing}
.pv-stage.on canvas{touch-action:none}
.pv-intro{text-align:center;padding:16px}
.pv-intro .btn{padding:10px 18px;font-size:.95rem}
.pv-msg{display:block;margin-top:10px;color:var(--muted);font-size:.85rem;min-height:1.2em}
.pv-bar{position:absolute;right:10px;bottom:10px;display:flex;gap:6px}
.pv-bar button{background:rgba(14,17,20,.8);border:1px solid var(--line);color:var(--text);border-radius:8px;min-width:34px;height:34px;padding:0 10px;cursor:pointer;font:inherit;font-size:.82rem}
.pv-bar button:hover,.pv-bar button[aria-pressed=true]{border-color:var(--hot);color:var(--hot)}
.pv-hint{position:absolute;left:12px;bottom:12px;font-family:var(--mono);font-size:.68rem;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);pointer-events:none}
.pslot .pv-stage{border-bottom:1px dashed var(--line)}
.pslot{border-style:dashed;opacity:.85}
.pslot .pv-intro b{display:block;font-family:var(--display);font-size:1.1rem;color:var(--steel)}
.pslot .pv-intro span{color:var(--muted);font-size:.88rem}
.rel{display:flex;flex-wrap:wrap;gap:10px}
.rel a{border:1px solid var(--line);border-radius:999px;padding:8px 16px;text-decoration:none;font-size:.94rem;color:var(--text)}
.rel a:hover{border-color:var(--hot);color:var(--hot)}
.cp-cta{margin-top:64px;border:1px solid var(--line);border-radius:14px;background:var(--panel);padding:32px;display:flex;gap:24px;align-items:center;justify-content:space-between;flex-wrap:wrap}
.cp-cta h2{font-size:clamp(1.6rem,4vw,2.4rem)}
.cp-cta .btn{margin:0}
.props .btn.line{margin-top:10px}
@media (max-width:420px){.pgrid{grid-template-columns:1fr}}
`;
fs.mkdirSync('courses',{recursive:true});
const urls=['https://nishlabcreations.online/'];
C.forEach((c,idx)=>{
  const sl=slug(c.n),url=`https://nishlabcreations.online/courses/${sl}/`;urls.push(url);
  const road=c.days?c.days.map((t,k)=>`<li><span>Day ${String(k+1).padStart(2,'0')}</span>${esc(t)}</li>`).join(''):c.ranges.map(r=>`<li><span>Day ${r[0]}</span>${esc(r[1])}</li>`).join('');
  const wa=`https://wa.me/918424099617?text=${encodeURIComponent(`Hi NISHLAB, I want to book a free demo for the ${c.n} course.`)}`;
  const title=`${c.n} Course Online | NISHLAB CREATIONS`;
  const desc=`${c.p} Live online, ${c.h} hours over ${c.d} days, with an industry capstone project. Fee ${inr(c.f)}.`;
  const ld={"@context":"https://schema.org","@type":"Course","name":c.n,"description":c.p,"provider":{"@type":"EducationalOrganization","name":"NISHLAB CREATIONS","sameAs":"https://nishlabcreations.online/"},"hasCourseInstance":{"@type":"CourseInstance","courseMode":"online","courseWorkload":`PT${c.h}H`}};
  const rel=C.filter(x=>x!==c).map(x=>`<a href="/courses/${slug(x.n)}/">${esc(x.n)}</a>`).join('');
  const html=`<!DOCTYPE html>
<html lang="en">
<head>
${gtm}<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="icon" type="image/png" href="/assets/favicon.png">
<link rel="canonical" href="${url}">
<meta name="theme-color" content="#0e1114">
<meta property="og:type" content="website"><meta property="og:site_name" content="NISHLAB CREATIONS">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}"><meta property="og:image" content="https://nishlabcreations.online/og-image.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Instrument+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<style>${css}${extra}</style>
</head>
<body>
<header>
  <div class="wrap bar">
    <a class="brand" href="/"><img src="/assets/logo.png" alt="" width="20" height="30">NISHLAB CREATIONS</a>
    <a class="btn head-cta" href="${wa}" target="_blank" rel="noopener"><span class="xs-hide">Free demo</span><span class="xs-show">Demo</span></a>
    <button class="menu-btn" id="menuBtn" type="button" aria-expanded="false" aria-controls="mainNav" aria-label="Open menu"><span></span></button>
    <nav aria-label="Main" id="mainNav">
      <a href="/#courses">Courses</a><a href="/#batches">Batches</a><a href="/#process">Process</a><a href="/#lab">Lab</a><a href="/#colleges">Colleges</a><a href="/#founder">Founder</a><a href="/#faq">FAQ</a>
      <a href="https://lms.nishlabcreations.online">Student login</a>
      <a class="btn" href="${wa}" target="_blank" rel="noopener">Free demo</a>
    </nav>
  </div>
</header>
<main>
<div class="wrap">
  <p class="mono crumb"><a href="/#courses">Courses</a> &nbsp;›&nbsp; ${esc(c.n)}</p>
  <div class="cp-hero"><p class="mono hot">${esc(c.g)} · ${esc(c.k)}</p><h1>${esc(c.n)}</h1></div>
  <div class="cad one"><div class="props">
    <div class="p-main"><p style="margin-top:0">${esc(c.p)}</p>
      <h2 class="p-h" style="font-weight:500;font-size:.74rem;line-height:1.6">What you'll learn</h2><ul class="learn">${c.learn.map(t=>`<li>${esc(t)}</li>`).join('')}</ul>
      <div class="p-two"><div><h2 class="p-h" style="font-weight:500;font-size:.74rem;line-height:1.6">Software &amp; tools</h2><p>${esc(c.tools)}</p></div><div><h2 class="p-h" style="font-weight:500;font-size:.74rem;line-height:1.6">Best suited for</h2><p>${esc(c.who)}</p></div></div>
      <details class="road" open><summary><span>${c.d}-day roadmap</span><small>2 hrs a day</small></summary><ol>${road}</ol></details>
      <div class="project"><span class="mono hot">Industry capstone</span><br>${esc(c.cap)}</div>
    </div>
    <div class="p-side"><dl class="ptable"><div class="big"><dt class="mono">Course fee</dt><dd>${inr(c.f)}</dd></div>
      <div><dt>Live hours</dt><dd>${c.h} hrs</dd></div><div><dt>Days</dt><dd>${c.d}</dd></div>
      <div><dt>Class length</dt><dd>2 hrs / day</dd></div><div><dt>Format</dt><dd>Live online</dd></div></dl>
      <a class="btn" href="${wa}" target="_blank" rel="noopener">Book a free demo →</a>
      <a class="btn line" href="/#batches">See upcoming batches</a></div>
  </div></div>

  <section class="cp-sec" id="projects" aria-labelledby="ph">
    <div class="head"><div><p class="mono">Student work</p><h2 id="ph">Projects you will build.</h2>
    <p>Hands-on ${esc(c.n)} projects built in this course. Open any model and rotate it right here.</p></div></div>
    <div class="pgrid" id="pgrid" data-course="${sl}"></div>
  </section>

  <section class="cp-sec" aria-labelledby="rh"><div class="head"><div><p class="mono">Keep exploring</p><h2 id="rh" style="font-size:clamp(1.5rem,3.5vw,2.2rem)">Other courses</h2></div></div><div class="rel">${rel}</div></section>

  <div class="cp-cta"><div><h2>Try a free demo class.</h2><p style="margin:10px 0 0;color:var(--muted)">Meet the trainer, see the software, ask anything before you enrol.</p></div><a class="btn" href="${wa}" target="_blank" rel="noopener">Book on WhatsApp →</a></div>
</div>
</main>
<footer>
<div class="wrap">
  <div class="tb">
    <div class="tb-logo"><img src="/assets/logo.png" alt="Nishlab Creations logo" width="96" height="102"><div><span class="mono">Institute</span><b>NISHLAB CREATIONS</b><br>C.G.S. Colony, Sector 7, Antop Hill, Mumbai, Maharashtra 400037</div></div>
    <div><span class="mono">WhatsApp / call</span><a href="https://wa.me/918424099617">+91 84240 99617</a></div>
    <div><span class="mono">Email</span><a href="mailto:nishad@nishlabcreations.com">nishad@nishlabcreations.com</a></div>
    <div><span class="mono">Portals</span><a href="https://lms.nishlabcreations.online">Student login</a><br><a href="https://certificate.nishlabcreations.online">Verify certificate</a></div>
  </div>
  <div class="copy"><span>© 2026 NISHLAB CREATIONS · ISO 9001:2015 certified</span><span class="mono"><a href="/">Back to home</a></span></div>
</div>
</footer>
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="/courses/projects.js"></script>
<script src="/courses/viewer.js"></script>
<script>
(function(){
var nav=document.getElementById("mainNav"),mb=document.getElementById("menuBtn");
function set(o){nav.classList.toggle("open",o);mb.setAttribute("aria-expanded",String(o));mb.setAttribute("aria-label",o?"Close menu":"Open menu")}
mb.addEventListener("click",function(){set(!nav.classList.contains("open"))});
nav.addEventListener("click",function(e){if(e.target.closest("a"))set(false)});
document.addEventListener("keydown",function(e){if(e.key==="Escape")set(false)});
var grid=document.getElementById("pgrid"),list=(window.NISHLAB_PROJECTS||{})[grid.dataset.course]||[];
function el(h){var d=document.createElement("div");d.innerHTML=h;return d.firstElementChild}
function esc(t){return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;")}
list.forEach(function(p){
  var tags=(p.tags||[]).map(function(t){return "<span>"+esc(t)+"</span>"}).join("");
  var card=el("<article class='pcard'><div class='pv-stage'><div class='pv-intro'><button type='button' class='btn pv-load'>Open interactive 3D model</button><span class='pv-msg' aria-live='polite'></span></div>"+
   "<div class='pv-bar' hidden><button type='button' data-a='zin' aria-label='Zoom in'>+</button><button type='button' data-a='zout' aria-label='Zoom out'>−</button><button type='button' data-a='wire' aria-pressed='false'>Wireframe</button><button type='button' data-a='reset'>Reset</button><button type='button' data-a='full' aria-label='Fullscreen'>⛶</button></div></div>"+
   "<h3>"+esc(p.title)+"</h3>"+(p.desc?"<p>"+esc(p.desc)+"</p>":"")+"<div class='ptags'>"+tags+"</div></article>");
  grid.appendChild(card);
  window.NISHLAB_mountViewer(card,p.model);
});
if(!list.length){for(var i=1;i<=3;i++)grid.appendChild(el("<article class='pcard pslot'><div class='pv-stage'><div class='pv-intro'><b>Project "+i+"</b><span>3D model coming soon</span></div></div><h3>Student project</h3><p>A finished model from this course will appear here.</p><div class='ptags'></div></article>"))}
})();
${trk}
</script>
</body>
</html>`;
  fs.mkdirSync(`courses/${sl}`,{recursive:true});fs.writeFileSync(`courses/${sl}/index.html`,html);
  console.log('wrote',sl,(html.length/1024).toFixed(0)+'KB');
});
fs.writeFileSync('sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u=>`  <url><loc>${u}</loc></url>`).join('\n')}\n</urlset>\n`);
