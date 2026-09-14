// Tabular clock counter
(() => {
  const started = Date.now();
  const clock = document.querySelector('.tabular-nums');
  setInterval(() => {
    if (!clock) return;
    const total = Math.floor((Date.now() - started) / 1000) + 1;
    clock.textContent = `00:${String(Math.floor(total / 60)).padStart(2,'0')}:${String(total % 60).padStart(2,'0')}`;
  }, 1000);
  document.documentElement.style.scrollBehavior = 'smooth';
})();

// Preloader Logic
(function(){
  const preloader = document.getElementById('preloader');
  const groupLight = document.getElementById('groupLight');
  const acmSvg = document.getElementById('acmSvg');
  const chapterTitle = document.getElementById('chapterTitle');
  if (!preloader) return;

  function playLoader() {
    preloader.classList.remove('fade-out');
    if (groupLight) groupLight.setAttribute('fill', 'none');
    if (acmSvg) {
      acmSvg.style.animation = 'none';
      void acmSvg.offsetWidth;
      acmSvg.style.animation = '';
    }
    if (chapterTitle) {
      chapterTitle.style.animation = 'none';
      void chapterTitle.offsetWidth;
      chapterTitle.style.animation = '';
    }

    setTimeout(() => {
      if (groupLight) groupLight.setAttribute('fill', '#0495d0');
    }, 1800);

    setTimeout(() => {
      preloader.classList.add('fade-out');
    }, 2300);
  }

  window.addEventListener('load', () => {
    setTimeout(playLoader, 80);
  });
})();

// Header scroll effect & Mobile Strip Toggle
(function(){
  const header = document.getElementById('siteHeader');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  const toggle = document.getElementById('mobileMenuToggle');
  const strip = document.getElementById('mobileStrip');
  if (toggle && strip) {
    toggle.addEventListener('click', () => {
      strip.classList.toggle('hidden');
      const expanded = !strip.classList.contains('hidden');
      toggle.setAttribute('aria-expanded', String(expanded));
    });
  }
})();

// Technical Plate Ticker & Scroll-Spy: Synchronizes with Hero, About, Team
(function(){
  const sections = [
    { id: 'hero',  scene: 'SC.01', name: 'HERO' },
    { id: 'about', scene: 'SC.02', name: 'ABOUT' },
    { id: 'team',  scene: 'SC.07', name: 'TEAM' }
  ];
  const sceneEl = document.getElementById('plateSceneNum');
  const nameEl = document.getElementById('plateSectionName');
  if (sceneEl && nameEl && ('IntersectionObserver' in window)) {
    const byId = new Map(sections.map(s => [s.id, s]));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const s = byId.get(entry.target.id);
          if (s) { 
            sceneEl.textContent = s.scene; 
            nameEl.textContent = s.name; 
          }
        }
      });
    }, { rootMargin: '-35% 0px -35% 0px', threshold: 0 });

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
  }

  // Live Technical Timecode (HH:MM:SS)
  const timecodeEl = document.getElementById('plateTimecode');
  if (timecodeEl) {
    let seconds = 1;
    setInterval(() => {
      seconds++;
      const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
      const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
      const secs = String(seconds % 60).padStart(2, '0');
      timecodeEl.textContent = `${hrs}:${mins}:${secs}`;
    }, 1000);
  }
})();

// ========================================================
// ABOUT SECTION: ANIMATED TECH GRID BACKGROUND (Image 3)
// ========================================================
(function() {
  const canvas = document.getElementById('aboutGridCanvas');
  const section = document.getElementById('about');
  if (!canvas || !section) return;

  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  const cellSize = 56; // Grid tile size in px
  let cols = 0;
  let rows = 0;

  // Active highlighted tiles matching Image 3 (subtle translucent blue cells)
  const activeCells = [];
  const maxActiveCells = 8;

  function resize() {
    const rect = section.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    cols = Math.ceil(width / cellSize);
    rows = Math.ceil(height / cellSize);
  }

  resize();
  window.addEventListener('resize', resize);

  function spawnCell() {
    if (cols <= 0 || rows <= 0) return;
    const c = Math.floor(Math.random() * cols);
    const r = Math.floor(Math.random() * rows);

    if (activeCells.some(cell => cell.col === c && cell.row === r)) return;

    activeCells.push({
      col: c,
      row: r,
      alpha: 0,
      targetAlpha: 0.18 + Math.random() * 0.16,
      state: 'fade-in',
      speed: 0.006 + Math.random() * 0.007,
      holdTimer: 70 + Math.floor(Math.random() * 110)
    });
  }

  // Pre-seed some initial cells
  for (let i = 0; i < maxActiveCells; i++) {
    const c = Math.floor(Math.random() * Math.max(1, cols));
    const r = Math.floor(Math.random() * Math.max(1, rows));
    activeCells.push({
      col: c,
      row: r,
      alpha: Math.random() * 0.22,
      targetAlpha: 0.2 + Math.random() * 0.14,
      state: Math.random() > 0.4 ? 'fade-in' : 'hold',
      speed: 0.006 + Math.random() * 0.007,
      holdTimer: Math.floor(Math.random() * 90)
    });
  }

  let isVisible = true;
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
        if (isVisible) requestAnimationFrame(draw);
      });
    }, { threshold: 0.02 });
    observer.observe(section);
  }

  function draw() {
    if (!isVisible) return;

    ctx.clearRect(0, 0, width, height);

    // 1. Subtle, crisp grid lines
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(31, 84, 225, 0.09)';

    ctx.beginPath();
    for (let x = 0; x <= width; x += cellSize) {
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, height);
    }
    for (let y = 0; y <= height; y += cellSize) {
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(width, y + 0.5);
    }
    ctx.stroke();

    // 2. Animated translucent blue cells (Image 3)
    for (let i = activeCells.length - 1; i >= 0; i--) {
      const cell = activeCells[i];
      const x = cell.col * cellSize;
      const y = cell.row * cellSize;

      if (cell.state === 'fade-in') {
        cell.alpha += cell.speed;
        if (cell.alpha >= cell.targetAlpha) {
          cell.alpha = cell.targetAlpha;
          cell.state = 'hold';
        }
      } else if (cell.state === 'hold') {
        cell.holdTimer--;
        if (cell.holdTimer <= 0) {
          cell.state = 'fade-out';
        }
      } else if (cell.state === 'fade-out') {
        cell.alpha -= cell.speed;
        if (cell.alpha <= 0) {
          activeCells.splice(i, 1);
          continue;
        }
      }

      // Fill cell
      ctx.fillStyle = `rgba(59, 130, 246, ${cell.alpha.toFixed(3)})`;
      ctx.fillRect(x + 1, y + 1, cellSize - 1, cellSize - 1);

      // Border highlight
      ctx.strokeStyle = `rgba(37, 99, 235, ${(cell.alpha * 1.5).toFixed(3)})`;
      ctx.strokeRect(x + 0.5, y + 0.5, cellSize, cellSize);
    }

    if (activeCells.length < maxActiveCells && Math.random() < 0.07) {
      spawnCell();
    }

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
})();

// ========================================================
// THUNDER / LIGHTNING ARC FROM PHOTO REEL TO EXPLORE BUTTON
// ========================================================
(function(){
  const exploreBtn = document.getElementById('exploreBtn');
  const photoReel = document.getElementById('photoReelImg');
  const canvas = document.getElementById('lightningCanvas');
  const flash = document.getElementById('screenFlash');
  const heroSection = document.getElementById('hero');

  if (!exploreBtn || !photoReel || !canvas || !heroSection) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId = null;

  function resizeCanvas() {
    const rect = heroSection.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Synthetic Audio Zap using Web Audio API
  function playElectricZapSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const actx = new AudioCtx();
      
      // Noise burst
      const bufferSize = actx.sampleRate * 0.4;
      const buffer = actx.createBuffer(1, bufferSize, actx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = actx.createBufferSource();
      noise.buffer = buffer;
      
      const filter = actx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1400;
      filter.Q.value = 3;

      const gain = actx.createGain();
      gain.gain.setValueAtTime(0.25, actx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, actx.currentTime + 0.35);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(actx.destination);
      noise.start();
    } catch(e) {
      // AudioContext policy handled gracefully
    }
  }

  // Recursive Lightning Line Generator
  function createLightningBolt(x1, y1, x2, y2, displacement) {
    const points = [];
    function subdivide(startX, startY, endX, endY, disp) {
      if (disp < 4) {
        points.push({ x: startX, y: startY });
        return;
      }
      const midX = (startX + endX) / 2;
      const midY = (startY + endY) / 2;
      const normalX = -(endY - startY);
      const normalY = (endX - startX);
      const length = Math.sqrt(normalX * normalX + normalY * normalY);
      const offset = (Math.random() - 0.5) * disp;

      const newX = midX + (normalX / (length || 1)) * offset;
      const newY = midY + (normalY / (length || 1)) * offset;

      subdivide(startX, startY, newX, newY, disp / 2);
      subdivide(newX, newY, endX, endY, disp / 2);
    }
    subdivide(x1, y1, x2, y2, displacement);
    points.push({ x: x2, y: y2 });
    return points;
  }

  function drawBolt(points, color, width, glow) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = glow || color;
    ctx.shadowBlur = 18;

    ctx.beginPath();
    for (let i = 0; i < points.length; i++) {
      if (i === 0) ctx.moveTo(points[i].x, points[i].y);
      else ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
    ctx.restore();
  }

  function fireThunderArc(onComplete) {
    resizeCanvas();
    canvas.style.display = 'block';
    if (flash) flash.classList.add('active');
    exploreBtn.classList.add('btn-thunder-strike');
    playElectricZapSound();

    const heroRect = heroSection.getBoundingClientRect();
    const reelRect = photoReel.getBoundingClientRect();
    const btnRect = exploreBtn.getBoundingClientRect();

    // Source coordinates: Center of the spinning Photo Reel
    const startX = (reelRect.left + reelRect.width / 2) - heroRect.left;
    const startY = (reelRect.top + reelRect.height / 2) - heroRect.top;

    // Target coordinates: Center of the Explore Button
    const targetX = (btnRect.left + btnRect.width / 2) - heroRect.left;
    const targetY = (btnRect.top + btnRect.height / 2) - heroRect.top;

    const startTime = performance.now();
    const duration = 650; // milliseconds

    function render(currentTime) {
      const elapsed = currentTime - startTime;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (elapsed < duration) {
        // Render 2-3 branching electric bolts per frame
        const numBolts = Math.floor(Math.random() * 2) + 2;
        for (let b = 0; b < numBolts; b++) {
          const boltPoints = createLightningBolt(startX, startY, targetX, targetY, 80);
          
          // Outer electric cyan glow
          drawBolt(boltPoints, 'rgba(4, 149, 208, 0.8)', 6, '#00f0ff');
          // Core hot white bolt
          drawBolt(boltPoints, 'rgba(255, 255, 255, 0.95)', 2.5, '#ffffff');

          // Branch off small electrical forks
          if (boltPoints.length > 8 && Math.random() > 0.4) {
            const forkIndex = Math.floor(Math.random() * (boltPoints.length - 4)) + 2;
            const fp = boltPoints[forkIndex];
            const forkEnd = {
              x: fp.x + (Math.random() - 0.5) * 120,
              y: fp.y + (Math.random() - 0.5) * 120
            };
            const branchPoints = createLightningBolt(fp.x, fp.y, forkEnd.x, forkEnd.y, 40);
            drawBolt(branchPoints, 'rgba(31, 84, 225, 0.7)', 1.5, '#1f54e1');
          }
        }

        // Plasma sparks at start (Photo Reel)
        ctx.save();
        ctx.fillStyle = '#00f0ff';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 25;
        ctx.beginPath();
        ctx.arc(startX, startY, Math.random() * 12 + 10, 0, Math.PI * 2);
        ctx.fill();

        // Plasma sparks at target (Explore Button)
        ctx.fillStyle = '#1f54e1';
        ctx.shadowBlur = 30;
        ctx.beginPath();
        ctx.arc(targetX, targetY, Math.random() * 14 + 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        animationFrameId = requestAnimationFrame(render);
      } else {
        // Complete
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.display = 'none';
        if (flash) flash.classList.remove('active');
        exploreBtn.classList.remove('btn-thunder-strike');
        if (typeof onComplete === 'function') onComplete();
      }
    }

    animationFrameId = requestAnimationFrame(render);
  }

  exploreBtn.addEventListener('click', (e) => {
    e.preventDefault();
    fireThunderArc(() => {
      const aboutEl = document.getElementById('about');
      if (aboutEl) {
        aboutEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

// ========================================================
// TEAM DEPARTMENT FILTERING WITH ANIMATED CHECKBOXES
// ========================================================
(function(){
  const filterPills = document.querySelectorAll('.filter-checkbox-pill');
  const teamCards = document.querySelectorAll('.team-card');

  filterPills.forEach(pill => {
    const cb = pill.querySelector('.filter-cb');
    pill.addEventListener('click', (e) => {
      // Toggle logic
      const targetCat = pill.getAttribute('data-cat');
      
      filterPills.forEach(p => {
        p.classList.remove('active');
        const c = p.querySelector('.filter-cb');
        if (c) c.checked = false;
      });

      pill.classList.add('active');
      if (cb) cb.checked = true;

      teamCards.forEach(card => {
        const cardCats = (card.getAttribute('data-category') || '').toLowerCase();
        if (targetCat === 'all' || cardCats.includes(targetCat)) {
          card.style.display = 'block';
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
})();

// ========================================================
// JOIN FORM INTERACTION
// ========================================================
(function(){
  const applyBtn = document.getElementById('applyBtn');
  const joinInput = document.getElementById('joinEmailInput');
  const joinMsg = document.getElementById('joinMsg');

  if (applyBtn && joinInput && joinMsg) {
    applyBtn.addEventListener('click', () => {
      const val = joinInput.value.trim();
      if (!val || !val.includes('@')) {
        alert('Please enter a valid SSGMCE email ID.');
        joinInput.focus();
        return;
      }
      applyBtn.textContent = 'Submitted ✓';
      applyBtn.classList.add('bg-mint', 'text-ink');
      joinMsg.classList.remove('hidden');
    });
  }
})();

// ========================================================
// SIGN-IN MODAL HANDLERS
// ========================================================
const signInModal = document.getElementById('signInModal');
const openSignInBtn = document.getElementById('openSignInBtn');
const mobileOpenSignInBtn = document.getElementById('mobileOpenSignInBtn');
const closeSignInBtn = document.getElementById('closeSignInBtn');
const modalPwToggle = document.getElementById('modalPwToggle');
const modalPwField = document.getElementById('modalPwField');

function openModal() {
  if (signInModal) {
    signInModal.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
    const emailField = document.getElementById('modalEmail');
    if (emailField) setTimeout(() => emailField.focus(), 150);
  }
}

function closeModal() {
  if (signInModal) {
    signInModal.classList.remove('modal-open');
    document.body.style.overflow = '';
  }
}

if (openSignInBtn) openSignInBtn.addEventListener('click', openModal);
if (mobileOpenSignInBtn) mobileOpenSignInBtn.addEventListener('click', openModal);
if (closeSignInBtn) closeSignInBtn.addEventListener('click', closeModal);

if (signInModal) {
  signInModal.addEventListener('click', (e) => {
    if (e.target === signInModal) closeModal();
  });
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && signInModal && signInModal.classList.contains('modal-open')) {
    closeModal();
  }
});

if (modalPwToggle && modalPwField) {
  modalPwToggle.addEventListener('click', () => {
    modalPwField.type = modalPwField.type === 'password' ? 'text' : 'password';
  });
}

function handleModalSignIn(e) {
  e.preventDefault();
  const email = document.getElementById('modalEmail')?.value || '';
  const btn = document.getElementById('modalSubmitBtn');
  if (btn) {
    btn.textContent = 'Verifying Institute Credentials...';
    btn.style.opacity = '0.7';
    setTimeout(() => {
      alert(`Welcome, ${email}! You have successfully authenticated to ACM SSGMCE portal.`);
      btn.textContent = 'SIGN IN';
      btn.style.opacity = '1';
      closeModal();
    }, 1200);
  }
}

function handleGoogleSignIn() {
  alert('Redirecting to Google SSGMCE Workspace SSO (OAuth 2.0)...');
}
