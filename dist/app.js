'use strict';

const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#site-navigation');

if (header && menuButton && navigation) {
  const menuLabel = menuButton.querySelector('.menu-label');
  const compactLayout = window.matchMedia('(max-width: 800px)');

  function setMenuLabel(label) {
    if (menuLabel) menuLabel.textContent = label;
  }

  function closeMenu({ restoreFocus = false } = {}) {
    menuButton.setAttribute('aria-expanded', 'false');
    setMenuLabel('Menu');
    navigation.classList.remove('is-open');
    if (restoreFocus) menuButton.focus();
  }

  menuButton.addEventListener('click', () => {
    const opening = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(opening));
    setMenuLabel(opening ? 'Close' : 'Menu');
    navigation.classList.toggle('is-open', opening);
  });

  navigation.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link) return;
    closeMenu();
    if (!compactLayout.matches || !link.hash) return;
    const id = decodeURIComponent(link.hash.slice(1));
    if (!/^[A-Za-z][\w-]*$/.test(id)) return;
    const destination = document.getElementById(id);
    if (!destination) return;
    if (!destination.hasAttribute('tabindex')) destination.setAttribute('tabindex', '-1');
    destination.focus({ preventScroll: true });
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      closeMenu({ restoreFocus: true });
    }
  });

  document.addEventListener('click', event => {
    if (!header.contains(event.target)) closeMenu();
  });

  header.addEventListener('focusout', event => {
    if (event.relatedTarget && !header.contains(event.relatedTarget)) closeMenu();
  });

  compactLayout.addEventListener('change', () => closeMenu());
  document.documentElement.classList.add('js');
  menuButton.hidden = false;
}

const year = document.querySelector('#year');
if (year) year.textContent = String(new Date().getFullYear());

const heroCanvas = document.querySelector('#hero-canvas');
const heroContext = heroCanvas && heroCanvas.getContext('2d');
if (heroCanvas && heroContext) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const clusters = [
    { color: [26, 107, 90], cx: 0.42, cy: 0.3, rx: 0.08, ry: 0.1, count: 80, angle: -0.3 },
    { color: [42, 139, 116], cx: 0.58, cy: 0.52, rx: 0.06, ry: 0.09, count: 65, angle: 0.4 },
    { color: [60, 160, 140], cx: 0.48, cy: 0.7, rx: 0.07, ry: 0.06, count: 55, angle: -0.1 },
    { color: [80, 130, 120], cx: 0.35, cy: 0.5, rx: 0.05, ry: 0.07, count: 45, angle: 0.6 },
    { color: [30, 80, 70], cx: 0.45, cy: 0.5, rx: 0.14, ry: 0.14, count: 15, angle: 0, faint: true },
  ];
  let width = 0;
  let height = 0;
  let dots = [];
  const pointer = { x: -1000, y: -1000 };
  let frame = 0;

  function gaussian() {
    let u = 0;
    let v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  function layout() {
    const ratio = window.devicePixelRatio || 1;
    const box = heroCanvas.getBoundingClientRect();
    width = box.width;
    height = box.height;
    heroCanvas.width = Math.max(1, Math.floor(width * ratio));
    heroCanvas.height = Math.max(1, Math.floor(height * ratio));
    heroContext.setTransform(ratio, 0, 0, ratio, 0, 0);
    dots = [];
    for (const cluster of clusters) {
      for (let index = 0; index < cluster.count; index += 1) {
        const spreadX = gaussian() * cluster.rx * width * 0.5;
        const spreadY = gaussian() * cluster.ry * height * 0.5;
        const cos = Math.cos(cluster.angle);
        const sin = Math.sin(cluster.angle);
        const x = cluster.cx * width + spreadX * cos - spreadY * sin;
        const y = cluster.cy * height + spreadX * sin + spreadY * cos;
        dots.push({
          x,
          y,
          homeX: x,
          homeY: y,
          vx: 0,
          vy: 0,
          radius: Math.random() * 1.8 + 1.2,
          color: cluster.color,
          opacity: cluster.faint ? 0.12 : 0.2 + Math.random() * 0.3,
        });
      }
    }
  }

  function draw(settle) {
    heroContext.clearRect(0, 0, width, height);
    for (const dot of dots) {
      if (!settle) {
        dot.vx += (dot.homeX - dot.x) * 0.003;
        dot.vy += (dot.homeY - dot.y) * 0.003;
        dot.vx += (Math.random() - 0.5) * 0.08;
        dot.vy += (Math.random() - 0.5) * 0.08;
        const dx = dot.x - pointer.x;
        const dy = dot.y - pointer.y;
        const distance = Math.hypot(dx, dy);
        if (distance > 0 && distance < 120) {
          const force = (120 - distance) / 120;
          dot.vx += (dx / distance) * force * 0.5;
          dot.vy += (dy / distance) * force * 0.5;
        }
        dot.vx *= 0.94;
        dot.vy *= 0.94;
        dot.x += dot.vx;
        dot.y += dot.vy;
      }
      heroContext.beginPath();
      heroContext.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
      const [red, green, blue] = dot.color;
      heroContext.fillStyle = `rgba(${red}, ${green}, ${blue}, ${dot.opacity})`;
      heroContext.fill();
    }
  }

  function tick() {
    draw(false);
    if (!reduceMotion.matches) frame = requestAnimationFrame(tick);
  }

  const hero = heroCanvas.closest('.hero');
  if (hero) {
    hero.addEventListener('mousemove', event => {
      const box = heroCanvas.getBoundingClientRect();
      pointer.x = event.clientX - box.left;
      pointer.y = event.clientY - box.top;
    });
    hero.addEventListener('mouseleave', () => {
      pointer.x = -1000;
      pointer.y = -1000;
    });
  }

  window.addEventListener('resize', () => {
    layout();
    if (reduceMotion.matches) draw(true);
  });
  reduceMotion.addEventListener('change', () => {
    cancelAnimationFrame(frame);
    if (reduceMotion.matches) draw(true);
    else tick();
  });

  layout();
  if (reduceMotion.matches) draw(true);
  else tick();
}
