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
  const projectsSection = $('[data-projects-scroll]');
  const projectTrack = $('[data-project-track]');
  const projectsProgress = $('.projects-progress span');

  function updateScrollUI() {
    const y = window.scrollY;
    if (header) header.classList.toggle('scrolled', y > 24);
    if (progressBar) {
      const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      progressBar.style.transform = `scaleX(${clamp(y / max)})`;
    }
    if (projectsSection && projectTrack && innerWidth > 760) {
      const rect = projectsSection.getBoundingClientRect();
      const travel = projectsSection.offsetHeight - innerHeight;
      const local = clamp(-rect.top / Math.max(1, travel));
      const slides = projectTrack.querySelectorAll('.project-panel').length;
      projectTrack.style.transform = `translate3d(${-local * Math.max(0, slides - 1) * 100}vw,0,0)`;
      if (projectsProgress) projectsProgress.style.transform = `scaleX(${local})`;
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
  addEventListener('scroll', updateScrollUI, { passive: true });
  addEventListener('resize', updateScrollUI);
  updateScrollUI();

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

  // Custom cursor and magnetic controls.
  if (!coarsePointer) {
    const dot = $('.cursor-dot');
    const ring = $('.cursor-ring');
    let pointerX = innerWidth / 2;
    let pointerY = innerHeight / 2;
    let ringX = pointerX;
    let ringY = pointerY;
    addEventListener('pointermove', (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (dot) {
        dot.style.opacity = '1';
        dot.style.left = `${pointerX}px`;
        dot.style.top = `${pointerY}px`;
      }
      if (ring) ring.style.opacity = '1';
    }, { passive: true });
    const animateCursor = () => {
      ringX += (pointerX - ringX) * 0.16;
      ringY += (pointerY - ringY) * 0.16;
      if (ring) {
        ring.style.left = `${ringX}px`;
        ring.style.top = `${ringY}px`;
      }
      requestAnimationFrame(animateCursor);
    };
    requestAnimationFrame(animateCursor);
    $$('a,button,[data-tilt]').forEach((el) => {
      el.addEventListener('mouseenter', () => ring?.classList.add('is-active'));
      el.addEventListener('mouseleave', () => ring?.classList.remove('is-active'));
    });
    $$('.magnetic').forEach((el) => {
      el.addEventListener('pointermove', (event) => {
        const rect = el.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        el.style.translate = `${x * 0.12}px ${y * 0.12}px`;
      });
      el.addEventListener('pointerleave', () => { el.style.translate = '0 0'; });
    });
  }

  // Lightweight 3D tilt. It is deliberately disabled on touch and reduced-motion devices.
  if (!coarsePointer && !reducedMotion) {
    $$('[data-tilt]').forEach((el) => {
      if (el.classList.contains('data-cube')) return;
      let baseTransform = '';
      el.addEventListener('pointerenter', () => { baseTransform = getComputedStyle(el).transform === 'none' ? '' : getComputedStyle(el).transform; });
      el.addEventListener('pointermove', (event) => {
        const rect = el.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        el.style.transform = `${baseTransform} perspective(1100px) rotateX(${-y * 5}deg) rotateY(${x * 7}deg) translateZ(4px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = baseTransform; });
    });
  }

  // Pointer parallax for layered elements, using individual translate so authored transforms remain intact.
  if (!coarsePointer && !reducedMotion) {
    const depthElements = $$('[data-depth]');
    addEventListener('pointermove', (event) => {
      const nx = event.clientX / innerWidth - 0.5;
      const ny = event.clientY / innerHeight - 0.5;
      depthElements.forEach((el) => {
        const depth = Number(el.dataset.depth || 0.1);
        el.style.setProperty('--parallax-x', `${nx * depth * 85}px`);
        el.style.setProperty('--parallax-y', `${ny * depth * 70}px`);
      });
    }, { passive: true });
  }

  // Research method details.
  const methodContent = {
    statistics: ['Statistics', 'Hypothesis tests, confidence intervals, effect sizes, regression diagnostics and assumptions become part of the claim—not a footnote after it.'],
    experiments: ['Experiments', 'Controlled conditions, frozen protocols, meaningful baselines, multi-seed runs and ablations test whether an effect survives outside one convenient configuration.'],
    ml: ['Machine learning', 'Calibration, uncertainty, class-wise metrics and abstention help the system communicate how much trust an output deserves.'],
    data: ['Data systems', 'Schema, range, uniqueness, missingness and provenance checks turn messy multilingual or behavioural data into a reproducible analytical object.'],
    product: ['Product translation', 'Evidence traces, confidence language and prerequisite-aware next steps make the analysis inspectable by the person who must act on it.'],
    policy: ['Socio-technical reasoning', 'Accessibility, fairness, incentives and institutional constraints are treated as system variables—not as a final ethics paragraph.']
  };
  const methodDetail = $('[data-method-detail]');
  const methodNodes = $$('[data-method]');
  methodNodes.forEach((node, index) => {
    if (index === 0) node.classList.add('active');
    node.addEventListener('click', () => {
      methodNodes.forEach((item) => item.classList.remove('active'));
      node.classList.add('active');
      const [title, copy] = methodContent[node.dataset.method] || methodContent.statistics;
      if (methodDetail) {
        $('strong', methodDetail).textContent = title;
        $('p', methodDetail).textContent = copy;
      }
    });
  });

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
    const count = coarsePointer ? 34 : 70;
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
      const { context: ctx, width, height } = surface;
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > 1) p.vx *= -1;
        if (p.y < 0 || p.y > 1) p.vy *= -1;
        const px = p.x * width + (mouse.x - .5) * 12;
        const py = p.y * height + (mouse.y - .5) * 8;
        ctx.beginPath(); ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fillStyle = options.contact ? 'rgba(216,255,53,.5)' : 'rgba(255,255,255,.36)'; ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = (a.x - b.x) * width, dy = (a.y - b.y) * height;
          const dist = Math.hypot(dx, dy);
          const threshold = coarsePointer ? 100 : 135;
          if (dist < threshold) {
            ctx.beginPath(); ctx.moveTo(a.x * width, a.y * height); ctx.lineTo(b.x * width, b.y * height);
            ctx.strokeStyle = `rgba(${options.contact ? '216,255,53' : '123,97,255'},${(1 - dist / threshold) * .18})`;
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

  // Connect the method nodes with an adaptive canvas graph.
  const networkCanvas = $('#method-network');
  const stage = $('.system-stage');
  const core = $('.system-core');
  const networkSurface = setupCanvas(networkCanvas);
  function drawMethodNetwork() {
    if (!networkSurface || !stage || !core || innerWidth <= 760) return;
    const { context: ctx, width, height } = networkSurface;
    ctx.clearRect(0, 0, width, height);
    const stageRect = stage.getBoundingClientRect();
    const coreRect = core.getBoundingClientRect();
    const center = { x: coreRect.left - stageRect.left + coreRect.width / 2, y: coreRect.top - stageRect.top + coreRect.height / 2 };
    methodNodes.forEach((node, index) => {
      const rect = node.getBoundingClientRect();
      const target = { x: rect.left - stageRect.left + rect.width / 2, y: rect.top - stageRect.top + rect.height / 2 };
      const midX = (center.x + target.x) / 2 + (index % 2 ? 25 : -25);
      ctx.beginPath();
      ctx.moveTo(center.x, center.y);
      ctx.quadraticCurveTo(midX, (center.y + target.y) / 2, target.x, target.y);
      ctx.strokeStyle = node.classList.contains('active') ? 'rgba(216,255,53,.58)' : 'rgba(255,255,255,.13)';
      ctx.lineWidth = node.classList.contains('active') ? 2 : 1;
      ctx.stroke();
      ctx.beginPath(); ctx.arc(target.x, target.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = node.classList.contains('active') ? '#d8ff35' : '#646b76'; ctx.fill();
    });
  }
  if (networkSurface) {
    drawMethodNetwork();
    addEventListener('resize', drawMethodNetwork);
    methodNodes.forEach((node) => node.addEventListener('click', drawMethodNetwork));
    setInterval(drawMethodNetwork, 700);
  }
})();
