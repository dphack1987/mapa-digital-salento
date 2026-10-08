// Shared Gallery Lightbox
(function(){
  let currentIndex = 0;
  let images = [];
  let lightbox, lightboxImg, lightboxCaption, lightboxClose, lightboxPrev, lightboxNext;

  function initLightbox() {
    const gallery = document.querySelector('.gallery');
    if (!gallery) return;

    lightbox = document.getElementById('lightbox');
    lightboxImg = document.getElementById('lightboxImg');
    lightboxCaption = document.getElementById('lightboxCaption');
    lightboxClose = document.getElementById('lightboxClose');
    lightboxPrev = document.getElementById('lightboxPrev');
    lightboxNext = document.getElementById('lightboxNext');

    if (!lightbox) {
      createLightboxElements();
      lightbox = document.getElementById('lightbox');
      lightboxImg = document.getElementById('lightboxImg');
      lightboxCaption = document.getElementById('lightboxCaption');
      lightboxClose = document.getElementById('lightboxClose');
      lightboxPrev = document.getElementById('lightboxPrev');
      lightboxNext = document.getElementById('lightboxNext');
    }

    const galleryEl = document.querySelector('.gallery');
    if (!galleryEl) return;

    images = Array.from(galleryEl.querySelectorAll('img'));
    images.forEach((img, i) => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => openLightbox(i));
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => navigate(-1));
    lightboxNext.addEventListener('click', () => navigate(1));
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    });
  }

  function createLightboxElements() {
    const lightboxHTML = `
      <div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Imagen ampliada">
        <button class="lightbox-close" id="lightboxClose" aria-label="Cerrar">×</button>
        <button class="lightbox-prev" id="lightboxPrev" aria-label="Anterior">‹</button>
        <button class="lightbox-next" id="lightboxNext" aria-label="Siguiente">›</button>
        <img id="lightboxImg" src="" alt="" />
        <div class="lightbox-caption" id="lightboxCaption"></div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    lightbox = document.getElementById('lightbox');
    lightboxImg = document.getElementById('lightboxImg');
    lightboxCaption = document.getElementById('lightboxCaption');
    lightboxClose = document.getElementById('lightboxClose');
    lightboxPrev = document.getElementById('lightboxPrev');
    lightboxNext = document.getElementById('lightboxNext');

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => navigate(-1));
    lightboxNext.addEventListener('click', () => navigate(1));
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    });
  }

  function openLightbox(index) {
    const gallery = document.querySelector('.gallery');
    if (!gallery) return;
    images = Array.from(gallery.querySelectorAll('img'));
    if (images.length === 0) return;
    currentIndex = index;
    updateLightbox();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function navigate(dir) {
    currentIndex = (currentIndex + dir + images.length) % images.length;
    updateLightbox();
  }

  function updateLightbox() {
    const img = images[currentIndex];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = img.alt || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLightbox);
  } else {
    initLightbox();
  }
})();