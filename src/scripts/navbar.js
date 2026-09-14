/**
 * ============================================
 * ENERGY STORK — NAVBAR INTERACTIVE DROPDOWNS
 * Control de apertura por clic, accesibilidad y cierre exclusivo
 * ============================================
 */

export function initNavbarDropdowns() {
  const nav = document.querySelector('.header-minimal-nav');
  if (!nav) return;

  // Evitar doble inicialización o acumulación de listeners
  if (nav.dataset.dropdownInit === 'true') return;
  nav.dataset.dropdownInit = 'true';

  const navDropdowns = Array.from(nav.querySelectorAll('.nav-dropdown'));
  if (!navDropdowns.length) return;

  const closeAll = () => {
    navDropdowns.forEach(d => {
      d.classList.remove('is-open');
      const btn = d.querySelector('.nav-btn');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  };

  const openDropdown = (target) => {
    // Cerrar cualquier otro dropdown activo
    navDropdowns.forEach(d => {
      if (d !== target) {
        d.classList.remove('is-open');
        const otherBtn = d.querySelector('.nav-btn');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      }
    });

    target.classList.add('is-open');
    const targetBtn = target.querySelector('.nav-btn');
    if (targetBtn) targetBtn.setAttribute('aria-expanded', 'true');
  };

  const toggleDropdown = (target) => {
    const isOpen = target.classList.contains('is-open');
    if (isOpen) {
      target.classList.remove('is-open');
      const btn = target.querySelector('.nav-btn');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    } else {
      openDropdown(target);
    }
  };

  navDropdowns.forEach(dropdown => {
    const btn = dropdown.querySelector('.nav-btn');
    if (!btn) return;

    // Clic en el botón: abre el seleccionado y cierra de inmediato cualquier otro
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleDropdown(dropdown);
    });

    // Clic en un elemento del menú: cierra el dropdown
    const items = dropdown.querySelectorAll('.dropdown-item');
    items.forEach(item => {
      item.addEventListener('click', () => {
        closeAll();
      });
    });
  });

  // Cerrar al hacer clic en cualquier parte fuera del navbar
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.header-minimal-nav')) {
      closeAll();
    }
  });

  // Cerrar al presionar la tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAll();
    }
  });
}

// Inicializar de forma segura en cliente
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavbarDropdowns);
  } else {
    initNavbarDropdowns();
  }
}
