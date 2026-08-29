/* ============================================================
   Portfolio — Enhanced Script
   Copyright (c) 2026 TechRoad Inc. All rights reserved.
   Backend direct send — beautiful HTML, no third-party.
   ============================================================ */

/* ── Canvas Background ──────────────────────────────────────── */
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
function resize(){canvas.width=innerWidth*devicePixelRatio;canvas.height=innerHeight*devicePixelRatio;canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';draw()}
function draw(){
  const w=canvas.width,h=canvas.height;ctx.clearRect(0,0,w,h);
  const isLight=document.body.classList.contains('light');
  ctx.fillStyle=isLight?'#f1efec':'#060608';ctx.fillRect(0,0,w,h);
  const g=ctx.createRadialGradient(w*0.5,h*0.62,w*0.1,w*0.5,h*0.62,w*0.9);
  g.addColorStop(0,isLight?'rgba(192,57,43,.08)':'rgba(160,30,30,.18)');g.addColorStop(0.35,isLight?'rgba(120,50,40,.04)':'rgba(80,15,15,.08)');g.addColorStop(1,'transparent');
  ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
  const g2=ctx.createLinearGradient(0,0,0,h);
  g2.addColorStop(0,isLight?'rgba(255,255,255,.2)':'rgba(0,0,0,.55)');g2.addColorStop(0.5,'transparent');g2.addColorStop(1,isLight?'rgba(80,50,40,.08)':'rgba(0,0,0,.7)');
  ctx.fillStyle=g2;ctx.fillRect(0,0,w,h);
  const d=ctx.getImageData(0,0,w,h).data; const img=ctx.getImageData(0,0,w,h);
  for(let i=0;i<img.data.length;i+=4){const n=(Math.random()-0.5)*(isLight?5:10);img.data[i]+=n;img.data[i+1]+=n;img.data[i+2]+=n;if(Math.random()<0.0002){img.data[i]*=0.85;img.data[i+1]*=0.85;img.data[i+2]*=0.85;}}
  ctx.putImageData(img,0,0);
  ctx.fillStyle=isLight?'rgba(80,50,40,.018)':'rgba(255,255,255,.012)';for(let y=0;y<h;y+=6)ctx.fillRect(0,y,w,1);
}
addEventListener('resize',resize);resize();

/* ── Theme ──────────────────────────────────────────────────── */
const themeToggle=document.getElementById('themeToggle');
if(localStorage.getItem('theme')==='light')document.body.classList.add('light');
function updateThemeButton(){const l=document.body.classList.contains('light');themeToggle.textContent=l?'☾':'☼';themeToggle.title=l?'Switch to dark mode':'Switch to light mode';}
updateThemeButton();
function toggleTheme(){document.body.classList.toggle('light');localStorage.setItem('theme',document.body.classList.contains('light')?'light':'dark');updateThemeButton();draw();}
window.toggleTheme=toggleTheme;

/* ── Fill email links from backend config ───────────────────── */
fetch('/api/config').then(r=>r.json()).then(d=>{
  const e=d.email;
  const a=document.getElementById('emailLinkTop'),b=document.getElementById('emailLinkFooter');
  if(a){a.href='mailto:'+e;a.title=e;a.setAttribute('aria-label',e);}
  if(b){b.href='mailto:'+e;b.textContent=e;}
}).catch(()=>{});

/* ── Scroll fade-in ─────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded',()=>{
  const els=document.querySelectorAll('.fade-in');
  const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('visible');io.unobserve(x.target)}}),{threshold:.12,rootMargin:'0px 0px -40px 0px'});
  els.forEach(e=>io.observe(e));
});

/* ── Contact Form — direct to backend ───────────────────────── */
document.addEventListener('DOMContentLoaded',()=>{
  const form=document.getElementById('contactForm');if(!form)return;
  const btn=document.getElementById('submitBtn'),st=document.getElementById('formStatus');
  const nI=document.getElementById('formName'),eI=document.getElementById('formEmail'),pI=document.getElementById('formPhone'),mI=document.getElementById('formMessage');
  const nE=document.getElementById('nameError'),eE=document.getElementById('emailError'),mE=document.getElementById('messageError');
  const showErr=(i,el,msg)=>{i.classList.add('error');el.textContent=msg;el.classList.add('visible')};
  const clearErr=(i,el)=>{i.classList.remove('error');el.textContent='';el.classList.remove('visible')};
  const showStatus=(t,msg)=>{st.className='form-status visible '+t;st.textContent=msg};
  const hideStatus=()=>{st.className='form-status';st.textContent=''};
  nI.addEventListener('input',()=>clearErr(nI,nE));eI.addEventListener('input',()=>clearErr(eI,eE));mI.addEventListener('input',()=>clearErr(mI,mE));
  form.addEventListener('submit',async e=>{
    e.preventDefault();hideStatus();let v=true;
    if(!nI.value.trim()){showErr(nI,nE,'Name is required.');v=false}
    if(!eI.value.trim()){showErr(eI,eE,'Email is required.');v=false}
    else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(eI.value.trim())){showErr(eI,eE,'Please enter a valid email.');v=false}
    if(!mI.value.trim()){showErr(mI,mE,'Message is required.');v=false}
    if(!v)return;
    btn.classList.add('loading');btn.disabled=true;
    try{
      const r=await fetch('/api/send',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:nI.value.trim(),email:eI.value.trim(),phone:pI.value.trim(),message:mI.value.trim()})});
      const d=await r.json();
      if(d.ok){
        if(d.demo) showStatus('success','Message sent! (demo mode — configure config.js to send real emails)');
        else showStatus('success','Message sent! I\'ll get back to you soon.');
        form.reset();
      }
      else throw new Error(d.error);
    }catch(err){showStatus('error',err.message || 'Cannot reach server. Is npm start running?');}
    finally{btn.classList.remove('loading');btn.disabled=false;}
  });
});
