/**
 * ============================================
 * ENERGY STORK — NAVBAR INTERACTIVE DROPDOWNS
 * Control de apertura, accesibilidad y cierre en Web & Mobile
 * ============================================
 */

export function initNavbarDropdowns() {
  const navDropdowns = document.querySelectorAll('.nav-dropdown');
  if (!navDropdowns.length) return;

  navDropdowns.forEach(dropdown => {
    const btn = dropdown.querySelector('.nav-btn');
    if (!btn) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.contains('is-open');

      // Cerrar otros dropdowns activos
      navDropdowns.forEach(d => {
        if (d !== dropdown) {
          d.classList.remove('is-open');
          const otherBtn = d.querySelector('.nav-btn');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Alternar estado del actual
      dropdown.classList.toggle('is-open', !isOpen);
      btn.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
    });

    // Cerrar al seleccionar un elemento del menú
    const items = dropdown.querySelectorAll('.dropdown-item');
    items.forEach(item => {
      item.addEventListener('click', () => {
        dropdown.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
      });
    });
  });

  // Cerrar al hacer clic fuera del navbar y sus dropdowns
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.header-minimal-nav') && !e.target.closest('.dropdown-menu')) {
      navDropdowns.forEach(d => {
        d.classList.remove('is-open');
        const btn = d.querySelector('.nav-btn');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Cerrar con tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      navDropdowns.forEach(d => {
        d.classList.remove('is-open');
        const btn = d.querySelector('.nav-btn');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
    }
  });
}

// Inicializar en cliente
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavbarDropdowns);
  } else {
    initNavbarDropdowns();
  }
}
