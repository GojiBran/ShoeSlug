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
    { folder: 'art-show-2026', count: 32, desc: 'Gulu Gulu Art Show November 2026' },
    { folder: 'inktober-2025', count: 31, desc: '31 days of doodles - 2025' },
    { folder: 'inktober-2024', count: 31, desc: '31 days of doodles - 2024' },
    { folder: 'miscellaneous', count: 6, desc: 'Misc art collection' }
  ];

  /* ===== Custom artwork captions ===== */
  // Image numbering starts at 0, matching the image filenames.
  // Add captions here as you write them.
  const CAPTIONS = {
    'art-show-2026': {
      0: '<strong>Cartoon Cells #7 (2023/2026)</strong> <br>Acrylic paint and marker on 11x14 canvas.',
      1: '<strong>Cartoon Cells #6 (2023/2026)</strong> <br>Acrylic paint and marker on 11x14 canvas.',
      2: '<strong>A Big Idea (2026)</strong> <br>Acrylic paint, marker, glow paint and stickers on 11x14 canvas.',
      3: '<strong>Sweet Stefano (2020)</strong> <br>Acrylic paint on 11x14 canvas.',
      4: '<strong>I Am Home (2017)</strong> <br>Acrylic paint and marker on 11x14 canvas.',
      5: '<strong>Castle of Beans (2025/2026)</strong> <br>Acrylic paint, marker and glitter paint on 11x14 canvas.',
      6: '<strong>One in the Universe (2017/2026)</strong> <br>Acrylic paint and marker on 11x14 canvas.',
      7: '<strong>Cartoon Cells #8 (2024/2026)</strong> <br>Acrylic paint and marker on 12x16 canvas.',
      8: '<strong>The Mighty Noom Noom (2022/2026)</strong> <br>Acrylic paint and marker on 12x16 canvas.',
      9: '<strong>Fortune (2016)</strong> <br>Acrylic paint on 8x10 canvas.',
      10: '<strong>Zippy (2022)</strong> <br>Acrylic and glitter paint on 8x10 canvas.',
      11: '<strong>Meno the Moon Spirit (2026)</strong> <br>Acrylic paint, marker and glitter paint on 8x10 canvas.',
      12: '<strong>Cartoon Cells #5 (2025/2026)</strong> <br>Acrylic paint and marker on 11x14 canvas.',
      13: '<strong>Rat Gorl (2017/2026)</strong> <br>Acrylic paint and marker on 16x20 canvas.',
      14: '<strong>Vee Vee (2026)</strong> <br>Acrylic paint, marker and glitter paint on 16x20 canvas.',
      15: '<strong>Teef (2017)</strong> <br>Acrylic paint and construction paper  on 14x20 cardboard.',
      16: '<strong>Barry the Big Bean (2017/ 2026)</strong> <br>Acrylic paint and marker on 16x20 canvas.',
      17: '<strong>Pinot the Pigeon (2025)</strong> <br>Acrylic paint on 18x24 canvas.',
      18: '<strong>Tito (2021/2026)</strong> <br>Acrylic paint,  plastic gems and glitter paint on 18x24 canvas.',
      19: '<strong>Gorman (2026)</strong> <br>Construction paper, acrylic paint and marker on 8x10 canvas.',
      20: '<strong>The Wise Guy (2026)</strong> <br>Acrylic paint and marker on 8x10 canvas.',
      21: '<strong>Bits & Pieces (2021)</strong> <br>Acrylic paint, sharpie and glitter paint on 8x8 canvas.',
      22: '<strong>Pio (2026)</strong> <br>Construction paper, acrylic paint and marker on 6x8 canvas.',
      23: '<strong>Miss VI (2026)</strong> <br>Construction paper, acrylic paint and marker on 6x8 canvas.',
      24: '<strong>Miss Tangerine (2026)</strong> <br>Construction paper, acrylic paint and marker on 6x8 canvas.',
      25: '<strong>Cartoon Cells #4 (2026)</strong> <br>Acrylic paint and marker on 5x7 canvas.',
      26: '<strong>Cartoon Cells #3 (2026)</strong> <br>Acrylic paint and marker on 5x7 canvas.',
      27: '<strong>Pum Pum the Great (2022)</strong> <br>Acrylic and glitter paint on 5x7 canvas.',
      28: '<strong>Cartoon Cells #2 (2026)</strong> <br>Acrylic paint and marker on 5x7 canvas.',
      29: '<strong>Cartoon Cells #1 (2026)</strong> <br>Acrylic paint and marker on 5x5 canvas.',
      30: '<strong>Dream Creatures (2026)</strong> <br>Acrylic paint, marker and construction paper on 11x14 canvas. <em>NFS, 5x7 prints available.</em>',
      31: '<strong>Mr. Meow Meow (2026)</strong> <br>Acrylic paint and marker on 18x24 canvas. <em>NFS, 5x7 prints available.</em>',
    },
    'inktober-2025': {},
    'inktober-2024': {},
    'miscellaneous': {}
  };

  /* ===== State ===== */
  let currentFolder = null;
  let mainSwiper = null;
  let currentImages = [];

  /* ===== Helpers ===== */
  const el = (sel) => document.querySelector(sel);
  const els = (sel) => Array.from(document.querySelectorAll(sel));
  const toTitleCase = (slug) => slug.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  function buildImagesFor(folder) {
    if (folder === 'all') {
      return CATEGORIES.flatMap((cat) =>
        Array.from({ length: cat.count }, (_, i) => {
          const alt = `${toTitleCase(cat.folder)} ${i + 1}`;

          return {
            full: `${BASE}/${cat.folder}/image${i}.jpg`,
            thumb: `${BASE}/${cat.folder}/resize/image${i}.jpg`,
            alt,
            caption: CAPTIONS[cat.folder]?.[i] || ''
          };
        })
      );
    }
    const cat = CATEGORIES.find((c) => c.folder === folder);
    if (!cat) return [];
    return Array.from({ length: cat.count }, (_, i) => {
      const alt = `${toTitleCase(folder)} ${i + 1}`;

      return {
        full: `${BASE}/${folder}/image${i}.jpg`,
        thumb: `${BASE}/${folder}/resize/image${i}.jpg`,
        alt,
        caption: CAPTIONS[folder]?.[i] || ''
      };
    });
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

function updateGalleryCaption(index) {
  const captionEl = el('#galleryCaption');
  if (!captionEl) return;

  const image = currentImages[index];

  if (!image) {
    captionEl.textContent = '';
    return;
  }

  captionEl.innerHTML =
    image.caption || `${image.alt}`;
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
          updateGalleryCaption(this.realIndex);
          maybeUpdateHash(currentFolder, this.realIndex);
        },
        slideChange() {
          setActiveThumb(this.realIndex);
          updateGalleryCaption(this.realIndex);
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

    currentImages = buildImagesFor(folder);
    const images = currentImages;
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
      updateGalleryCaption(startAt);
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

