/* Raygents: scroll-lit statement, hero depth, marine snow, call stream, and small interactive touches. */
(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(pointer: fine)');
  const calm = () => reduced.matches || root.classList.contains('motion-paused');
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

  // Split the statement into words; each lights up as the reader scrolls past it.
  const statement = $('[data-words]');
  const words = [];
  if (statement) {
    const split = (node, accent) => [...node.childNodes].forEach(child => {
      if (child.nodeType === Node.TEXT_NODE) {
        const fragment = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) { fragment.append(part); return; }
          const word = document.createElement('span');
          word.className = 'word' + (accent ? ' word-accent' : '');
          word.textContent = part;
          words.push(word); fragment.append(word);
        });
        child.replaceWith(fragment);
      } else if (child.nodeType === Node.ELEMENT_NODE) split(child, accent || child.tagName === 'EM');
    });
    split(statement, false);
  }

  const hero = $('.hero');
  const heroCopy = $('.hero-copy');
  const heroArt = $('.hero-art');
  let frame = 0;
  function render() {
    frame = 0;
    const vh = innerHeight;
    if (statement) {
      if (calm()) words.forEach(word => word.classList.add('is-lit'));
      else {
        const bounds = statement.getBoundingClientRect();
        const progress = clamp((vh * .82 - bounds.top) / (bounds.height + vh * .3));
        const lit = Math.round(progress * words.length);
        words.forEach((word, index) => word.classList.toggle('is-lit', index < lit));
      }
    }
    if (hero && heroCopy) {
      const passed = calm() ? 0 : clamp(scrollY / hero.offsetHeight);
      heroCopy.style.translate = passed ? `0 ${passed * 90}px` : '';
      heroCopy.style.opacity = passed ? String(1 - passed * 1.15) : '';
      if (heroArt) heroArt.style.translate = passed ? `0 ${passed * 40}px` : '';
    }
  }
  const schedule = () => { if (!frame) frame = requestAnimationFrame(render); };
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  document.addEventListener('raygents:motion', schedule);
  reduced.addEventListener('change', schedule);
  render();

  // Marine snow: a few slow particles drifting through the deep sections.
  $$('.sea-snow').forEach(layer => {
    const count = innerWidth < 680 ? 14 : 26;
    for (let i = 0; i < count; i += 1) {
      const flake = document.createElement('i');
      flake.style.setProperty('--x', `${Math.random() * 100}%`);
      flake.style.setProperty('--s', `${1 + Math.random() * 2.4}px`);
      flake.style.setProperty('--d', `${14 + Math.random() * 18}s`);
      flake.style.setProperty('--delay', `${-Math.random() * 30}s`);
      flake.style.setProperty('--drift', `${(Math.random() - .5) * 60}px`);
      flake.style.setProperty('--o', String(.18 + Math.random() * .4));
      layer.append(flake);
    }
  });

  // The call stream loops seamlessly: each track is followed by a hidden copy of itself.
  $$('.call-track').forEach(track => {
    const copy = track.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    track.after(copy);
  });

  // The hero call card cycles through a call's life.
  const live = $('.signal-live');
  if (live) {
    const states = live.dataset.live.split('|');
    let state = 0;
    setInterval(() => {
      if (calm() || document.hidden || hero.classList.contains('motion-outside')) return;
      live.classList.add('is-changing');
      setTimeout(() => {
        state = (state + 1) % states.length;
        live.textContent = states[state];
        live.classList.remove('is-changing');
      }, 320);
    }, 2800);
  }

  // Primary buttons lean gently toward the pointer.
  if (finePointer.matches) $$('.hero-buttons .button, .contact-actions .button').forEach(button => {
    button.addEventListener('pointermove', event => {
      if (calm()) return;
      const bounds = button.getBoundingClientRect();
      const x = (event.clientX - bounds.left - bounds.width / 2) * .22;
      const y = (event.clientY - bounds.top - bounds.height / 2) * .3;
      button.style.translate = `${x}px ${y}px`;
    });
    button.addEventListener('pointerleave', () => { button.style.translate = ''; });
  });
})();
