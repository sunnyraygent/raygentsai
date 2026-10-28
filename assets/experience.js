/* Motion direction and a bespoke, dependency-free WebGL sculpture. */
(() => {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const compact = matchMedia('(max-width: 680px)');
  const finePointer = matchMedia('(pointer: fine)');
  const root = document.documentElement;
  const toggle = $('#motion-toggle');
  let paused = false;
  const calm = () => reduced.matches || paused;
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  $$('.scene-wave i').forEach((bar, index) => bar.style.setProperty('--i', index));

  toggle.addEventListener('click', () => {
    paused = !paused;
    root.classList.toggle('motion-paused', paused);
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.setAttribute('aria-label', paused ? 'Resume animations' : 'Pause animations');
    $('.motion-toggle-label').textContent = paused ? 'Resume motion' : 'Pause motion';
    document.dispatchEvent(new Event('raygents:motion'));
    if (!paused) scheduleRender();
  });

  const story = $('#flow-story');
  const chapters = $$('[data-chapter]');
  const panels = $$('[data-panel]');
  const sceneProgress = $('.scene-progress i');
  const readProgress = $('.reading-progress span');
  let currentChapter = 0;
  let storyTop = 0;
  let storyTravel = 1;
  let scrollHeight = 1;
  let manualChapter = false;
  let scrollFrame = 0;
  const setChapter = (index) => {
    if (index === currentChapter) return;
    currentChapter = index;
    chapters.forEach((button, i) => {
      button.classList.toggle('active', i === index);
      button.setAttribute('aria-pressed', String(i === index));
    });
    panels.forEach((panel, i) => {
      panel.classList.toggle('is-active', i === index);
      panel.setAttribute('aria-hidden', String(i !== index));
      panel.inert = i !== index;
    });
    $('.scene-count').textContent = `0${index + 1} / 03`;
  };
  function measure() {
    storyTop = story.getBoundingClientRect().top + scrollY;
    storyTravel = Math.max(1, story.offsetHeight - innerHeight);
    scrollHeight = Math.max(1, root.scrollHeight - innerHeight);
    syncScroll();
  }
  function syncScroll() {
    scrollFrame = 0;
    const y = scrollY;
    readProgress.style.transform = `scaleX(${clamp(y / scrollHeight)})`;
    if (!compact.matches && !calm() && !manualChapter) {
      const progress = clamp((y - storyTop) / storyTravel);
      setChapter(Math.min(2, Math.floor(progress * 3)));
      sceneProgress.style.transform = `scaleX(${Math.max(.06, progress)})`;
    } else {
      sceneProgress.style.transform = `scaleX(${(currentChapter + 1) / 3})`;
    }
  }
  chapters.forEach((button, index) => button.addEventListener('click', () => {
    if (compact.matches || reduced.matches || paused) {
      manualChapter = true;
      setChapter(index);
      syncScroll();
    } else {
      manualChapter = false;
      window.scrollTo({ top: storyTop + storyTravel * ((index + .2) / 3), behavior: 'smooth' });
    }
  }));
  function scrollChanged() { if (!scrollFrame) scrollFrame = requestAnimationFrame(syncScroll); }
  addEventListener('scroll', scrollChanged, { passive: true });
  addEventListener('resize', measure, { passive: true });
  compact.addEventListener('change', () => { manualChapter = false; measure(); });
  reduced.addEventListener('change', () => { manualChapter = false; measure(); scheduleRender(); });
  addEventListener('load', measure, { once: true });
  measure();
  // Keyboard users can select chapters just like a standard segmented control.
  chapters.forEach((button, index) => button.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? 2 : (index + (['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : 2)) % 3;
    chapters[next].focus({ preventScroll: true });
    chapters[next].click();
  }));
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.target.classList.toggle('motion-outside', !entry.isIntersecting));
  }, { rootMargin: '100px' });
  $$('main > section').forEach(section => sectionObserver.observe(section));

  const art = $('.hero-art');
  const canvas = $('#flow-canvas');
  let gl;
  let program;
  let locations;
  let frame = 0;
  let visible = true;
  let lastFrame = 0;
  let clock = 0;
  let pointerX = 0;
  let pointerY = 0;
  let aimX = 0;
  let aimY = 0;
  let lost = false;
  // A small parametric mesh: flexible fins, a raised body, and a tapered tail.
  // Geometry stays on the GPU; only time and the eased viewing angle change.
  let vertexCount = 0;
  const vertex = `
    precision highp float;
    attribute vec4 parameter;
    uniform vec2 resolution;
    uniform float time;
    uniform vec2 pointer;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vSurface;
    varying float vSide;
    mat2 turn(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
    vec3 fin(float u,float v,float side){
      float a=abs(u);
      float front=.52+.18*exp(-pow((a-.12)/.048,2.))+.22*pow(a,3.);
      float back=-.76+1.50*pow(a,1.5);
      float y=mix(front,back,v);
      float breath=sin(time*.72+.5);
      float lift=(.30*breath+.10)*pow(a,1.65);
      float fold=.07*sin(v*3.14159)*sin(a*4.5-time*.72);
      float body=.115*exp(-u*u*18.);
      float thickness=(.044+body)*sin(v*3.14159)*pow(max(1.-a,0.),.35);
      return vec3(u*1.85,y,lift+fold+side*thickness);
    }
    vec3 orient(vec3 p){
      p.yz=turn(.37+pointer.y*.10)*p.yz;
      p.xz=turn(-.15+pointer.x*.16+sin(time*.18)*.06)*p.xz;
      p.xy=turn(.19+sin(time*.14)*.035)*p.xy;
      return p;
    }
    void main(){
      float u=parameter.x,v=parameter.y,side=parameter.z;
      vec3 p,n;
      if(parameter.w<.5){
        p=fin(u,v,side);
        vec3 du=fin(min(u+.002,1.),v,side)-fin(max(u-.002,-1.),v,side);
        vec3 dv=fin(u,min(v+.002,1.),side)-fin(u,max(v-.002,0.),side);
        n=normalize(cross(dv,du)+vec3(0.,0.,.0000001))*side;
      }else{
        float angle=v*6.28318;
        float radius=.026*pow(1.-u,1.3)+.001;
        float curve=.13*sin(u*2.9+time*.35)*u;
        p=vec3(curve+cos(angle)*radius,-.73-u*1.30,sin(angle)*radius+.065*sin(u*3.2+time*.35)*u);
        n=vec3(cos(angle),0.,sin(angle));
      }
      vSurface=vec2(u,v);
      vSide=side;
      n=orient(n);
      p=orient(p);
      p.y+=.23+sin(time*.30)*.035;
      vNormal=n;
      vPosition=p;
      float aspect=resolution.x/resolution.y;
      float scale=1.60*min(aspect,1.15);
      gl_Position=vec4(p.x*scale/aspect,p.y*scale,-p.z*.1,4.-p.z);
    }
  `;
  const fragment = `
    precision highp float;
    uniform float time;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vSurface;
    varying float vSide;
    void main(){
      vec3 n=normalize(vNormal);
      vec3 view=normalize(vec3(0.,0.,4.)-vPosition);
      if(dot(n,view)<0.)n=-n;
      vec3 light=normalize(vec3(-.6,1.1,1.5));
      float diffuse=max(dot(n,light),0.);
      float rim=pow(1.-max(dot(n,view),0.),2.5);
      vec3 reflected=reflect(-view,n);
      float softbox=pow(max(dot(reflected,normalize(vec3(-.6,1.,1.1))),0.),9.);
      float strip=pow(max(dot(reflected,normalize(vec3(.8,.25,1.))),0.),35.);
      float ridge=exp(-pow(vSurface.x*12.,2.));
      float edge=pow(abs(vSurface.x),2.);
      vec3 base=mix(vec3(.065,.17,.29),vec3(.19,.38,.55),diffuse);
      base=mix(base,vec3(.31,.49,.63),edge*.35);
      base+=vec3(.035,.065,.08)*ridge;
      float caustic=sin(vPosition.x*7.+vPosition.y*11.+time*.32+sin(vPosition.x*4.-time*.24));
      caustic=pow(max(caustic,0.),16.)*.035;
      vec3 color=base+vec3(.41,.58,.73)*softbox+vec3(.58,.76,.89)*strip;
      color+=vec3(.25,.53,.76)*rim+vec3(.2,.5,.7)*caustic;
      color=pow(color,vec3(.76));
      gl_FragColor=vec4(color,1.);
    }
  `;
  function createMantaMesh() {
    const points = [];
    function surface(columns, rows, side, kind) {
      const point = (x,y) => [kind ? x/columns : x/columns*2-1,y/rows,side,kind];
      for(let x=0;x<columns;x++) for(let y=0;y<rows;y++) {
        points.push(...point(x,y),...point(x+1,y),...point(x,y+1),
          ...point(x,y+1),...point(x+1,y),...point(x+1,y+1));
      }
    }
    surface(96,40,1,0); surface(96,40,-1,0); surface(48,10,1,1);
    vertexCount=points.length/4;
    return new Float32Array(points);
  }
  function compile(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source); gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { gl.deleteShader(shader); return null; }
    return shader;
  }
  function initialize() {
    try {
      gl = canvas.getContext('webgl', { alpha: true, antialias: true, depth: true, stencil: false, powerPreference: 'low-power', premultipliedAlpha: false });
      if (!gl) return;
      const vs = compile(gl.VERTEX_SHADER, vertex), fs = compile(gl.FRAGMENT_SHADER, fragment);
      if (!vs || !fs) return;
      program = gl.createProgram(); gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
      gl.deleteShader(vs); gl.deleteShader(fs);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
      gl.useProgram(program);
      const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, createMantaMesh(), gl.STATIC_DRAW);
      const position = gl.getAttribLocation(program, 'parameter'); gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 4, gl.FLOAT, false, 0, 0);
      locations = { resolution: gl.getUniformLocation(program,'resolution'), time: gl.getUniformLocation(program,'time'), pointer: gl.getUniformLocation(program,'pointer') };
      gl.clearColor(0,0,0,0);
      gl.enable(gl.DEPTH_TEST);
      canvas.dataset.renderer = 'webgl';
      art.classList.add('has-webgl');
      resizeCanvas();
    } catch { canvas.dataset.renderer = 'fallback'; }
  }
  function resizeCanvas() {
    if (!gl || !locations || lost) return;
    const bounds = canvas.getBoundingClientRect();
    const pixelRatio = Math.min(Math.max(devicePixelRatio || 1, 1.35), 1.5);
    canvas.width = Math.min(1200, Math.round(bounds.width * pixelRatio));
    canvas.height = Math.min(1200, Math.round(bounds.height * pixelRatio));
    gl.viewport(0,0,canvas.width,canvas.height);
    draw(); scheduleRender();
  }
  function draw() {
    if (!gl || !locations || lost) return;
    gl.uniform2f(locations.resolution, canvas.width, canvas.height);
    gl.uniform1f(locations.time, clock);
    gl.uniform2f(locations.pointer, pointerX, pointerY);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
  }
  function tick(timestamp) {
    frame = 0;
    if (!visible || document.hidden || lost || !locations) { lastFrame = 0; return; }
    const delta = lastFrame ? Math.min((timestamp - lastFrame) / 1000,.05) : 0;
    if (!calm()) clock += delta;
    lastFrame = timestamp;
    pointerX += (aimX-pointerX)*.045;
    pointerY += (aimY-pointerY)*.045;
    draw();
    if (!calm()) frame = requestAnimationFrame(tick);
  }
  function scheduleRender() {
    if (!frame && visible && !document.hidden && locations && !lost) frame = requestAnimationFrame(tick);
  }
  initialize();
  const artObserver = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (visible) scheduleRender();
    else { cancelAnimationFrame(frame); frame = 0; lastFrame = 0; }
  }, { rootMargin: '40px' });
  artObserver.observe(art);
  const sizeObserver = new ResizeObserver(resizeCanvas); sizeObserver.observe(art);
  art.addEventListener('pointermove', event => {
    if (!finePointer.matches || calm()) return;
    const bounds = art.getBoundingClientRect();
    aimX = ((event.clientX-bounds.left)/bounds.width-.5)*2;
    aimY = ((event.clientY-bounds.top)/bounds.height-.5)*2;
  });
  art.addEventListener('pointerleave', () => { aimX = 0; aimY = 0; });
  document.addEventListener('visibilitychange', () => {
    lastFrame = 0;
    if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else scheduleRender();
  });
  canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); lost = true; cancelAnimationFrame(frame); frame = 0; art.classList.remove('has-webgl'); });
  canvas.addEventListener('webglcontextrestored', () => { lost = false; initialize(); scheduleRender(); });
  addEventListener('pagehide', () => { cancelAnimationFrame(frame); frame = 0; });
  addEventListener('pageshow', event => { if (event.persisted) scheduleRender(); });
})();
