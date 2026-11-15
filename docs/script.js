(() => {
  'use strict';

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarsePointer = matchMedia('(hover: none), (pointer: coarse)').matches;

  // Hero title reveal without external animation libraries.
  $$('[data-split]').forEach((line, lineIndex) => {
    const words = line.textContent.trim().split(/\s+/);
    line.textContent = '';
    words.forEach((word, wordIndex) => {
      const span = document.createElement('span');
      span.className = 'word';
      span.textContent = word;
      span.style.transitionDelay = `${120 + lineIndex * 130 + wordIndex * 65}ms`;
      line.appendChild(span);
    });
  });
  requestAnimationFrame(() => document.body.classList.add('loaded'));

  // Header, progress and horizontal work story.
  const header = $('[data-header]');
  const progressBar = $('.page-progress span');
  const projectTrack = $('[data-project-track]');
  const projectPanels = $$('.project-panel', projectTrack || document);
  const projectsProgress = $('.projects-progress span');

  function updateScrollUI() {
    const y = window.scrollY;
    if (header) header.classList.toggle('scrolled', y > 24);
    if (progressBar) {
      const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      progressBar.style.transform = `scaleX(${clamp(y / max)})`;
    }
    if (!reducedMotion) {
      $$('[data-depth]').forEach((el) => {
        const rect = el.getBoundingClientRect();
        const depth = Number(el.dataset.depth || 0.1);
        const distance = rect.top + rect.height / 2 - innerHeight / 2;
        const shift = clamp(-distance * depth * 0.08, -64, 64);
        el.style.setProperty('--scroll-shift', `${shift}px`);
      });
    }
  }
  let scrollFrame = 0;
  addEventListener('scroll', () => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => { scrollFrame = 0; updateScrollUI(); });
  }, { passive: true });
  addEventListener('resize', updateScrollUI);
  updateScrollUI();

  // Native sideways gallery: no vertical-wheel hijacking, no scroll pinning.
  // The browser owns page scrolling. Controls only move the horizontal rail.
  if (projectTrack && projectPanels.length) {
    const prev = $('[data-project-prev]');
    const next = $('[data-project-next]');
    const current = $('[data-project-current]');
    const total = $('[data-project-total]');
    const format = value => String(value).padStart(2, '0');
    if (total) total.textContent = format(projectPanels.length);
    let active = 0;
    const getLeft = (panel) => panel.offsetLeft - projectPanels[0].offsetLeft;
    const sync = () => {
      const remaining = projectTrack.scrollWidth - projectTrack.clientWidth;
      let closest = 0;
      let distance = Infinity;
      projectPanels.forEach((panel, i) => {
        const delta = Math.abs(projectTrack.scrollLeft - getLeft(panel));
        if (delta < distance) { distance = delta; closest = i; }
      });
      active = closest;
      if (current) current.textContent = format(active + 1);
      if (prev) prev.disabled = active === 0;
      if (next) next.disabled = active === projectPanels.length - 1;
      if (projectsProgress) {
        const fraction = remaining > 0 ? projectTrack.scrollLeft / remaining : 1;
        projectsProgress.style.transform = `scaleX(${(1 + clamp(fraction) * (projectPanels.length - 1)) / projectPanels.length})`;
      }
    };
    const moveTo = (index) => {
      const destination = projectPanels[clamp(index, 0, projectPanels.length - 1)];
      if (!destination) return;
      projectTrack.scrollTo({left:getLeft(destination),behavior:reducedMotion ? 'instant' : 'smooth'});
    };
    prev?.addEventListener('click', () => moveTo(active - 1));
    next?.addEventListener('click', () => moveTo(active + 1));
    projectTrack.addEventListener('scroll', sync, { passive:true });
    addEventListener('resize', sync);
    sync();
  }

  // Intersection reveals and animated counters.
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
  $$('.reveal-up, .reveal-card, .reveal-lines').forEach((el) => revealObserver.observe(el));

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const element = entry.target;
      const target = Number(element.dataset.counter || 0);
      if (reducedMotion) {
        element.textContent = target.toLocaleString();
      } else {
        const start = performance.now();
        const duration = 1300;
        const tick = (time) => {
          const p = clamp((time - start) / duration);
          const eased = 1 - Math.pow(1 - p, 4);
          element.textContent = Math.round(target * eased).toLocaleString();
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
      observer.unobserve(element);
    });
  }, { threshold: 0.6 });
  $$('[data-counter]').forEach((el) => counterObserver.observe(el));

  // Mobile navigation.
  const menuTrigger = $('[data-menu-trigger]');
  const mobileMenu = $('[data-mobile-menu]');
  function closeMenu() {
    if (!menuTrigger || !mobileMenu) return;
    menuTrigger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    document.body.classList.remove('menu-open');
  }
  menuTrigger?.addEventListener('click', () => {
    const open = menuTrigger.getAttribute('aria-expanded') === 'true';
    menuTrigger.setAttribute('aria-expanded', String(!open));
    mobileMenu?.classList.toggle('open', !open);
    document.body.classList.toggle('menu-open', !open);
  });
  $$('a', mobileMenu || document.createElement('div')).forEach((link) => link.addEventListener('click', closeMenu));
  addEventListener('resize', () => { if (innerWidth > 760) closeMenu(); });

  // Command palette.
  const commandDialog = $('[data-command-dialog]');
  const commandInput = $('[data-command-input]');
  const commandItems = $$('[data-command-item]');
  function openCommand() {
    if (!commandDialog) return;
    commandDialog.showModal();
    requestAnimationFrame(() => commandInput?.focus());
  }
  $('[data-command-open]')?.addEventListener('click', openCommand);
  addEventListener('keydown', (event) => {
    const shortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
    if (shortcut) { event.preventDefault(); openCommand(); }
    if (event.key === 'Escape' && commandDialog?.open) commandDialog.close();
  });
  commandInput?.addEventListener('input', () => {
    const query = commandInput.value.trim().toLowerCase();
    commandItems.forEach((item) => item.classList.toggle('hidden', !item.textContent.toLowerCase().includes(query)));
  });
  commandItems.forEach((item) => item.addEventListener('click', () => commandDialog?.close()));

  // Canvas utilities.
  function setupCanvas(canvas) {
    if (!canvas) return null;
    const context = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let dpr = 1;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    return { context, get width() { return width; }, get height() { return height; }, resize, destroy: () => observer.disconnect() };
  }

  function createConstellation(canvas, options = {}) {
    const surface = setupCanvas(canvas);
    if (!surface || reducedMotion) return;
    const count = coarsePointer ? 16 : 34;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random(), y: Math.random(), vx: (Math.random() - .5) * .00012, vy: (Math.random() - .5) * .00012,
      r: Math.random() * 1.6 + .45
    }));
    let mouse = { x: .5, y: .5 };
    canvas.addEventListener('pointermove', (event) => {
      const rect = canvas.getBoundingClientRect();
      mouse = { x: (event.clientX - rect.left) / rect.width, y: (event.clientY - rect.top) / rect.height };
    }, { passive: true });
    const draw = () => {
      if (document.hidden) { requestAnimationFrame(draw); return; }
      const { context: ctx, width, height } = surface;
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > 1) p.vx *= -1;
        if (p.y < 0 || p.y > 1) p.vy *= -1;
        const px = p.x * width + (mouse.x - .5) * 12;
        const py = p.y * height + (mouse.y - .5) * 8;
        ctx.beginPath(); ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fillStyle = options.contact ? 'rgba(216,255,53,.22)' : 'rgba(255,255,255,.22)'; ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = (a.x - b.x) * width, dy = (a.y - b.y) * height;
          const dist = Math.hypot(dx, dy);
          const threshold = coarsePointer ? 100 : 135;
          if (dist < threshold) {
            ctx.beginPath(); ctx.moveTo(a.x * width, a.y * height); ctx.lineTo(b.x * width, b.y * height);
            ctx.strokeStyle = `rgba(${options.contact ? '216,255,53' : '123,97,255'},${(1 - dist / threshold) * .09})`;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
  }
  createConstellation($('#constellation'));
  createConstellation($('#contact-canvas'), { contact: true });

})();
