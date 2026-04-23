// =========================
//   REVEAL AL SCROLL
//   unobserve después de activar
//   para no seguir corriendo
// =========================
const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      obs.unobserve(entry.target); // se desconecta una vez activado
    }
  });
}, {
  threshold: 0.15
});

document.querySelectorAll('.reveal').forEach((el) => {
  observer.observe(el);
});

// =========================
//   HEADER AL SCROLL
// =========================
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true }); // passive: true mejora el rendimiento del scroll

// =========================
//   MENÚ HAMBURGUESA
// =========================
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.getElementById('mainNav');
const navLinks = document.querySelectorAll('.nav a');
const menuIcon = menuToggle.querySelector('i');

// Al hacer clic en el botón (Abrir/Cerrar)
menuToggle.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  
  // Cambiar el ícono entre hamburguesa (bars) y la cruz (xmark)
  if (navMenu.classList.contains('active')) {
    menuIcon.classList.remove('fa-bars');
    menuIcon.classList.add('fa-xmark');
  } else {
    menuIcon.classList.remove('fa-xmark');
    menuIcon.classList.add('fa-bars');
  }
});

// Al hacer clic en cualquier enlace del menú (Cerrar automáticamente)
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
    menuIcon.classList.remove('fa-xmark');
    menuIcon.classList.add('fa-bars');
  });
});