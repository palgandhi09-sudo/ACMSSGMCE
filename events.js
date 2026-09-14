  // Mobile drawer toggle
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  if (mobileMenuToggle && mobileDrawer) {
    mobileMenuToggle.addEventListener('click', () => {
      const isExpanded = mobileDrawer.classList.toggle('hidden');
      mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
    });
  }

  // Countdown timer simulation for DotSlash 2026
  let timeLeft = 14 * 86400 + 8 * 3600 + 42 * 60 + 18;
  function updateCountdown() {
    if (timeLeft <= 0) return;
    timeLeft--;
    const d = Math.floor(timeLeft / 86400);
    const h = Math.floor((timeLeft % 86400) / 3600);
    const m = Math.floor((timeLeft % 3600) / 60);
    const s = Math.floor(timeLeft % 60);
    
    document.getElementById('countDays').innerText = d < 10 ? '0' + d : d;
    document.getElementById('countHours').innerText = h < 10 ? '0' + h : h;
    document.getElementById('countMin').innerText = m < 10 ? '0' + m : m;
    document.getElementById('countSec').innerText = s < 10 ? '0' + s : s;
  }
  setInterval(updateCountdown, 1000);

  // Search and Category Filtering Logic
  const searchInput = document.getElementById('eventSearchInput');
  const categoryCheckboxes = document.querySelectorAll('.filter-category-cb');
  const statusTabs = document.querySelectorAll('.status-tab');
  const cards = document.querySelectorAll('.event-card');
  const noEventsFound = document.getElementById('noEventsFound');

  let currentCategory = 'all';
  let currentStatus = 'all';
  let currentSearch = '';

  function applyFilters() {
    let visibleCount = 0;

    cards.forEach(card => {
      const cat = card.getAttribute('data-category');
      const stat = card.getAttribute('data-status');
      const text = card.innerText.toLowerCase();

      const matchesCat = (currentCategory === 'all' || cat === currentCategory);
      const matchesStat = (currentStatus === 'all' || stat === currentStatus);
      const matchesSearch = (!currentSearch || text.includes(currentSearch));

      if (matchesCat && matchesStat && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (visibleCount === 0) {
      noEventsFound.classList.remove('hidden');
    } else {
      noEventsFound.classList.add('hidden');
    }
  }

  // Checkbox interactions
  categoryCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      if (cb.checked) {
        currentCategory = cb.value;
        categoryCheckboxes.forEach(other => {
          if (other !== cb) other.checked = false;
        });
      } else {
        cb.checked = true;
        currentCategory = cb.value;
      }
      applyFilters();
    });
  });

  // Status Tab interactions
  statusTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      statusTabs.forEach(t => {
        t.classList.remove('bg-card', 'text-foreground', 'shadow-sm');
        t.classList.add('text-muted-foreground');
      });
      tab.classList.add('bg-card', 'text-foreground', 'shadow-sm');
      tab.classList.remove('text-muted-foreground');

      currentStatus = tab.getAttribute('data-status');
      applyFilters();
    });
  });

  // Search input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value.toLowerCase().trim();
      applyFilters();
    });
  }

  function resetFilters() {
    currentCategory = 'all';
    currentStatus = 'all';
    currentSearch = '';
    if (searchInput) searchInput.value = '';

    categoryCheckboxes.forEach(cb => {
      cb.checked = (cb.value === 'all');
    });

    statusTabs.forEach(t => {
      if (t.getAttribute('data-status') === 'all') {
        t.classList.add('bg-card', 'text-foreground', 'shadow-sm');
        t.classList.remove('text-muted-foreground');
      } else {
        t.classList.remove('bg-card', 'text-foreground', 'shadow-sm');
        t.classList.add('text-muted-foreground');
      }
    });

    applyFilters();
  }

  // Modal Registration Dialog
  const regModal = document.getElementById('eventRegModal');
  const modalEventTitle = document.getElementById('modalEventTitle');
  const regSuccessMsg = document.getElementById('regSuccessMsg');
  const regSubmitBtn = document.getElementById('regSubmitBtn');

  function openRegModal(eventName) {
    if (modalEventTitle) modalEventTitle.innerText = eventName;
    if (regSuccessMsg) regSuccessMsg.classList.add('hidden');
    if (regSubmitBtn) regSubmitBtn.disabled = false;
    regModal.classList.add('open');
  }

  function closeRegModal() {
    regModal.classList.remove('open');
  }

  regModal.addEventListener('click', (e) => {
    if (e.target === regModal) closeRegModal();
  });

  function handleEventReg(e) {
    e.preventDefault();
    regSubmitBtn.disabled = true;
    regSubmitBtn.innerText = 'Registering...';
    setTimeout(() => {
      regSubmitBtn.innerText = 'Registered!';
      regSuccessMsg.classList.remove('hidden');
      setTimeout(() => {
        closeRegModal();
        regSubmitBtn.innerText = 'Confirm Registration →';
      }, 2000);
    }, 700);
  }

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
