/**
 * @file script.js
 * @description Lógica principal del index de Consultora Tres Valles.
 * Maneja: animaciones de scroll reveal, comportamiento del header y menú móvil.
 */

/* =========================
   SCROLL REVEAL
   Activa animaciones cuando los
   elementos entran en el viewport.
   Se desconecta tras activarse
   para no seguir corriendo.
========================= */

/**
 * Observer que añade la clase 'active' a cada elemento
 * con clase 'reveal' cuando entra en el viewport.
 * Usa unobserve para liberar memoria una vez activado.
 * @type {IntersectionObserver}
 */
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('active');
    observer.unobserve(entry.target);
  });
}, {
  threshold: 0.15
});

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

/* =========================
   HEADER AL SCROLL
   Añade clase 'scrolled' para
   aumentar opacidad del fondo
   al bajar más de 50px.
========================= */

/** @type {HTMLElement} */
const header = document.querySelector('.header');

if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
}

/* =========================
   MENÚ HAMBURGUESA
   Controla apertura/cierre del
   menú en mobile. Actualiza el
   ícono y el aria-expanded para
   accesibilidad.
========================= */

/** @type {HTMLElement} */
const menuToggle = document.querySelector('.menu-toggle');

/** @type {HTMLElement} */
const navMenu = document.getElementById('mainNav');

if (menuToggle && navMenu) {
  const menuIcon = menuToggle.querySelector('i');
  const navLinks = navMenu.querySelectorAll('a');

  /**
   * Abre o cierra el menú móvil.
   * Actualiza ícono y aria-expanded acorde al estado.
   * @param {boolean} open - true para abrir, false para cerrar.
   */
  function setMenuState(open) {
    navMenu.classList.toggle('active', open);
    menuToggle.setAttribute('aria-expanded', open);
    menuIcon.classList.toggle('fa-bars', !open);
    menuIcon.classList.toggle('fa-xmark', open);
  }

  // Abrir / cerrar al click del botón
  menuToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.contains('active');
    setMenuState(!isOpen);
  });

  // Cerrar automáticamente al navegar a una sección
  navLinks.forEach((link) => {
    link.addEventListener('click', () => setMenuState(false));
  });

  // Cerrar con tecla Escape — accesibilidad de teclado
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      setMenuState(false);
      menuToggle.focus(); // devuelve el foco al botón
    }
  });
}