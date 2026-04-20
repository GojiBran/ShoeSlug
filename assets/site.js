/* Shared site scripts extracted from inline <script> blocks.
   Runs page-specific init based on body[data-page]. */

function getPageId() {
  const body = document.body;
  if (!body) return null;
  return body.getAttribute('data-page');
}

function initParticlesIfPresent() {
  const el = document.getElementById('particles-js');
  if (!el) return;
  if (typeof window.particlesJS !== 'function') return;

  window.particlesJS('particles-js', {
    particles: {
      number: { value: 160, density: { enable: true, value_area: 800 } },
      color: { value: '#ffffff' },
      shape: { type: 'circle', stroke: { width: 0, color: '#000000' }, polygon: { nb_sides: 5 } },
      opacity: { value: 0.5, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false } },
      size: { value: 3, random: true, anim: { enable: false, speed: 40, size_min: 0.1, sync: false } },
      line_linked: { enable: false },
      move: { enable: true, speed: 1, direction: 'none', random: true, straight: false, out_mode: 'out', bounce: false, attract: { enable: false, rotateX: 600, rotateY: 600 } }
    },
    interactivity: {
      detect_on: 'canvas',
      events: { onhover: { enable: true, mode: 'bubble' }, onclick: { enable: true, mode: 'repulse' }, resize: true },
      modes: { bubble: { distance: 250, size: 0, duration: 2, opacity: 0, speed: 3 }, repulse: { distance: 400, duration: 0.4 } }
    },
    retina_detect: true
  });
}

function initIdleGameIfPresent() {
  const idleGame = document.getElementById('idle-game');
  const idleScoreDisplay = document.getElementById('idle-score');
  const idleClickBtn = document.getElementById('idle-click');
  const exitSlugBtn = document.getElementById('exit-slug');

  if (!idleGame || !idleScoreDisplay || !idleClickBtn || !exitSlugBtn) return;

  let idleScore = 0;
  let idleActivated = false;

  function showIdleGame() {
    if (!idleActivated) {
      idleActivated = true;
      idleGame.style.display = 'block';
    }
  }

  idleClickBtn.onclick = function () {
    idleScore++;
    idleScoreDisplay.textContent = String(idleScore);
  };

  exitSlugBtn.onclick = function () {
    idleGame.style.opacity = '1';
    idleGame.style.transition = 'opacity 0.5s ease';
    idleGame.style.opacity = '0';

    setTimeout(() => {
      idleGame.style.display = 'none';
      idleActivated = false;
      idleScore = 0;
      idleScoreDisplay.textContent = '0';
    }, 500);
  };

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && idleActivated) {
      exitSlugBtn.click();
    }
  });

  setTimeout(showIdleGame, 60000);
}

function initGalleryPage() {
  if (getPageId() !== 'gallery') return;

  /* ===== Config (hardcoded categories) ===== */
  const BASE = 'https://shoeslug.com/gallery/images';
  const CATEGORIES = [
    { folder: 'inktober-2024', count: 31, desc: '31 days of doodles - 2024' },
    { folder: 'inktober-2025', count: 31, desc: '31 days of doodles - 2025' },
    { folder: 'miscellaneous', count: 6, desc: 'Random art collection' }
  ];

  /* ===== State ===== */
  let currentFolder = null;
  let mainSwiper = null;

  /* ===== Helpers ===== */
  const el = (sel) => document.querySelector(sel);
  const els = (sel) => Array.from(document.querySelectorAll(sel));
  const toTitleCase = (slug) => slug.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  function buildImagesFor(folder) {
    if (folder === 'all') {
      return CATEGORIES.flatMap((cat) =>
        Array.from({ length: cat.count }, (_, i) => ({
          full: `${BASE}/${cat.folder}/image${i}.jpg`,
          thumb: `${BASE}/${cat.folder}/resize/image${i}.jpg`,
          alt: `${toTitleCase(cat.folder)} ${i + 1}`
        }))
      );
    }
    const cat = CATEGORIES.find((c) => c.folder === folder);
    if (!cat) return [];
    return Array.from({ length: cat.count }, (_, i) => ({
      full: `${BASE}/${folder}/image${i}.jpg`,
      thumb: `${BASE}/${folder}/resize/image${i}.jpg`,
      alt: `${toTitleCase(folder)} ${i + 1}`
    }));
  }

  function showCategoriesView() {
    el('#categoriesView').style.display = '';
    el('#galleryView').style.display = 'none';
    currentFolder = null;
    if (mainSwiper && mainSwiper.autoplay) mainSwiper.autoplay.stop();
    history.replaceState(null, '', '#');
  }

  function showGalleryView() {
    el('#categoriesView').style.display = 'none';
    el('#galleryView').style.display = '';
  }

  function setActiveThumb(index) {
    els('#thumbGridWrapper a').forEach((a) => a.classList.remove('active-thumb'));
    const active = el(`#thumb-${index}`);
    if (active) active.classList.add('active-thumb');
  }

  function initSwiper() {
    if (!window.Swiper) return null;
    if (mainSwiper && typeof mainSwiper.destroy === 'function') {
      try { mainSwiper.destroy(true, true); } catch {}
    }
    mainSwiper = new window.Swiper('.mainSwiper', {
      spaceBetween: 10,
      loop: true,
      speed: 800,
      autoplay: { delay: 12000, disableOnInteraction: true },
      navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
      on: {
        init() {
          setActiveThumb(this.realIndex);
          maybeUpdateHash(currentFolder, this.realIndex);
        },
        slideChange() {
          setActiveThumb(this.realIndex);
          maybeUpdateHash(currentFolder, this.realIndex);
        }
      }
    });

    document.addEventListener('fsLightboxOpen', () => {
      if (mainSwiper && mainSwiper.autoplay) mainSwiper.autoplay.stop();
    });
    document.addEventListener('fsLightboxClose', () => {
      if (mainSwiper && mainSwiper.autoplay) mainSwiper.autoplay.start();
    });

    return mainSwiper;
  }

  function smoothScrollToGalleryTop() {
    const box = el('.gallery-box');
    const navbar = el('.navbar');
    if (!box || !navbar) return;
    const top = box.getBoundingClientRect().top + window.pageYOffset - navbar.offsetHeight - 6;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  function refreshLightboxSafe() {
    if (typeof window.refreshFsLightbox === 'function') {
      try { window.refreshFsLightbox(); } catch {}
    } else {
      setTimeout(() => {
        if (typeof window.refreshFsLightbox === 'function') {
          try { window.refreshFsLightbox(); } catch {}
        }
      }, 0);
    }
  }

  function maybeUpdateHash(folder, index) {
    if (!folder) return;
    const idxPart = typeof index === 'number' ? `:${index}` : '';
    const nextHash = `#${folder}${idxPart}`;
    if (location.hash !== nextHash) {
      try { history.replaceState(null, '', nextHash); } catch {}
    }
  }

  function parseHash() {
    const raw = (location.hash || '').replace(/^#/, '').trim();
    if (!raw) return null;
    const [folder, idxRaw] = raw.split(':');
    const index = Number.isFinite(+idxRaw) ? Math.max(0, +idxRaw) : null;
    return { folder, index };
  }

  /* ===== Renderers ===== */
  function renderCategoryCards() {
    const grid = el('#catGrid');
    grid.innerHTML = '';
    const frag = document.createDocumentFragment();

    const randFolder = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const randIndex = Math.floor(Math.random() * randFolder.count);
    const randCover = `${BASE}/${randFolder.folder}/resize/image${randIndex}.jpg`;

    const total = CATEGORIES.reduce((sum, c) => sum + c.count, 0);
    frag.appendChild(buildCard({ folder: 'all', count: total, desc: 'Every piece in one endless stream' }, randCover));

    CATEGORIES.forEach((cat) => {
      const cover = `${BASE}/${cat.folder}/resize/image0.jpg`;
      frag.appendChild(buildCard(cat, cover));
    });

    grid.appendChild(frag);
  }

  function buildCard({ folder, count, desc }, cover) {
    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <div class="cat-card" data-folder="${folder}">
        <img class="cat-cover" src="${cover}" alt="${toTitleCase(folder)} cover" loading="lazy" decoding="async">
        <div class="cat-body">
          <div>
            <h3 class="cat-title">${toTitleCase(folder)}</h3>
            <p class="cat-desc">${desc || ''}</p>
          </div>
          <span class="cat-count">(${count})</span>
        </div>
      </div>`;
    wrap.querySelector('.cat-card').addEventListener('click', () => openCategory(folder, 0));
    return wrap.firstElementChild;
  }

  function renderGallery(folder, index = 0) {
    currentFolder = folder;
    el('#galleryTitle').textContent = toTitleCase(folder);

    const images = buildImagesFor(folder);
    const main = el('#mainSwiperWrapper');
    const thumbs = el('#thumbGridWrapper');
    main.innerHTML = '';
    thumbs.innerHTML = '';

    const lightboxKey = `gallery-${folder}`;
    let slidesHtml = '';
    images.forEach(({ full, alt }) => {
      slidesHtml += `
        <div class="swiper-slide">
          <a data-fslightbox="${lightboxKey}" href="${full}">
            <img src="${full}" loading="lazy" decoding="async" alt="${alt}" class="img-fluid rounded w-100" style="max-height: 70vh; object-fit: contain;" />
          </a>
        </div>`;
    });
    main.innerHTML = slidesHtml;

    const frag = document.createDocumentFragment();
    images.forEach(({ thumb, full, alt }, i) => {
      const col = document.createElement('div');
      col.className = 'col-4 col-sm-3 col-md-2 col-lg-2';
      col.innerHTML = `
        <a id="thumb-${i}" href="${full}" title="${alt}">
          <div class="zoom-thumb">
            <img src="${thumb}" loading="lazy" decoding="async" alt="${alt}" class="img-fluid rounded shadow-sm" style="object-fit: cover;" />
          </div>
        </a>`;
      col.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (mainSwiper && typeof mainSwiper.slideToLoop === 'function') {
          mainSwiper.slideToLoop(i, 500);
          setActiveThumb(i);
          maybeUpdateHash(folder, i);
          smoothScrollToGalleryTop();
        }
      });
      frag.appendChild(col);
    });
    thumbs.appendChild(frag);

    refreshLightboxSafe();
    initSwiper();

    if (mainSwiper && typeof index === 'number') {
      const startAt = Math.min(Math.max(index, 0), images.length - 1);
      mainSwiper.slideToLoop(startAt, 0);
      setActiveThumb(startAt);
    }
  }

  /* ===== Controllers ===== */
  function openCategory(folder, index = 0) {
    showGalleryView();
    renderGallery(folder, index);
    maybeUpdateHash(folder, index || 0);
    smoothScrollToGalleryTop();
  }

  function handleBack() {
    showCategoriesView();
    const grid = el('#categoriesView');
    const navbar = el('.navbar');
    if (grid && navbar) {
      const top = grid.getBoundingClientRect().top + window.pageYOffset - navbar.offsetHeight - 6;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }

  function setupGallery() {
    el('#backBtn').addEventListener('click', (e) => { e.preventDefault(); handleBack(); });

    document.addEventListener('keydown', (e) => {
      if (el('#galleryView').style.display === 'none') return;
      if (!mainSwiper) return;
      const tag = ((e.target && e.target.tagName) || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'ArrowRight') mainSwiper.slideNext();
      else if (e.key === 'ArrowLeft') mainSwiper.slidePrev();
    });

    renderCategoryCards();

    const deep = parseHash();
    if (deep && (deep.folder === 'all' || CATEGORIES.some((c) => c.folder === deep.folder))) {
      openCategory(deep.folder, typeof deep.index === 'number' ? deep.index : 0);
    } else {
      showCategoriesView();
    }

    window.addEventListener('hashchange', () => {
      const d = parseHash();
      if (!d) { showCategoriesView(); return; }
      if (d.folder === 'all' || CATEGORIES.some((c) => c.folder === d.folder)) {
        openCategory(d.folder, typeof d.index === 'number' ? d.index : 0);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupGallery);
  } else {
    setupGallery();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initParticlesIfPresent();
  initIdleGameIfPresent();
  initGalleryPage();
});

