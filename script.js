/* =========================================================
   ADVANCED HEART SPECIALIST CLINIC — FRONTEND LOGIC
   Frontend-only demo. No network requests, no persistence.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Page loader ---------- */
  const loader = document.getElementById('page-loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader && loader.classList.add('done'), 400);
  });
  // Fallback in case 'load' already fired
  setTimeout(() => loader && loader.classList.add('done'), 2500);

  /* ---------- Sticky navbar + scroll progress + back to top ---------- */
  const navbar = document.getElementById('navbar');
  const progress = document.getElementById('scroll-progress');
  const backToTop = document.getElementById('back-to-top');

  const onScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progress) progress.style.width = pct + '%';
    if (navbar) navbar.classList.toggle('scrolled', scrollTop > 10);
    if (backToTop) backToTop.classList.toggle('show', scrollTop > 500);
    updateActiveNav();
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  navToggle?.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const open = navLinks.classList.contains('open');
    navToggle.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    navToggle.setAttribute('aria-expanded', open);
  });
  navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
  }));

  /* ---------- Active link highlight ---------- */
  const sections = [...document.querySelectorAll('main section[id]')];
  function updateActiveNav() {
    let current = sections[0]?.id;
    for (const s of sections) {
      if (window.scrollY + 140 >= s.offsetTop) current = s.id;
    }
    document.querySelectorAll('.nav-links a').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  /* ---------- Animated counters ---------- */
  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10) || 0;
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const start = performance.now();
    function tick(now) {
      const progressRatio = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progressRatio, 3);
      el.textContent = Math.round(eased * target).toLocaleString() + suffix;
      if (progressRatio < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  const counterEls = document.querySelectorAll('[data-count]');
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  counterEls.forEach(el => counterIO.observe(el));

  /* ---------- Ripple effect ---------- */
  document.querySelectorAll('.ripple').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const circle = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      circle.className = 'ripple-circle';
      circle.style.width = circle.style.height = size + 'px';
      circle.style.left = (e.clientX - rect.left - size / 2) + 'px';
      circle.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(circle);
      setTimeout(() => circle.remove(), 650);
    });
  });

  /* ---------- Toast notifications ---------- */
  window.showToast = function (message, type = 'success') {
    const wrap = document.getElementById('toast-wrap');
    if (!wrap) return;
    const toast = document.createElement('div');
    toast.className = 'toast' + (type === 'error' ? ' error' : '');
    const icon = type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check';
    toast.innerHTML = `<i class="fa-solid ${icon}"></i><span>${message}</span>`;
    wrap.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('hide');
      setTimeout(() => toast.remove(), 320);
    }, 3800);
  };

  /* ---------- Modal windows ---------- */
  document.querySelectorAll('[data-open-modal]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const modal = document.getElementById(trigger.dataset.openModal);
      modal?.classList.add('open');
    });
  });
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.remove('open'); });
    overlay.querySelector('.modal-close')?.addEventListener('click', () => overlay.classList.remove('open'));
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
  });

  /* ---------- Generic frontend-only form handling ---------- */
  function validateField(field) {
    field.classList.add('touched');
    const wrapper = field.closest('.field');
    const valid = field.checkValidity();
    wrapper?.classList.toggle('has-error', !valid);
    return valid;
  }

  document.querySelectorAll('form[data-demo-form]').forEach(form => {
    form.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('blur', () => validateField(field));
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let allValid = true;
      form.querySelectorAll('input, select, textarea').forEach(field => {
        if (!validateField(field)) allValid = false;
      });
      if (!allValid) {
        showToast('Please check the highlighted fields.', 'error');
        return;
      }
      const successName = form.dataset.successMessage || 'Submitted successfully (demo only — no data is stored).';
      showToast(successName);
      const confirmModalId = form.dataset.confirmModal;
      if (confirmModalId) document.getElementById(confirmModalId)?.classList.add('open');
      form.reset();
      form.querySelectorAll('.field').forEach(f => f.classList.remove('has-error'));
      form.querySelectorAll('.touched').forEach(f => f.classList.remove('touched'));
    });

    const resetBtn = form.querySelector('[data-reset-form]');
    resetBtn?.addEventListener('click', () => {
      form.reset();
      form.querySelectorAll('.field').forEach(f => f.classList.remove('has-error'));
      form.querySelectorAll('.touched').forEach(f => f.classList.remove('touched'));
      showToast('Form cleared.');
    });
  });

  /* ---------- Testimonials carousel ---------- */
  const track = document.getElementById('testi-track');
  if (track) {
    const cards = track.children.length;
    const dotsWrap = document.getElementById('testi-dots');
    let perView = window.innerWidth <= 640 ? 1 : window.innerWidth <= 900 ? 2 : 3;
    let index = 0;
    let autoTimer;

    function maxIndex() { return Math.max(0, cards - perView); }
    function render() {
      const cardWidth = track.children[0].getBoundingClientRect().width + 26;
      track.style.transform = `translateX(-${index * cardWidth}px)`;
      if (dotsWrap) {
        dotsWrap.querySelectorAll('button').forEach((d, i) => d.classList.toggle('active', i === index));
      }
    }
    function buildDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = '';
      for (let i = 0; i <= maxIndex(); i++) {
        const b = document.createElement('button');
        b.setAttribute('aria-label', 'Go to testimonial slide ' + (i + 1));
        b.addEventListener('click', () => { index = i; render(); restartAuto(); });
        dotsWrap.appendChild(b);
      }
    }
    function next() { index = index >= maxIndex() ? 0 : index + 1; render(); }
    function prev() { index = index <= 0 ? maxIndex() : index - 1; render(); }
    function restartAuto() { clearInterval(autoTimer); autoTimer = setInterval(next, 5000); }

    document.getElementById('testi-next')?.addEventListener('click', () => { next(); restartAuto(); });
    document.getElementById('testi-prev')?.addEventListener('click', () => { prev(); restartAuto(); });

    window.addEventListener('resize', () => {
      perView = window.innerWidth <= 640 ? 1 : window.innerWidth <= 900 ? 2 : 3;
      index = Math.min(index, maxIndex());
      buildDots(); render();
    });

    buildDots(); render(); restartAuto();
  }

  /* ---------- Gallery filter + lightbox ---------- */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const filterBtns = document.querySelectorAll('.gallery-filters button');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      galleryItems.forEach(item => {
        item.classList.toggle('hidden', cat !== 'all' && item.dataset.category !== cat);
      });
    });
  });

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  let lbIndex = 0;
  function visibleItems() { return [...galleryItems].filter(i => !i.classList.contains('hidden')); }
  function openLightbox(item) {
    const items = visibleItems();
    lbIndex = items.indexOf(item);
    showLightboxImage();
    lightbox.classList.add('open');
  }
  function showLightboxImage() {
    const items = visibleItems();
    if (!items.length) return;
    lbIndex = (lbIndex + items.length) % items.length;
    const img = items[lbIndex].querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
  }
  galleryItems.forEach(item => item.addEventListener('click', () => openLightbox(item)));
  document.getElementById('lightbox-close')?.addEventListener('click', () => lightbox.classList.remove('open'));
  document.getElementById('lightbox-next')?.addEventListener('click', () => { lbIndex++; showLightboxImage(); });
  document.getElementById('lightbox-prev')?.addEventListener('click', () => { lbIndex--; showLightboxImage(); });
  lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.remove('open'); });

  /* ---------- Accordion (FAQ) ---------- */
  document.querySelectorAll('.accordion-item').forEach(item => {
    const head = item.querySelector('.accordion-head');
    const body = item.querySelector('.accordion-body');
    head.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.accordion-item.open').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.accordion-body').style.maxHeight = null;
        i.querySelector('.accordion-head').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
        head.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- Newsletter (frontend only) ---------- */
  document.getElementById('newsletter-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = e.target.querySelector('input[type="email"]');
    if (input && input.checkValidity() && input.value.trim()) {
      showToast('Subscribed! (demo only, no email is sent)');
      e.target.reset();
    } else {
      showToast('Please enter a valid email address.', 'error');
    }
  });

  /* ---------- Appointment confirmation summary ---------- */
  const apptForm = document.getElementById('appointment-form');
  apptForm?.addEventListener('submit', () => {
    const summary = document.getElementById('appt-summary');
    if (!summary) return;
    const get = (name) => apptForm.querySelector(`[name="${name}"]`)?.value || '—';
    summary.innerHTML = `
      <li><strong>Doctor:</strong> ${get('doctor')}</li>
      <li><strong>Department:</strong> ${get('department')}</li>
      <li><strong>Date:</strong> ${get('date')}</li>
      <li><strong>Time:</strong> ${get('time')}</li>
      <li><strong>Visit type:</strong> ${get('visitType')}</li>
      <li><strong>Consultation:</strong> ${get('consultationType')}</li>
    `;
  });

});
