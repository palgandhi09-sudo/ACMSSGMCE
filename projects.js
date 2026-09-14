  // Domain filters for projects
  const projCheckboxes = document.querySelectorAll('.filter-proj-cb');
  const projCards = document.querySelectorAll('.proj-card');

  projCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      const val = cb.value;
      if (cb.checked) {
        projCheckboxes.forEach(other => {
          if (other !== cb) other.checked = false;
        });
      } else {
        cb.checked = true;
      }

      projCards.forEach(card => {
        const dom = card.getAttribute('data-domain');
        if (val === 'all' || dom === val) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

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

  // Live Technical Timecode (HH:MM:SS) & Footer Zone B Parallax
  (function(){
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
  // LIGHT THEME INTERACTIVE FLASHING GRID (Checkboxes Background)
  // ========================================================
  (function(){
    const container = document.getElementById('gridBg');
    if (!container) return;

    const cellSize = 54;
    let cols = Math.ceil(window.innerWidth / cellSize);
    let rows = Math.ceil(window.innerHeight / cellSize);
    const cells = [];

    function initGrid() {
      container.innerHTML = '';
      cols = Math.ceil(window.innerWidth / cellSize);
      rows = Math.ceil(window.innerHeight / cellSize);
      cells.length = 0;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const div = document.createElement('div');
          div.className = 'grid-cell-flash';
          div.style.left = `${c * cellSize}px`;
          div.style.top = `${r * cellSize}px`;
          container.appendChild(div);
          cells.push(div);
        }
      }
    }

    initGrid();
    window.addEventListener('resize', initGrid);

    // Periodically pulse a random grid cell
    setInterval(() => {
      if (cells.length === 0) return;
      const randIndex = Math.floor(Math.random() * cells.length);
      const cell = cells[randIndex];
      if (cell && !cell.classList.contains('flash-active')) {
        cell.classList.add('flash-active');
        setTimeout(() => cell.classList.remove('flash-active'), 800);
      }
    }, 350);
  })();

/* ================= INJECTED: SIGN-IN MODAL HANDLERS ================= */
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
