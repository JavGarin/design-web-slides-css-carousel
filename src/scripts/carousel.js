/**
 * ============================================
 * ENERGY STORE — CAROUSEL ENGINE (Astro Client Script)
 * Motor de animacion circular clip-path y traslaciones
 * ============================================
 */

class CarouselEngine {
  constructor(container, products) {
    this.container = container;
    this.products = products;
    this.active = 1;
    this.other_1 = 0;
    this.other_2 = 2;
    this.autoPlayTimer = null;

    this.init();
  }

  init() {
    this.render();
    this.start();
  }

  render() {
    const list = this.container.querySelector('.list');
    if (!list) return;

    list.innerHTML = '';

    this.products.forEach((product, index) => {
      const item = document.createElement('article');
      item.classList.add('item');

      if (index === 1) item.classList.add('active');
      if (index === 0) item.classList.add('other_1');
      if (index === 2) item.classList.add('other_2');

      item.innerHTML = `
        <div class="main-content" style="background-color: ${product.bgColor};">
          <div class="content">
            <div class="text-card">
              <h2>${product.title}</h2>
              <p class="price">${product.price}</p>
              <p class="description">${product.description}</p>
            </div>
            <button class="addToCard" type="button" aria-label="Comprar ${product.title}">
              <span class="btn-text">Comprar</span>
              <span class="btn-icon" aria-hidden="true">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z"/>
                </svg>
              </span>
            </button>
          </div>
        </div>
        <figure class="image">
          <img src="${product.image}" alt="${product.title}" loading="eager">
          <figcaption>${product.figcaption}</figcaption>
        </figure>
      `;

      list.appendChild(item);
    });
  }

  start() {
    const next = document.getElementById('next');
    const prev = document.getElementById('prev');
    const items = this.container.querySelectorAll('.item');
    const carousel = this.container;
    const countItem = items.length;

    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
    }

    items.forEach(item => {
      item.classList.remove('active', 'other_1', 'other_2');
    });

    this.active = 1;
    this.other_1 = 0;
    this.other_2 = 2;

    items[this.active]?.classList.add('active');
    items[this.other_1]?.classList.add('other_1');
    items[this.other_2]?.classList.add('other_2');

    const changeSlider = () => {
      items.forEach(item => item.classList.remove('active', 'other_1', 'other_2'));

      items.forEach(e => {
        const img = e.querySelector('.image img');
        const figcaption = e.querySelector('.image figcaption');
        const mainContent = e.querySelector('.main-content');
        if (img) img.style.animation = 'none';
        if (figcaption) figcaption.style.animation = 'none';
        if (mainContent) mainContent.style.animation = 'none';

        void e.offsetWidth;

        if (img) img.style.animation = '';
        if (figcaption) figcaption.style.animation = '';
        if (mainContent) mainContent.style.animation = '';
      });

      items[this.active]?.classList.add('active');
      items[this.other_1]?.classList.add('other_1');
      items[this.other_2]?.classList.add('other_2');

      startAutoPlay();
    };

    const startAutoPlay = () => {
      stopAutoPlay();
      this.autoPlayTimer = setInterval(goNext, 8500);
    };

    const stopAutoPlay = () => {
      if (this.autoPlayTimer) {
        clearInterval(this.autoPlayTimer);
        this.autoPlayTimer = null;
      }
    };

    const goNext = () => {
      carousel.classList.remove('prev');
      carousel.classList.add('next');
      this.active = (this.active + 1) % countItem;
      this.other_1 = (this.active - 1 + countItem) % countItem;
      this.other_2 = (this.active + 1) % countItem;
      changeSlider();
    };

    const goPrev = () => {
      carousel.classList.remove('next');
      carousel.classList.add('prev');
      this.active = (this.active - 1 + countItem) % countItem;
      this.other_1 = (this.active + 1) % countItem;
      this.other_2 = (this.other_1 + 1) % countItem;
      changeSlider();
    };

    if (next) {
      next.onclick = (e) => {
        e?.stopPropagation?.();
        goNext();
      };
    }

    if (prev) {
      prev.onclick = (e) => {
        e?.stopPropagation?.();
        goPrev();
      };
    }

    // ============================================
    // PROTECCIÓN UX DE LECTURA Y COMPRA (Desktop & Mobile)
    // ============================================

    // 1. Pausar autoplay cuando el usuario pasa el cursor sobre el carrusel/tarjeta/botón (Desktop)
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);

    // 2. Pausar cuando un botón o texto recibe foco (Navegación accesible/teclado)
    carousel.addEventListener('focusin', stopAutoPlay);
    carousel.addEventListener('focusout', startAutoPlay);

    // 3. Gestos táctiles y lectura en Mobile
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    carousel.addEventListener('touchstart', (e) => {
      stopAutoPlay();
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      // Detectar swipe horizontal significativo (más de 40px)
      if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX < 0) {
          goNext(); // Swipe izquierda -> siguiente
        } else {
          goPrev(); // Swipe derecha -> anterior
        }
      } else {
        // Si fue solo un tap o lectura sin swipe, reanudar tiempo completo de lectura
        startAutoPlay();
      }
    }, { passive: true });

    // 4. Navegación por rueda del mouse / Scrollpad con control de inercia
    let wheelThrottle = false;
    window.addEventListener('wheel', (e) => {
      // No interferir si el usuario hace scroll dentro de los dropdowns del navbar
      if (e.target.closest('.dropdown-menu')) return;

      if (wheelThrottle) return;

      if (Math.abs(e.deltaY) > 25) {
        wheelThrottle = true;
        if (e.deltaY > 0) {
          goNext();
        } else {
          goPrev();
        }
        setTimeout(() => {
          wheelThrottle = false;
        }, 750);
      }
    }, { passive: true });

    // Clic en el indicador de scroll para avanzar producto
    const scrollIndicator = document.getElementById('scroll-indicator');
    if (scrollIndicator) {
      scrollIndicator.onclick = () => {
        goNext();
      };
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') goNext();
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') goPrev();
    });

    // Iniciar temporizador base de lectura
    startAutoPlay();

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.start();
      }, 250);
    });
  }
}

// ============================================
// DATOS DE PRODUCTOS (inline para Astro client-side)
// ============================================
const products = [
  {
    id: 'juice-punch',
    title: 'Juice Punch',
    price: '$10 USD',
    description: 'El Golpe Doble. Despierta con el intenso aroma del cafe y desata la vitalidad electrica de las frutas. La fusion definitiva creada para mantener tu ritmo imparable en jornadas de alta exigencia mental y fisica.',
    image: '/images/juice-punch.png',
    bgColor: '#9c4d2f',
    figcaption: 'Edicion Especial: Coffee Punch Fusion'
  },
  {
    id: 'berry-pink',
    title: 'Berry Pink',
    price: '$15 USD',
    description: 'Mas que una bebida, una experiencia sensorial envolvente. El dulce y electrizante sabor a fresas silvestres seleccionadas te brinda un impulso nitido de energia, envuelto en una frescura irresistible.',
    image: '/images/energy-pink.png',
    bgColor: '#f5bfaf',
    figcaption: 'Coleccion Rosa: Wild Strawberry Rush'
  },
  {
    id: 'ferno-strong',
    title: 'Ferno Strong',
    price: '$12 USD',
    description: 'Tu Combustible Definitivo de Alto Rendimiento. Formula termo-activa disenada con cafeina anhidra, beta-alanina pura y aminoacidos que disparan tu resistencia y concentracion desde el primer sorbo.',
    image: '/images/energy-strong.png',
    bgColor: '#c62f17',
    figcaption: 'Powerhouse Series: Pre-Workout Extreme'
  },
  {
    id: 'energy-hulk',
    title: 'Energy Hulk',
    price: '$11 USD',
    description: 'La energia mas demoledora viste de verde y sabe a limonada acida ultra concentrada. Una formula extrema con taurina pura y electrolitos que recarga cada fibra muscular para aquellos que no aceptan limites.',
    image: '/images/energy-hulk.png',
    bgColor: '#7eb63d',
    figcaption: 'Titan Edition: Ultra Acid Shock'
  }
];

// ============================================
// INICIALIZACION — Astro ejecuta scripts despues del DOM
// ============================================

// Loading Screen (2 segundos)
const loader = document.getElementById('app-loader');
if (loader) {
  setTimeout(() => {
    loader.classList.add('fade-out');
    setTimeout(() => {
      loader.style.display = 'none';
    }, 650);
  }, 2000);
}

// Carousel Engine
const carouselContainer = document.querySelector('.carousel');
if (carouselContainer) {
  new CarouselEngine(carouselContainer, products);
}
