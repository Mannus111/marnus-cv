(function () {
  'use strict';
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mobile menu
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  const setMenu = open => {
    toggle.setAttribute('aria-expanded', open);
    links.classList.toggle('open', open);
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  links.addEventListener('click', e => { if (e.target.tagName === 'A') setMenu(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  if (still) return;

  // Hero: the layered stack follows the pointer and turns as you scroll
  const stack = document.getElementById('stack');
  const hero = document.querySelector('.hero');
  let mx = 0, my = 0;
  const drawStack = () => {
    const scroll = Math.min(window.scrollY / 600, 1);
    stack.style.transform =
      `rotateY(${-28 + mx * 18 + scroll * 40}deg) rotateX(${8 - my * 12 + scroll * 10}deg)`;
  };
  hero.addEventListener('pointermove', e => {
    mx = e.clientX / innerWidth - 0.5;
    my = e.clientY / innerHeight - 0.5;
    drawStack();
  });
  hero.addEventListener('pointerleave', () => { mx = my = 0; drawStack(); });
  window.addEventListener('scroll', drawStack, { passive: true });
  stack.addEventListener('animationend', () => { stack.style.animation = 'none'; drawStack(); });

  // Cards lean toward the pointer
  document.querySelectorAll('[data-tilt]').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateZ(6px)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
})();
