(() => {
  'use strict';
  const root=document.documentElement;
  root.classList.add('js');
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse=window.matchMedia('(pointer: coarse)').matches;
  const menu=$('.menu-toggle'),mobile=$('#mobile-nav'),header=$('#site-header'),progress=$('#scroll-progress'),toggle=$('.motion-toggle');
  let paused=reduceMotion,scrollBusy=false;
  function closeMenu(){if(!menu||!mobile)return;mobile.hidden=true;menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation')}
  menu?.addEventListener('click',()=>{const opening=mobile.hidden;mobile.hidden=!opening;menu.setAttribute('aria-expanded',String(opening));menu.setAttribute('aria-label',opening?'Close navigation':'Open navigation')});
  $$('.mobile-nav a').forEach(a=>a.addEventListener('click',closeMenu));
  window.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
  window.addEventListener('resize',()=>{if(innerWidth>920)closeMenu()});
  function syncScroll(){scrollBusy=false;header?.classList.toggle('is-scrolled',scrollY>20);if(progress){const range=Math.max(1,document.documentElement.scrollHeight-innerHeight);progress.style.transform=`scaleX(${Math.min(1,Math.max(0,scrollY/range))})`}}
  function onScroll(){if(scrollBusy)return;scrollBusy=true;requestAnimationFrame(syncScroll)}
  window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll);syncScroll();
  const reveals=$$('.reveal');
  if(!reduceMotion&&'IntersectionObserver' in window){
    const io=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){entry.target.classList.add('is-visible');io.unobserve(entry.target)}}},{threshold:.075,rootMargin:'0px 0px -5% 0px'});
    reveals.forEach(el=>io.observe(el));
  } else {reveals.forEach(el=>el.classList.add('is-visible'))}
  function pauseMotion(next){paused=next;root.classList.toggle('motion-paused',next);if(next){reveals.forEach(el=>el.classList.add('is-visible'))}if(toggle){toggle.setAttribute('aria-pressed',String(next));$('.motion-icon',toggle).textContent=next?'▶':'Ⅱ';$('.motion-text',toggle).textContent=next?'Resume motion':'Pause motion'}}
  toggle?.addEventListener('click',()=>pauseMotion(!paused));
  if(reduceMotion)pauseMotion(true);
  // The cursor augments only fine-pointer navigation; keyboard and touch retain their native controls.
  if(!reduceMotion&&!coarse&&window.matchMedia('(hover: hover)').matches){
    const c=$('.cursor'),label=$('.cursor-caption');
    if(c&&label){
      let x=-100,y=-100,fx=-100,fy=-100,visible=false,frame=0,kind='';
      function draw(){fx+=(x-fx)*.28;fy+=(y-fy)*.28;c.style.transform=`translate3d(${fx-40}px,${fy-40}px,0)`;frame=requestAnimationFrame(draw)}
      function markTarget(el){const t=el?.closest?.('[data-cursor]');const next=t?.getAttribute('data-cursor')||'';if(next===kind)return;kind=next;c.classList.toggle('is-active',!!next);label.textContent=next}
      document.addEventListener('pointermove',e=>{if(e.pointerType==='touch'||paused)return;x=e.clientX;y=e.clientY;if(!visible){visible=true;fx=x;fy=y;root.classList.add('cursor-enabled');if(!frame)frame=requestAnimationFrame(draw)}markTarget(e.target)},{passive:true});
      document.addEventListener('pointerover',e=>markTarget(e.target),{passive:true});
      document.addEventListener('pointerout',e=>{if(!e.relatedTarget){visible=false;root.classList.remove('cursor-enabled');c.classList.remove('is-active');kind='';if(frame){cancelAnimationFrame(frame);frame=0}}},{passive:true});
      window.addEventListener('blur',()=>{root.classList.remove('cursor-enabled');visible=false;if(frame){cancelAnimationFrame(frame);frame=0}});
      window.addEventListener('scroll',()=>{if(!visible)return;const el=document.elementFromPoint(x,y);markTarget(el)},{passive:true});
      toggle?.addEventListener('click',()=>{if(paused){root.classList.remove('cursor-enabled');c.classList.remove('is-active')}else if(visible)root.classList.add('cursor-enabled')});
    }
  }
})();
