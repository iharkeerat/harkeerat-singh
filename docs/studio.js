(()=>{'use strict';
const $=(q,root=document)=>root.querySelector(q), $$=(q,root=document)=>[...root.querySelectorAll(q)];
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
document.documentElement.classList.add('js');
const header=$('.header'), bar=$('.progress span');
let raf=0;
function updateScroll(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;header?.classList.toggle('scrolled',scrollY>18);if(bar){const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);bar.style.transform=`scaleX(${Math.max(0,Math.min(1,scrollY/max))})`;}})}
addEventListener('scroll',updateScroll,{passive:true});addEventListener('resize',updateScroll);updateScroll();
const menuButton=$('.menu-button'),mobile=$('.mobile-nav');
function closeMenu(){if(!menuButton||!mobile)return;mobile.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Open navigation');document.body.classList.remove('menu-is-open')}
menuButton?.addEventListener('click',()=>{if(!mobile)return;const opening=mobile.hidden;mobile.hidden=!opening;menuButton.setAttribute('aria-expanded',String(opening));menuButton.setAttribute('aria-label',opening?'Close navigation':'Open navigation');document.body.classList.toggle('menu-is-open',opening)});
$$('.mobile-nav a').forEach(link=>link.addEventListener('click',closeMenu));addEventListener('resize',()=>{if(innerWidth>920)closeMenu()});addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
// Reveals are optional decoration; content is readable without JS and when motion is reduced.
const reveals=$$('.reveal');if(!reduce&&'IntersectionObserver' in window){const io=new IntersectionObserver((entries,obs)=>{for(const e of entries){if(e.isIntersecting){e.target.classList.add('is-visible');obs.unobserve(e.target)}}},{threshold:.13,rootMargin:'0px 0px -6% 0px'});reveals.forEach(el=>io.observe(el))}else{reveals.forEach(el=>el.classList.add('is-visible'))}
const workRows=$$('.work-row'),visuals=$$('.work-visual');const status=$('[data-preview-status]'),desc=$('[data-preview-description]'),count=$('[data-preview-current]');
const previews=[
{status:'Experimental research',desc:'An investigation of causal ambiguity between environmental change, delayed observations and hidden intervention. Finite-domain GridWorld evidence is audited; LunarLander evaluation remains preliminary.'},
{status:'Citizen-authored proposal',desc:'An 800+ page independently drafted legislative and operational architecture for examination integrity, scientific assurance and candidate rights. Submitted for consideration; not adopted or endorsed.'},
{status:'Public research prototype',desc:'Symbolic score parsing, Raag/Taal knowledge and exact alignment methods. The formal prototype is inspectable; real-world singing-alignment accuracy has not been established.'},
{status:'Public exploratory prototype',desc:'An adaptive learning prototype combining interaction signals, prerequisite graphs and explainable routes through concepts. No validated cognitive diagnoses or learning-effectiveness results.'},
{status:'Independent policy proposal',desc:'An independent student-authored proposal for criterion-linked marking, transparent evaluation, examiner calibration and evidence-gated pilots at Panjab University.'}
];
function selectPreview(i){if(!Number.isInteger(i)||i<0||i>=previews.length)return;workRows.forEach((el,j)=>el.classList.toggle('is-selected',j===i));visuals.forEach((el,j)=>el.classList.toggle('is-current',j===i));if(status)status.textContent=previews[i].status;if(desc)desc.textContent=previews[i].desc;if(count)count.textContent=String(i+1).padStart(2,'0')}
workRows.forEach((row,i)=>{row.addEventListener('pointerenter',()=>selectPreview(i));row.addEventListener('focus',()=>selectPreview(i))});
// One global motion control pauses decorative media without interfering with navigation.
const motion=$('.motion-button');let paused=reduce;
function syncMotion(){document.body.classList.toggle('motion-paused',paused);if(motion){motion.setAttribute('aria-pressed',String(paused));motion.setAttribute('aria-label',paused?'Resume decorative animations':'Pause decorative animations');const symbol=$('.motion-symbol',motion),label=$('.motion-label',motion);if(symbol)symbol.textContent=paused?'▶':'Ⅱ';if(label)label.textContent=paused?'Resume motion':'Pause motion'}}
motion?.addEventListener('click',()=>{paused=!paused;syncMotion()});syncMotion();

// Subtle editorial cursor: smooth trailing ring; no hover lock and no effect on native scroll.
// Only enable it on genuine mouse devices when the visitor has not requested reduced motion.
const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
if(fine && !reduce){
  const root=document.documentElement;
  const cursor=$('.site-cursor');
  const point=cursor?.querySelector('.cursor-point'),ring=cursor?.querySelector('.cursor-ring'),word=cursor?.querySelector('.cursor-word');
  if(cursor && point && ring && word){
    let targetX=innerWidth/2,targetY=innerHeight/2;
    let ringX=targetX,ringY=targetY;
    let visible=false,frame=0;
    const step=()=>{
      frame=0;
      ringX+=(targetX-ringX)*.22;
      ringY+=(targetY-ringY)*.22;
      ring.style.translate=`${ringX}px ${ringY}px`;
      if(Math.abs(targetX-ringX)+Math.abs(targetY-ringY)>.55 && visible)frame=requestAnimationFrame(step);
    };
    const schedule=()=>{if(!frame)frame=requestAnimationFrame(step)};
    const kindFor=(el)=>{
      if(!el)return '';
      if(el.closest('.work-row,.feature-row'))return 'project';
      if(el.closest('a,button,summary,[role="button"]'))return 'link';
      return '';
    };
    addEventListener('pointermove',(e)=>{
      if(e.pointerType!=='mouse')return;
      targetX=e.clientX;targetY=e.clientY;
      if(!visible){ringX=targetX;ringY=targetY;visible=true;root.classList.add('cursor-ready');root.classList.remove('cursor-out')}
      point.style.translate=`${targetX}px ${targetY}px`;
      const kind=kindFor(e.target);
      cursor.dataset.kind=kind;
      word.textContent=kind==='project'?'VIEW':'';
      schedule();
    },{passive:true});
    // Scrolling can change the element under a stationary mouse; never leave a stale VIEW label.
    const syncUnderPointer=()=>{
      if(!visible)return;
      const under=document.elementFromPoint(targetX,targetY);
      const kind=kindFor(under);
      cursor.dataset.kind=kind;
      word.textContent=kind==='project'?'VIEW':'';
    };
    addEventListener('scroll',syncUnderPointer,{passive:true});
    addEventListener('resize',syncUnderPointer);
    document.addEventListener('pointerleave',()=>{root.classList.add('cursor-out');visible=false;if(frame){cancelAnimationFrame(frame);frame=0}});
    document.addEventListener('pointerenter',()=>{if(visible)root.classList.remove('cursor-out')});
    addEventListener('blur',()=>root.classList.add('cursor-out'));
    addEventListener('focus',()=>{if(visible)root.classList.remove('cursor-out')});
    // The pause button also suspends purely decorative cursor animation.
    const toggle=$('.motion-button');
    toggle?.addEventListener('click',()=>{
      const isPaused=toggle.getAttribute('aria-pressed')==='true';
      root.classList.toggle('cursor-out',isPaused);
      root.classList.toggle('cursor-ready',!isPaused && visible);
    });
  }
}
// Restrained local lighting on the diagram, without extra images or a canvas loop.
const art=$('.hero-art');
if(art && fine && !reduce){
  art.addEventListener('pointermove',e=>{
    const rect=art.getBoundingClientRect();
    art.style.setProperty('--glow-x',((e.clientX-rect.left)/rect.width*100).toFixed(1)+'%');
    art.style.setProperty('--glow-y',((e.clientY-rect.top)/rect.height*100).toFixed(1)+'%');
  },{passive:true});
}
})();
