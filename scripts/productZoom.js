import PhotoSwipeLightbox from 'https://unpkg.com/photoswipe@5.4.3/dist/photoswipe-lightbox.esm.js';

const lightbox = new PhotoSwipeLightbox({
  gallery: '#products-gallery',
  children: 'a',
  pswpModule: () => import('https://unpkg.com/photoswipe@5.4.3/dist/photoswipe.esm.js')
});

const assortmentLightbox = new PhotoSwipeLightbox({
  gallery: '#assortment-gallery',
  children: 'a',
  pswpModule: () => import('https://unpkg.com/photoswipe@5.4.3/dist/photoswipe.esm.js')
});

lightbox.init();
assortmentLightbox.init();

document.getElementById('btn-assortment').addEventListener('click', () => {
  assortmentLightbox.loadAndOpen(0);
});
