/* =========================
DATA POR CATEGORÍA
Puedes editar textos e imágenes acá
========================= */
const data = {
  cursos: {
    categoryBadge: "Cursos",
    categoryTitle: "Explora nuestros cursos",
    categorySubtitle: "Selecciona una tarjeta del carrusel para revisar sus detalles.",
    items: [
      {
        tag: "Curso",
        title: "Excel Básico",
        image: "assets/images/Clases.png",
        description: "Aprende desde cero hojas de cálculo, fórmulas y organización de datos con un enfoque práctico.",
        duration: "4 semanas",
        mode: "Online / Presencial",
        level: "Inicial",
        benefits: ["Funciones básicas", "Ejemplos reales", "Uso práctico"]
      },
      {
        tag: "Curso",
        title: "Herramientas Digitales",
        image: "assets/images/Hero.png",
        description: "Mejora tu productividad digital y domina herramientas útiles para tu día a día.",
        duration: "3 semanas",
        mode: "Online",
        level: "Básico",
        benefits: ["Apps útiles", "Organización", "Flujo de trabajo"]
      },
      {
        tag: "Curso",
        title: "Gestión y Organización",
        image: "assets/images/Capacitacion.png",
        description: "Aprende a planificar, ordenar y ejecutar mejor tus tareas y procesos.",
        duration: "5 semanas",
        mode: "Mixto",
        level: "Intermedio",
        benefits: ["Planificación", "Estrategia", "Ejecución"]
      }
    ]
  },

  asesorias: {
    categoryBadge: "Asesorías",
    categoryTitle: "Explora nuestras asesorías",
    categorySubtitle: "Selecciona una tarjeta del carrusel para revisar sus detalles.",
    items: [
      {
        tag: "Asesoría",
        title: "Asesoría Tributaria",
        image: "assets/images/Asesorias.png",
        description: "Resuelve dudas específicas con orientación clara y apoyo real.",
        duration: "1 a 2 sesiones",
        mode: "Online / Presencial",
        level: "Personalizado",
        benefits: ["Atención enfocada", "Explicación clara", "Orientación práctica"]
      },
      {
        tag: "Asesoría",
        title: "Orientación Profesional",
        image: "assets/images/Hero.png",
        description: "Avanza de forma más estratégica en tu desarrollo profesional.",
        duration: "Sesión personalizada",
        mode: "Online",
        level: "Flexible",
        benefits: ["Claridad", "Acompañamiento", "Orden de objetivos"]
      },
      {
        tag: "Asesoría",
        title: "Apoyo Operativo",
        image: "assets/images/Clases.png",
        description: "Optimiza procesos y resuelve dudas operativas de forma práctica.",
        duration: "1 a 3 sesiones",
        mode: "Presencial / Online",
        level: "Aplicado",
        benefits: ["Puntos de mejora", "Revisión real", "Soluciones concretas"]
      }
    ]
  },

  capacitaciones: {
    categoryBadge: "Capacitaciones",
    categoryTitle: "Explora nuestras capacitaciones",
    categorySubtitle: "Selecciona una tarjeta del carrusel para revisar sus detalles.",
    items: [
      {
        tag: "Capacitación",
        title: "Capacitación Interna",
        image: "assets/images/Capacitacion.png",
        description: "Fortalece conocimientos y procesos de trabajo dentro de tu equipo.",
        duration: "2 jornadas",
        mode: "Presencial",
        level: "Corporativo",
        benefits: ["Necesidades reales", "Aplicación inmediata", "Metodología clara"]
      },
      {
        tag: "Capacitación",
        title: "Formación Práctica",
        image: "assets/images/Hero.png",
        description: "Desarrolla habilidades útiles con ejemplos concretos y dinámicos.",
        duration: "1 jornada intensiva",
        mode: "Online / Presencial",
        level: "General",
        benefits: ["Contenidos dinámicos", "Participación activa", "Uso real"]
      },
      {
        tag: "Capacitación",
        title: "Actualización Profesional",
        image: "assets/images/Asesorias.png",
        description: "Mantente al día con contenidos relevantes y de aplicación profesional.",
        duration: "Modular",
        mode: "Online",
        level: "Actualización",
        benefits: ["Contenido vigente", "Uso profesional", "Formato flexible"]
      }
    ]
  }
};

/* =========================
   UTILIDADES
========================= */

/* Lee parámetros de la URL, por ejemplo:
   detalle.html?tipo=cursos */
function getQueryParam(param) {
  return new URLSearchParams(window.location.search).get(param);
}

/* Hace que el índice sea circular:
   - si te pasas a la izquierda, vuelve al final
   - si te pasas a la derecha, vuelve al inicio */
function wrapIndex(index, total) {
  return (index + total) % total;
}

/* Distancia circular corta entre dos índices.
   Sirve para decidir dónde se ubica cada card
   respecto al centro. */
function getCircularDiff(index, current, total) {
  let diff = index - current;

  if (diff > total / 2) diff -= total;
  if (diff < -total / 2) diff += total;

  return diff;
}

/* =========================
   ESTADO GLOBAL
========================= */
const selectedType = getQueryParam("tipo") || "cursos";
const currentData = data[selectedType] || data.cursos;

let currentIndex = 0;
let isAnimating = false;

/* =========================
   DOM
========================= */
const carouselTrack = document.getElementById("carouselTrack");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const carouselIndicators = document.getElementById("carouselIndicators");

const categoryBadge = document.getElementById("categoryBadge");
const categoryTitle = document.getElementById("categoryTitle");
const categorySubtitle = document.getElementById("categorySubtitle");

const infoBox = document.getElementById("infoBox");
const infoMiniTag = document.getElementById("infoMiniTag");
const infoTitle = document.getElementById("infoTitle");
const infoDescription = document.getElementById("infoDescription");
const infoDuration = document.getElementById("infoDuration");
const infoMode = document.getElementById("infoMode");
const infoLevel = document.getElementById("infoLevel");
const infoBenefits = document.getElementById("infoBenefits");
const infoButton = document.getElementById("infoButton");

/* =========================
   CABECERA SUPERIOR
========================= */
function renderTop() {
  categoryBadge.textContent = currentData.categoryBadge;
  categoryTitle.textContent = currentData.categoryTitle;
  categorySubtitle.textContent = currentData.categorySubtitle;
  document.title = `${currentData.categoryBadge} | Consultora Tres Valles`;
}

/* =========================
   CREA EL HTML DE UNA CARD
========================= */
function buildCardHTML(item, index) {
  return `
    <article class="carousel-card is-hidden" data-index="${index}">
      <img src="${item.image}" alt="${item.title}">
      <div class="card-overlay">
        <span class="card-tag">${item.tag}</span>
        <h3>${item.title}</h3>
      </div>
    </article>
  `;
}

/* =========================
   RENDER DEL TRACK
   Cargamos todas las cards una vez
========================= */
function renderTrack() {
  carouselTrack.innerHTML = currentData.items
    .map((item, index) => buildCardHTML(item, index))
    .join("");

  bindCardClicks();
  updateCardStates();
}

/* =========================
   ACTUALIZA LAS POSICIONES
   VISUALES DE LAS CARDS
========================= */
function updateCardStates() {
  const cards = Array.from(carouselTrack.querySelectorAll(".carousel-card"));
  const total = cards.length;

  cards.forEach((card, index) => {
    const diff = getCircularDiff(index, currentIndex, total);

    /* Limpiamos todas las clases de estado */
    card.classList.remove(
      "is-center",
      "is-left-1",
      "is-right-1",
      "is-left-2",
      "is-right-2",
      "is-hidden"
    );

    /* Asignamos estado según cercanía al centro */
    if (diff === 0) {
      card.classList.add("is-center");
    } else if (diff === -1) {
      card.classList.add("is-left-1");
    } else if (diff === 1) {
      card.classList.add("is-right-1");
    } else if (diff === -2) {
      card.classList.add("is-left-2");
    } else if (diff === 2) {
      card.classList.add("is-right-2");
    } else {
      card.classList.add("is-hidden");
    }
  });
}

/* =========================
   CLICK EN CARDS
   Si haces click en una visible,
   se convierte en la central
========================= */
function bindCardClicks() {
  const cards = Array.from(carouselTrack.querySelectorAll(".carousel-card"));

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const newIndex = Number(card.dataset.index);
      if (isAnimating || newIndex === currentIndex) return;
      goToIndex(newIndex);
    });
  });
}

/* =========================
   INDICADORES
========================= */
function renderIndicators() {
  carouselIndicators.innerHTML = "";

  currentData.items.forEach((_, index) => {
    const button = document.createElement("button");
    button.className = "carousel-indicator";

    if (index === currentIndex) {
      button.classList.add("active");
    }

    button.addEventListener("click", () => {
      if (isAnimating || index === currentIndex) return;
      goToIndex(index);
    });

    carouselIndicators.appendChild(button);
  });
}

/* =========================
   INFO DINÁMICA
========================= */
function renderInfo() {
  const item = currentData.items[currentIndex];

  infoMiniTag.textContent = item.tag;
  infoTitle.textContent = item.title;
  infoDescription.textContent = item.description;
  infoDuration.textContent = item.duration;
  infoMode.textContent = item.mode;
  infoLevel.textContent = item.level;

  infoBenefits.innerHTML = "";
  item.benefits.forEach((benefit) => {
    const li = document.createElement("li");
    li.textContent = benefit;
    infoBenefits.appendChild(li);
  });

  const message = encodeURIComponent(
    `Hola, me interesa ${item.title} de ${currentData.categoryBadge}. Quisiera más información.`
  );
  infoButton.href = `https://wa.me/56971486076?text=${message}`;
}

/* Mini animación del panel inferior */
function animateInfoPanel() {
  infoBox.style.opacity = "0.35";
  infoBox.style.transform = "translateY(10px)";

  requestAnimationFrame(() => {
    setTimeout(() => {
      infoBox.style.opacity = "1";
      infoBox.style.transform = "translateY(0)";
    }, 40);
  });
}

/* =========================
   NAVEGACIÓN
========================= */
function goToIndex(index) {
  if (isAnimating) return;

  isAnimating = true;
  currentIndex = wrapIndex(index, currentData.items.length);

  updateCardStates();
  renderIndicators();
  renderInfo();
  animateInfoPanel();

  setTimeout(() => {
    isAnimating = false;
  }, 720);
}

function goNext() {
  goToIndex(currentIndex + 1);
}

function goPrev() {
  goToIndex(currentIndex - 1);
}

/* =========================
   EVENTOS
========================= */
prevBtn.addEventListener("click", goPrev);
nextBtn.addEventListener("click", goNext);

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") goPrev();
  if (event.key === "ArrowRight") goNext();
});

/* =========================
   INIT
========================= */
function init() {
  renderTop();
  renderTrack();
  renderIndicators();
  renderInfo();
}

init();