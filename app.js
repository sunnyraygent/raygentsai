/* Configure a real contact endpoint after the business details and privacy notice are ready.
   Set window.RAYGENTS_CONFIG = { contactEndpoint: 'https://your-server.example/inquiries' }
   before this script. Never put API keys in frontend configuration. */
(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const config = window.RAYGENTS_CONFIG || {};
  const motion = window.Motion;
  let lenis;
  let animationControls = [];
  let stopReveal;
  let enterAnimation;
  const icon = (id, extra = '') => `<svg class="icon ${extra}" aria-hidden="true"><use href="#i-${id}"/></svg>`;

  function setupMotion() {
    if (reducedMotion.matches || document.documentElement.classList.contains('motion-paused')) return;
    if (window.Lenis) lenis = new window.Lenis({ autoRaf: true, duration: 1.05, smoothWheel: true, syncTouch: false, anchors: { offset: 0 } });
    if (!motion) return;
    enterAnimation = motion.animate('[data-enter]', { opacity: [0, 1], y: [18, 0] }, { duration: .85, delay: motion.stagger(.095), ease: [.16, 1, .3, 1] });
    stopReveal = motion.inView('[data-reveal]', (element) => {
      const control = motion.animate(element, { opacity: [0, 1], y: [25, 0] }, { duration: .85, ease: [.16, 1, .3, 1] });
      animationControls.push(control);
    }, { amount: .12, margin: '0px 0px -20px 0px' });
    $$('[data-float]').forEach((element, index) => {
      const rotation = [-3, 3, -3][index];
      animationControls.push(motion.animate(element, { y: [0, index === 1 ? -7 : 7, 0], rotate: [rotation, rotation + .8, rotation] }, { duration: 6.2 + index, repeat: Infinity, ease: 'easeInOut' }));
    });
    const orb = $('.sphere-container');
    if (orb) animationControls.push(motion.animate(orb, { y: [0, -7, 0] }, { duration: 7, repeat: Infinity, ease: 'easeInOut' }));
  }
  function stopMotion() {
    lenis?.destroy(); lenis = undefined;
    stopReveal?.(); stopReveal = undefined;
    enterAnimation?.complete(); enterAnimation = undefined;
    animationControls.forEach(control => control.complete());
    animationControls = [];
    $$('[data-reveal], [data-enter]').forEach(element => { element.style.opacity = '1'; element.style.transform = ''; });
    $$('[data-float], .sphere-container').forEach(element => { element.style.transform = ''; });
  }
  document.addEventListener('raygents:motion', () => { stopMotion(); setupMotion(); });
  setupMotion();
  reducedMotion.addEventListener('change', () => { stopMotion(); if (!reducedMotion.matches) setupMotion(); });
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
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  document.addEventListener('click', event => { if (!$('#header').contains(event.target)) closeMenu(); });
  matchMedia('(min-width: 681px)').addEventListener('change', closeMenu);
  $('#year').textContent = new Date().getFullYear();

  const scenarios = {
    book: {
      messages: [
        ['agent', "Thanks for calling. I'm the team's AI receptionist. How can I help?"],
        ['user', "Our AC isn't cooling. Can I book a service visit?"],
        ['agent', "I can check the service area and available visits. What's the property ZIP code and the best number to reach you?"]
      ],
      result: 'Example workflow: check coverage → schedule service'
    },
    reschedule: {
      messages: [
        ['agent', "Hi, I'm the team's AI receptionist. What can I help you with?"],
        ['user', "Can we move Friday's site walk to Monday? Our superintendent can meet then."],
        ['agent', "I can help with that. I'll confirm the project details and check the estimator's availability before changing the visit."]
      ],
      result: 'Example workflow: verify details → reschedule site walk'
    },
    question: {
      messages: [
        ['agent', "Thanks for calling. I'm the team's AI receptionist. How can I help?"],
        ['user', "I manage a warehouse and need an estimate for a roof replacement."],
        ['agent', "What's the property address and approximate roof size? I can capture the scope and help arrange an inspection with an estimator."]
      ],
      result: 'Example workflow: capture scope → arrange roof inspection'
    }
  };
  let currentScenario = 'book';
  let speaking = false;
  function stopAudio() {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    speaking = false;
    $('#hear-sample').innerHTML = '<span class="play-circle">' + icon('play') + '</span><span>Hear this sample</span>';
    $('#hear-sample').setAttribute('aria-label', 'Hear this sample');
  }
  function renderScenario(key, animate = true) {
    stopAudio(); currentScenario = key;
    $('#audio-status').textContent = '';
    $$('.segmented-control button').forEach(button => { const active = button.dataset.scenario === key; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active)); });
    $('#transcript').replaceChildren(...scenarios[key].messages.map(([role, content]) => {
      const bubble = document.createElement('div'); bubble.className = 'message' + (role === 'user' ? ' user-message' : '');
      const label = document.createElement('span'); label.className = 'message-label'; label.textContent = role === 'agent' ? 'AI RECEPTIONIST' : 'CUSTOMER';
      bubble.append(label, document.createTextNode(content)); return bubble;
    }));
    $('#demo-result span').textContent = scenarios[key].result;
    if (animate && motion && !reducedMotion.matches) motion.animate('#transcript .message', { opacity: [0, 1], y: [7, 0] }, { duration: .45, delay: motion.stagger(.08), ease: [.16, 1, .3, 1] });
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

  const people = [
    { initials: 'JL', name: 'Jordan Lee', context: 'Commercial roof inspection', time: 'Wed, 10:30 AM', source: 'AI receptionist', status: 'Visit booked', color: '', scheduled: true, nextStep: 'Confirm site access' },
    { initials: 'AM', name: 'Alex Morgan', context: 'HVAC service request', time: 'Fri, 2:00 PM', source: 'AI receptionist', status: 'Visit booked', color: 'purple', scheduled: true, nextStep: 'Confirm service details' },
    { initials: 'SR', name: 'Sam Rivera', context: 'Tenant build-out estimate', time: 'Awaiting reply', source: 'Your estimator', status: 'Estimate sent', color: 'green', scheduled: false, nextStep: 'Follow up on the estimate' }
  ];
  const metrics = () => '<div class="workspace-metrics"><div class="metric"><span>Opportunities</span><b>3</b><small>Sample inquiries</small></div><div class="metric"><span>Site visits</span><b>2</b><small>Sample bookings</small></div><div class="metric"><span>Open estimates</span><b>1</b><small>Awaiting a reply</small></div></div>';
  function table(mode = 'overview') {
    const title = mode === 'contacts' ? 'The people behind each project' : mode === 'appointments' ? 'Upcoming service and site visits' : 'From inquiry to opportunity';
    const rows = mode === 'appointments' ? people.filter(person => person.scheduled) : people;
    return `<div class="workspace-table-header"><h4>${title}</h4><span>Illustrative data</span></div><table class="workspace-table"><caption class="visually-hidden">${title} — sample records</caption><thead><tr><th scope="col">CONTACT / PROJECT</th><th scope="col">${mode === 'contacts' ? 'NEXT STEP' : 'VISIT / UPDATE'}</th><th scope="col" class="hide-mobile">SOURCE</th><th scope="col">STATUS</th></tr></thead><tbody>${rows.map(person => `<tr><td><span class="contact-cell"><span class="avatar ${person.color ? `avatar-${person.color}` : ''}">${person.initials}</span><span><strong>${person.name}</strong><small>${person.context}</small></span></span></td><td>${mode === 'contacts' ? person.nextStep : person.time}</td><td class="hide-mobile">${person.source}</td><td><span class="table-badge ${person.color}">${person.status}</span></td></tr>`).join('')}</tbody></table>`;
  }
  const workspaceViews = {
    overview: { title: 'Keep the next job moving.', description: 'Your calls, visits, and estimates in one place.', overline: 'FROM FIRST CALL TO FOLLOW-UP.', content: () => metrics() + table(), copilot: 'You have 3 next steps ready for your team to review.' },
    contacts: { title: 'Every contact. Every project.', description: 'Keep property details and conversations connected.', overline: 'THE RIGHT CONTEXT FOR YOUR OFFICE AND CREW.', content: () => metrics() + table('contacts'), copilot: 'Jordan’s roof inspection is booked. Confirm site access with the property manager.' },
    appointments: { title: 'Know where the day is going.', description: 'Service calls and site walks, on the same page.', overline: 'THE OFFICE AND THE FIELD, CONNECTED.', content: () => '<div class="workspace-metrics"><div class="metric"><span>Visits booked</span><b>2</b><small>Sample schedule</small></div><div class="metric"><span>Trades covered</span><b>2</b><small>Roofing + HVAC</small></div><div class="metric"><span>Next visit</span><b>10:30</b><small>AM · Roof inspection</small></div></div>' + table('appointments'), copilot: 'Confirm the roof inspection’s access details before sending a visit reminder.' },
    followups: { title: 'Keep estimates moving.', description: 'Sample next steps for your office and estimators to review.', overline: 'YOUR AI COPILOT, AT YOUR SIDE.', content: () => '<div class="workspace-table-header"><h4>Suggested next steps</h4><span>Illustrative data</span></div><div class="followup-list">' + people.map((person, index) => `<div class="followup-item"><span class="avatar ${person.color ? `avatar-${person.color}` : ''}">${person.initials}</span><span><strong>${person.name}</strong>${['Confirm roof access and the property contact.', 'Review the service address and equipment notes.', 'Follow up on the tenant build-out estimate.'][index]}</span><span class="table-badge ${person.color}">For review</span></div>`).join('') + '</div>', copilot: 'Your team reviews every suggestion before taking action.' }
  };
  let currentWorkspace = 'overview';
  function renderWorkspace(key) {
    currentWorkspace = key;
    const view = workspaceViews[key];
    $$('[data-workspace]').forEach(button => { const active = button.dataset.workspace === key || (key === 'followups' && button.dataset.workspace === 'contacts'); button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active)); });
    $('#workspace-title').textContent = view.title; $('#workspace-description').textContent = view.description; $('#workspace-overline').textContent = view.overline;
    $('#workspace-content').innerHTML = view.content(); $('#copilot-text').textContent = view.copilot;
    $('#copilot-button').innerHTML = (key === 'followups' ? 'Back to overview' : 'Take a look') + icon('arrow');
    if (motion && !reducedMotion.matches && !document.documentElement.classList.contains('motion-paused')) motion.animate('#workspace-content', { opacity: [.4, 1], y: [5, 0] }, { duration: .4, ease: [.16, 1, .3, 1] });
  }
  $$('[data-workspace]').forEach(button => button.addEventListener('click', () => renderWorkspace(button.dataset.workspace)));
  $('#copilot-button').addEventListener('click', () => renderWorkspace(currentWorkspace === 'followups' ? 'overview' : 'followups'));
  renderWorkspace('overview');

  const sectors = {
    hvac: { tag: 'HVAC', title: 'You’re on a call.<br> Your next one is ringing.', description: 'Capture the service address and equipment concern, check your coverage, and help arrange a visit while your technicians focus on the job.', steps: ['An HVAC service request comes in', 'Service area and availability are checked', 'The visit and job details reach your team'] },
    roofing: { tag: 'COMMERCIAL ROOFING', title: 'From a roof inquiry.<br> To a qualified site visit.', description: 'Collect the property type, location, and repair or replacement scope. Coordinate an inspection with your estimator and keep the opportunity moving through your bid pipeline.', steps: ['A property manager requests an estimate', 'A roof inspection is arranged', 'Scope and next steps enter your bid pipeline'] },
    construction: { tag: 'CONSTRUCTION', title: 'Keep the build moving.<br> And the pipeline, too.', description: 'Capture new project inquiries, gather the scope and timing, and coordinate site walks. Give your office a clear view of open estimates while your team runs the build.', steps: ['A new project inquiry comes in', 'Scope is captured and a site walk arranged', 'The estimate and follow-up stay connected'] },
    trades: { tag: 'OTHER TRADES', title: 'Your trade. Your rules.<br> A better way to work.', description: 'Plumbing, electrical, and other service trades have their own coverage areas and scheduling rules. Build call handling and follow-ups around the way your crew actually works.', steps: ['A customer calls about a job', 'Your coverage and scheduling rules guide the visit', 'The request reaches your office with context'] }
  };
  $$('[data-sector]').forEach(button => button.addEventListener('click', () => {
    const sector = sectors[button.dataset.sector];
    $$('[data-sector]').forEach(other => { const active = other === button; other.classList.toggle('active', active); other.setAttribute('aria-pressed', String(active)); });
    $('#sector-tag').textContent = sector.tag; $('#sector-title').innerHTML = sector.title; $('#sector-description').textContent = sector.description;
    ['one', 'two', 'three'].forEach((id, index) => { $(`#workflow-${id}`).textContent = sector.steps[index]; });
    if (motion && !reducedMotion.matches && !document.documentElement.classList.contains('motion-paused')) motion.animate('.sector-story-copy, .sector-workflow', { opacity: [.3, 1], y: [7, 0] }, { duration: .45, ease: [.16, 1, .3, 1] });
  }));

  $$('.faq-list details').forEach(details => details.addEventListener('toggle', () => { if (details.open) $$('.faq-list details').forEach(other => { if (other !== details) other.open = false; }); }));
  const contact = $('#contact-dialog');
  const privacy = $('#privacy-dialog');
  let previousFocus;
  function openDialog(dialog) { stopAudio(); closeMenu(); previousFocus = document.activeElement; lenis?.stop(); dialog.showModal(); if (motion && !reducedMotion.matches && !document.documentElement.classList.contains('motion-paused')) motion.animate(dialog, { opacity: [0, 1], y: [12, 0], scale: [.98, 1] }, { duration: .35, ease: [.16, 1, .3, 1] }); }
  $$('[data-contact]').forEach(button => button.addEventListener('click', () => openDialog(contact)));
  $('#privacy-button').addEventListener('click', () => openDialog(privacy));
  $$('dialog').forEach(dialog => {
    $$('[data-close]', dialog).forEach(button => button.addEventListener('click', () => dialog.close()));
    dialog.addEventListener('click', event => { if (event.target !== dialog) return; const bounds = dialog.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close(); });
    dialog.addEventListener('close', () => { if (!$$('dialog').some(other => other.open)) lenis?.start(); previousFocus?.focus({ preventScroll: true }); });
  });
  let briefData;
  const form = $('#contact-form');
  const submit = $('#form-submit');
  if (config.contactEndpoint) {
    submit.innerHTML = 'Send project inquiry ' + icon('arrow');
    $('#form-note').textContent = 'Your details will be sent to the business to respond to this inquiry. Please review its published privacy notice before sending.';
  }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const fields = Object.fromEntries(new FormData(form));
    briefData = { ...fields, created: new Date().toISOString(), brand: 'Raygents AI' };
    $('#form-error').textContent = '';
    if (config.contactEndpoint) {
      submit.disabled = true; submit.textContent = 'Sending your inquiry…';
      try {
        const response = await fetch(config.contactEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(briefData), signal: AbortSignal.timeout(15000) });
        if (!response.ok) throw new Error('The inquiry could not be sent');
        $('#success-text').textContent = 'Your inquiry has been sent. You can also download a copy of your project brief below.';
      } catch {
        $('#form-error').textContent = 'Your inquiry could not be sent. Please try again. Your details are still here.';
        submit.disabled = false; submit.innerHTML = 'Send project inquiry ' + icon('arrow'); return;
      }
      submit.disabled = false; submit.innerHTML = 'Send project inquiry ' + icon('arrow');
    }
    form.hidden = true; $('#contact-intro').hidden = true; $('#form-success').hidden = false; $('#download-brief').focus();
  });
  $('#download-brief').addEventListener('click', () => {
    if (!briefData) return;
    const text = `RAYGENTS AI — PROJECT BRIEF\n\nName: ${briefData.name}\nWork email: ${briefData.email}\nBusiness: ${briefData.company}\nTrade: ${briefData.trade}\nInterested in: ${briefData.service}\n\nWhat would improve the workflow?\n${briefData.message}\n\nCreated: ${new Date(briefData.created).toLocaleString('en-US')}\n\n${config.contactEndpoint ? 'A copy of your project inquiry.' : 'Website preview: this brief was created on your device. Nothing was sent to the agency.'}\n`;
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'raygents-project-brief.txt'; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  $('#edit-brief').addEventListener('click', () => { $('#form-success').hidden = true; form.hidden = false; $('#contact-intro').hidden = false; $('input', form).focus(); });
  addEventListener('pagehide', () => { stopAudio(); stopMotion(); });
})();
