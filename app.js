(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const phone = '+1 (983) 777-9229';
  const canAnimate = () => !reducedMotion.matches && !document.documentElement.classList.contains('motion-paused');
  const motion = window.Motion;
  let lenis;
  const animationControls = new Set();
  let stopReveal;
  let enterAnimation;
  const icon = (id, extra = '') => `<svg class="icon ${extra}" aria-hidden="true"><use href="#i-${id}"/></svg>`;

  function animate(target, frames, options) {
    const control = motion.animate(target, frames, options);
    animationControls.add(control);
    Promise.resolve(control).then(() => animationControls.delete(control), () => animationControls.delete(control));
    return control;
  }
  function setupMotion(enter = true) {
    if (!canAnimate()) return;
    if (window.Lenis) lenis = new window.Lenis({ autoRaf: true, duration: 1.05, smoothWheel: true, syncTouch: false, anchors: { offset: 0 } });
    if (!motion) return;
    if (enter) enterAnimation = animate('[data-enter]', { opacity: [0, 1], y: [18, 0] }, { duration: .85, delay: motion.stagger(.095), ease: [.16, 1, .3, 1] });
    stopReveal = motion.inView('[data-reveal]', (element) => {
      animate(element, { opacity: [0, 1], y: [25, 0] }, { duration: .85, ease: [.16, 1, .3, 1] });
    }, { amount: .12, margin: '0px 0px -20px 0px' });

  }
  function stopMotion() {
    lenis?.destroy(); lenis = undefined;
    stopReveal?.(); stopReveal = undefined;
    enterAnimation?.complete(); enterAnimation = undefined;
    animationControls.forEach(control => control.complete());
    animationControls.clear();
    $$('[data-reveal], [data-enter]').forEach(element => { element.style.opacity = '1'; element.style.transform = ''; });
  }
  document.addEventListener('raygents:motion', () => { stopMotion(); setupMotion(false); });
  setupMotion();
  reducedMotion.addEventListener('change', () => { stopMotion(); if (!reducedMotion.matches) setupMotion(false); });
  document.addEventListener('visibilitychange', () => {
    const isHidden = document.hidden;
    animationControls.forEach(control => isHidden ? control.pause() : control.play());
    if (isHidden) { lenis?.stop(); stopAudio(); } else if (!$$('dialog').some(dialog => dialog.open)) lenis?.start();
  });
  let scrollScheduled = false;
  addEventListener('scroll', () => {
    if (scrollScheduled) return;
    scrollScheduled = true;
    requestAnimationFrame(() => { $('#header').classList.toggle('scrolled', scrollY > 35); scrollScheduled = false; });
  }, { passive: true });
  $('#header').classList.toggle('scrolled', scrollY > 35);
  const menuToggle = $('#menu-toggle');
  const mobileNav = $('#mobile-nav');
  function closeMenu() { mobileNav.hidden = true; menuToggle.setAttribute('aria-expanded', 'false'); menuToggle.setAttribute('aria-label', 'Open navigation'); }
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    mobileNav.hidden = !open;
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  $$('#mobile-nav a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !mobileNav.hidden) { closeMenu(); menuToggle.focus(); } });
  document.addEventListener('click', event => { if (!$('#header').contains(event.target)) closeMenu(); });
  matchMedia('(min-width: 681px)').addEventListener('change', closeMenu);
  $('#year').textContent = new Date().getFullYear();

  const scenarios = {
    book: {
      messages: [
        ['agent', "Thanks for calling. I'm the team's AI receptionist. How can I help?"],
        ['user', "Our AC isn't cooling. Can I book a service visit?"],
        ['agent', "I can help. What’s the service address, and is tomorrow afternoon a good time?"],
        ['user', "214 Oak Street. Tomorrow afternoon works."],
        ['agent', "That’s in the service area. I’ve booked the available 2 PM visit and added your cooling issue to the appointment notes."]
      ],
      result: 'Example outcome: HVAC visit booked · Tomorrow, 2 PM'
    },
    reschedule: {
      messages: [
        ['agent', "Hi, I'm the team's AI receptionist. What can I help you with?"],
        ['user', "Can we move Friday's site walk to Monday? Our superintendent can meet then."],
        ['agent', "I’ll verify the existing appointment first. Is this the Oak Street build-out?"],
        ['user', "Yes. Monday morning would be ideal."],
        ['agent', "The estimator has 10 AM available. I’ve moved the site walk to Monday and updated the visit details for your team."]
      ],
      result: 'Example outcome: site walk rescheduled · Monday, 10 AM'
    },
    question: {
      messages: [
        ['agent', "Thanks for calling. I'm the team's AI receptionist. How can I help?"],
        ['user', "I manage a warehouse and need an estimate for a roof replacement."],
        ['agent', "What’s the property address and approximate roof size?"],
        ['user', "480 Industrial Way. About 20,000 square feet. Wednesday morning works for an inspection."],
        ['agent', "I’ve booked the available 10:30 AM inspection. Your estimator will have the property details and replacement request in your CRM."]
      ],
      result: 'Example outcome: roof inspection booked · Wednesday, 10:30 AM'
    }
  };
  let currentScenario = 'book';
  let speaking = false;
  function stopAudio() {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    speaking = false;
    $('#hear-sample').innerHTML = '<span class="play-circle">' + icon('play') + '</span><span>Play sample audio</span>';
    $('#hear-sample').setAttribute('aria-label', 'Play sample audio');
  }
  function renderScenario(key, withMotion = true) {
    stopAudio(); currentScenario = key;
    $('#audio-status').textContent = '';
    $$('.segmented-control button').forEach(button => { const active = button.dataset.scenario === key; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active)); });
    $('#transcript').replaceChildren(...scenarios[key].messages.map(([role, content]) => {
      const bubble = document.createElement('div'); bubble.className = 'message' + (role === 'user' ? ' user-message' : '');
      const label = document.createElement('span'); label.className = 'message-label'; label.textContent = role === 'agent' ? 'AI RECEPTIONIST' : 'CUSTOMER';
      bubble.append(label, document.createTextNode(content)); return bubble;
    }));
    $('#transcript').scrollTop = 0;
    $('#demo-result span').textContent = scenarios[key].result;
    if (withMotion && motion && canAnimate()) animate('#transcript .message', { opacity: [0, 1], y: [7, 0] }, { duration: .45, delay: motion.stagger(.08), ease: [.16, 1, .3, 1] });
  }
  $$('[data-scenario]').forEach(button => button.addEventListener('click', () => renderScenario(button.dataset.scenario)));
  renderScenario('book', false);
  $('#hear-sample').addEventListener('click', () => {
    if (speaking) { stopAudio(); $('#audio-status').textContent = 'Sample stopped.'; return; }
    if (!('speechSynthesis' in window)) { $('#audio-status').textContent = 'Your browser does not support sample audio. You can read the conversation above.'; return; }
    const utterance = new SpeechSynthesisUtterance(scenarios[currentScenario].messages.map(([, content]) => content).join(' '));
    const voices = window.speechSynthesis.getVoices();
    utterance.voice = voices.find(voice => voice.lang === 'en-US' && voice.localService) || voices.find(voice => voice.lang === 'en-US') || null;
    utterance.lang = 'en-US'; utterance.rate = .97; utterance.pitch = 1;
    utterance.onend = () => { stopAudio(); $('#audio-status').textContent = 'Sample complete. This is browser-generated audio, illustrating the conversation.'; };
    utterance.onerror = event => { if (event.error !== 'interrupted' && event.error !== 'canceled') { stopAudio(); $('#audio-status').textContent = 'Sample audio is unavailable in this browser. Read the conversation above.'; } };
    speaking = true;
    $('#hear-sample').innerHTML = '<span class="play-circle">■</span><span>Stop sample</span>';
    $('#hear-sample').setAttribute('aria-label', 'Stop sample audio');
    $('#audio-status').textContent = 'Playing illustrative audio using your browser voice. This is not a live agent.';
    window.speechSynthesis.speak(utterance);
  });

  const sectors = {
    hvac: { tag: 'HVAC', title: 'You’re on a call.<br> Your next one is ringing.', description: 'Capture the service address and equipment concern, check your coverage, and help arrange a visit while your technicians focus on the job.', steps: ['An HVAC service request comes in', 'Service area and availability are checked', 'The visit and job details reach your team'] },
    roofing: { tag: 'COMMERCIAL ROOFING', title: 'From a roof inquiry.<br> To a qualified site visit.', description: 'Collect the property type, location, and repair or replacement scope. Book an inspection with your estimator and pass the request into your existing CRM through a supported integration.', steps: ['A property manager requests an estimate', 'A roof inspection is arranged', 'The visit and scope reach your existing CRM'] },
    construction: { tag: 'CONSTRUCTION', title: 'Keep the build moving.<br> And the next visit booked.', description: 'Answer new project inquiries, gather the scope and timing, and book site walks around your team’s availability. Send the details to the tools your office already uses.', steps: ['A new project inquiry comes in', 'Scope is captured and a site walk arranged', 'Your team receives the booking and project details'] },
    trades: { tag: 'OTHER TRADES', title: 'Your trade. Your rules.<br> A better way to work.', description: 'Plumbing, electrical, and other service trades have their own coverage areas and scheduling rules. Configure your agent to answer calls and book visits around the way your crew actually works.', steps: ['A customer calls about a job', 'Your coverage and scheduling rules guide the visit', 'The request reaches your office with context'] }
  };
  $$('[data-sector]').forEach(button => button.addEventListener('click', () => {
    const sector = sectors[button.dataset.sector];
    $$('[data-sector]').forEach(other => { const active = other === button; other.classList.toggle('active', active); other.setAttribute('aria-pressed', String(active)); });
    $('#sector-tag').textContent = sector.tag; $('#sector-title').innerHTML = sector.title; $('#sector-description').textContent = sector.description;
    ['one', 'two', 'three'].forEach((id, index) => { $(`#workflow-${id}`).textContent = sector.steps[index]; });
    if (motion && canAnimate()) animate('.sector-story-copy, .sector-workflow', { opacity: [.3, 1], y: [7, 0] }, { duration: .45, ease: [.16, 1, .3, 1] });
  }));

  $$('.faq-list details').forEach(details => details.addEventListener('toggle', () => { if (details.open) $$('.faq-list details').forEach(other => { if (other !== details) other.open = false; }); }));
  const contact = $('#contact-dialog');
  const privacy = $('#privacy-dialog');
  let previousFocus;
  function openDialog(dialog) {
    stopAudio(); closeMenu(); previousFocus = document.activeElement;
    lenis?.stop(); dialog.showModal();
    if (motion && canAnimate()) animate(dialog, { opacity: [0, 1], y: [12, 0] }, { duration: .3, ease: [.16, 1, .3, 1] });
  }
  $$('[data-plan]').forEach(button => button.addEventListener('click', () => openDialog(contact)));
  $('#privacy-button').addEventListener('click', () => openDialog(privacy));
  $$('dialog').forEach(dialog => {
    $$('[data-close]', dialog).forEach(button => button.addEventListener('click', () => dialog.close()));
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      if (!$$('dialog').some(other => other.open)) lenis?.start();
      previousFocus?.focus({ preventScroll: true });
    });
  });
  let briefData;
  const form = $('#contact-form');
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const fields = Object.fromEntries(new FormData(form));
    briefData = Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, value.trim()]));
    const summary = $('#plan-summary');
    summary.replaceChildren();
    const entries = [['Your trade', briefData.trade], ['Main priority', briefData.service], ['Current tools', briefData.crm || 'To discuss on our call']];
    if (briefData.message) entries.push(['Also to cover', briefData.message]);
    entries.forEach(([label, value]) => {
      const term = document.createElement('dt'); term.textContent = label;
      const detail = document.createElement('dd'); detail.textContent = value;
      summary.append(term, detail);
    });
    form.hidden = true; $('#contact-intro').hidden = true; $('#form-success').hidden = false;
    contact.scrollTop = 0; $('#plan-success-title').focus();
  });
  $('#download-brief').addEventListener('click', () => {
    if (!briefData) return;
    const text = `RAYGENTS AI — YOUR CALL PLAN\n\nCall Raygents: ${phone}\n\nTrade: ${briefData.trade}\nMain priority: ${briefData.service}\nCRM / scheduling tool: ${briefData.crm || 'To discuss'}\n\nAlso to cover:\n${briefData.message || 'No additional notes.'}\n\nOn our call, we can review:\n- Your service area and visit types\n- Booking rules and available time slots\n- CRM and calendar compatibility\n- Human handoffs and after-hours coverage\n\nThis plan was created on your device. Nothing was sent to Raygents.\n`;
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'raygents-call-plan.txt';
    document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  $('#edit-brief').addEventListener('click', () => {
    $('#form-success').hidden = true; form.hidden = false; $('#contact-intro').hidden = false;
    contact.scrollTop = 0; $('#plan-trade').focus();
  });
  $('#copy-number').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(phone);
      $('#copy-status').textContent = 'Number copied. Call us whenever you’re ready.';
    } catch {
      $('#copy-status').textContent = `You can call us at ${phone}.`;
    }
  });

  // Keep the call action available after the hero on small screens.
  const mobile = matchMedia('(max-width: 680px)');
  let heroPassed = false;
  let contactVisible = false;
  function updateCallbar() {
    const visible = mobile.matches && heroPassed && !contactVisible;
    $('#mobile-callbar').hidden = !visible;
    document.documentElement.classList.toggle('callbar-visible', visible);
  }
  const callbarObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.target.matches('.hero')) heroPassed = !entry.isIntersecting && entry.boundingClientRect.bottom <= 0;
      else contactVisible = entry.isIntersecting;
    });
    updateCallbar();
  });
  callbarObserver.observe($('.hero')); callbarObserver.observe($('#contact'));
  mobile.addEventListener('change', updateCallbar);

  // Arrow keys provide a predictable shortcut through each set of examples.
  ['.segmented-control', '.sector-controls'].forEach(selector => {
    const buttons = $$(`${selector} button`);
    buttons.forEach((button, index) => button.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
      buttons[next].focus(); buttons[next].click();
    }));
  });

  // Capability tiles play their one-time details as they arrive.
  document.documentElement.classList.toggle('motion-ready', Boolean(motion) && !reducedMotion.matches);
  const tileObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-seen'); tileObserver.unobserve(entry.target);
  }), { threshold: .35 });
  $$('.bento-tile').forEach(tile => tileObserver.observe(tile));

  // A soft light follows the pointer across each tile.
  if (matchMedia('(pointer: fine)').matches) $$('.bento-tile').forEach(tile => tile.addEventListener('pointermove', event => {
    const bounds = tile.getBoundingClientRect();
    tile.style.setProperty('--mx', `${event.clientX - bounds.left}px`);
    tile.style.setProperty('--my', `${event.clientY - bounds.top}px`);
  }));

  // Highlight the section currently in view in the main navigation.
  const navLinks = $$('.desktop-nav a');
  const navObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => {
      if (link.getAttribute('href') === `#${entry.target.id}`) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }), { rootMargin: '-45% 0px -50% 0px' });
  $$('main > section').forEach(section => navObserver.observe(section));

  addEventListener('pagehide', () => { stopAudio(); stopMotion(); });
  addEventListener('pageshow', event => { if (event.persisted) setupMotion(false); });
})();
