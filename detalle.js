/**
 * @file detalle.js
 * @description Lógica del carrusel 3D de Consultora Tres Valles.
 * Gestiona: datos por categoría, navegación del carrusel (flechas,
 * teclado, swipe táctil, indicadores), panel de información y
 * switcher de categorías con historial de URL.
 */

/* ============================================================
   1. DATA POR CATEGORÍA
   Fuente única de verdad. Para agregar un ítem nuevo basta
   con añadir un objeto al array items de la categoría.
   Campos requeridos: tag, title, image, description,
   duration, mode, level, benefits[].
============================================================ */

/** @typedef {{ tag: string, title: string, image: string, description: string, duration: string, mode: string, level: string, benefits: string[] }} CarouselItem */

/**
 * @typedef {{ categoryBadge: string, categoryTitle: string, categorySubtitle: string, items: CarouselItem[] }} CategoryData
 */

/** @type {Record<string, CategoryData>} */
const DATA = {
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

/* ============================================================
   2. CONSTANTES
============================================================ */

/** Número de píxeles mínimo para considerar un swipe válido. */
const SWIPE_THRESHOLD = 50;

/**
 * Tiempo en ms que tarda la animación de transición del carrusel.
 * Debe coincidir con el valor definido en detalle.css.
 */
const ANIMATION_DURATION = 720;

/** Número de teléfono de WhatsApp (sin + ni espacios). */
const WA_NUMBER = "56971486076";

/* ============================================================
   3. ESTADO GLOBAL
   Todas las variables mutables en un solo objeto para
   evitar contaminación del scope global y facilitar debug.
============================================================ */

/**
 * @type {{ type: string, data: CategoryData, index: number, animating: boolean }}
 */
const state = {
  /** Categoría activa: "cursos" | "asesorias" | "capacitaciones" */
  type: new URLSearchParams(window.location.search).get("tipo") || "cursos",
  /** Datos de la categoría activa */
  data: null,
  /** Índice de la tarjeta activa */
  index: 0,
  /** Bloqueo para evitar saltos durante animaciones */
  animating: false
};

// Fallback seguro: si el tipo de URL no existe en DATA, vuelve a "cursos"
state.data = DATA[state.type] ?? DATA.cursos;

/* ============================================================
   4. UTILIDADES
============================================================ */

/**
 * Calcula la diferencia circular entre dos índices en un array
 * cerrado, eligiendo siempre el camino más corto.
 * Ej: con total=3, diff entre índice 0 y 2 es -1 (no +2).
 *
 * @param {number} index   - Índice del elemento a evaluar.
 * @param {number} current - Índice actualmente activo.
 * @param {number} total   - Cantidad total de elementos.
 * @returns {number} Diferencia en rango [-(total/2), total/2].
 */
function getCircularDiff(index, current, total) {
  let diff = index - current;
  if (diff > total / 2) diff -= total;
  if (diff < -total / 2) diff += total;
  return diff;
}

/**
 * Normaliza un índice para que siempre esté dentro del rango
 * válido del array, con wrap-around circular.
 *
 * @param {number} index - Índice crudo (puede ser negativo o mayor que total).
 * @param {number} total - Longitud del array.
 * @returns {number} Índice normalizado.
 */
function wrapIndex(index, total) {
  return (index + total) % total;
}

/* ============================================================
   5. INICIALIZACIÓN — espera a que el DOM esté listo
============================================================ */

document.addEventListener("DOMContentLoaded", () => {

  /* ----------------------------------------------------------
     5.1 Referencias al DOM
     Agrupadas al inicio para tener visibilidad de todas
     las dependencias del script de un vistazo.
  ---------------------------------------------------------- */
  const carouselTrack      = document.getElementById("carouselTrack");
  const carouselIndicators = document.getElementById("carouselIndicators");
  const prevBtn            = document.getElementById("prevBtn");
  const nextBtn            = document.getElementById("nextBtn");
  const switchBtns         = document.querySelectorAll(".switch-btn");

  // Elementos opcionales de cabecera (pueden no existir en el HTML)
  const categoryBadge    = document.getElementById("categoryBadge");
  const categoryTitle    = document.getElementById("categoryTitle");
  const categorySubtitle = document.getElementById("categorySubtitle");

  // Guard: si el carrusel no existe, no hay nada que inicializar
  if (!carouselTrack) return;

  /* ----------------------------------------------------------
     5.2 Construcción del carrusel (se llama en init y al cambiar categoría)
  ---------------------------------------------------------- */

  /**
   * Construye las tarjetas del carrusel a partir de los datos
   * de la categoría activa. Usa innerHTML una sola vez para
   * minimizar reflows.
   */
  function buildCards() {
    carouselTrack.innerHTML = state.data.items.map((item, index) => `
      <article class="carousel-card is-hidden" data-index="${index}" tabindex="0" aria-label="${item.tag}: ${item.title}">
        <img src="${item.image}" alt="${item.title}" loading="lazy">
        <div class="card-overlay" aria-hidden="true">
          <span class="card-tag">${item.tag}</span>
          <h3>${item.title}</h3>
        </div>
      </article>
    `).join("");
  }

  /**
   * Aplica las clases de posición 3D a cada tarjeta según
   * su distancia circular al índice activo.
   * Las clases CSS (.is-center, .is-left-1, etc.) controlan
   * la transformación 3D definida en detalle.css.
   */
  function updateCardStates() {
    const cards = Array.from(carouselTrack.querySelectorAll(".carousel-card"));
    const total = cards.length;

    cards.forEach((card, index) => {
      const diff = getCircularDiff(index, state.index, total);

      // Limpiamos todas las clases de posición antes de asignar la nueva
      card.classList.remove("is-center", "is-left-1", "is-right-1", "is-left-2", "is-right-2", "is-hidden");

      if      (diff === 0)               card.classList.add("is-center");
      else if (diff === -1)              card.classList.add("is-left-1");
      else if (diff ===  1)              card.classList.add("is-right-1");
      else if (diff === -2 && total > 4) card.classList.add("is-left-2");
      else if (diff ===  2 && total > 4) card.classList.add("is-right-2");
      else                               card.classList.add("is-hidden");

      // Accesibilidad: la tarjeta central es la "seleccionada"
      card.setAttribute("aria-selected", diff === 0 ? "true" : "false");
    });
  }

  /* ----------------------------------------------------------
     5.3 Indicadores (puntitos)
  ---------------------------------------------------------- */

  /**
   * Genera los botones indicadores debajo del carrusel.
   * Cada uno navega directamente al índice correspondiente.
   */
  function buildIndicators() {
    if (!carouselIndicators) return;
    carouselIndicators.innerHTML = "";

    state.data.items.forEach((item, index) => {
      const btn = document.createElement("button");
      btn.className = "carousel-indicator";
      btn.setAttribute("aria-label", `Ver ${item.title}`);
      if (index === state.index) btn.classList.add("active");

      btn.addEventListener("click", () => {
        if (!state.animating && index !== state.index) goToIndex(index);
      });

      carouselIndicators.appendChild(btn);
    });
  }

  /**
   * Sincroniza el indicador activo con el índice actual
   * sin reconstruir todo el DOM.
   */
  function syncIndicators() {
    if (!carouselIndicators) return;
    carouselIndicators.querySelectorAll(".carousel-indicator").forEach((btn, i) => {
      btn.classList.toggle("active", i === state.index);
    });
  }

  /* ----------------------------------------------------------
     5.4 Panel de información
  ---------------------------------------------------------- */

  /**
   * Actualiza el panel de información lateral/inferior con los
   * datos del ítem activo: título, descripción, metas y link WA.
   * También dispara la animación de entrada del panel.
   */
  function renderInfo() {
    const item = state.data.items[state.index];
    if (!item) return;

    // Actualizamos contenido
    document.getElementById("infoMiniTag").textContent    = item.tag;
    document.getElementById("infoTitle").textContent      = item.title;
    document.getElementById("infoDescription").textContent = item.description;
    document.getElementById("infoDuration").textContent   = item.duration;
    document.getElementById("infoMode").textContent       = item.mode;
    document.getElementById("infoLevel").textContent      = item.level;

    const benefitsList = document.getElementById("infoBenefits");
    if (benefitsList) {
      benefitsList.innerHTML = item.benefits.map(b => `<li>${b}</li>`).join("");
    }

    // Enlace dinámico de WhatsApp con mensaje pre-escrito
    const message = encodeURIComponent(
      `Hola, me interesa ${item.title} de la sección ${state.data.categoryBadge}. Quisiera más información.`
    );
    const infoBtn = document.getElementById("infoButton");
    if (infoBtn) infoBtn.href = `https://wa.me/${WA_NUMBER}?text=${message}`;

    // Animación de entrada del panel
    animateInfoBox();
  }

  /**
   * Dispara la animación fade+slide del panel de información.
   * Usa un reflow forzado (offsetHeight) para reiniciar la
   * transición CSS aunque el elemento ya esté visible.
   */
  function animateInfoBox() {
    const infoBox = document.getElementById("infoBox");
    if (!infoBox) return;

    infoBox.style.transition = "none";
    infoBox.style.opacity    = "0";
    infoBox.style.transform  = "translateY(15px)";

    // Forzamos reflow para que el navegador registre el estado inicial
    // antes de aplicar la transición. Sin esta línea la animación no ocurre.
    void infoBox.offsetHeight;

    infoBox.style.transition = "opacity 0.4s ease, transform 0.4s ease";
    infoBox.style.opacity    = "1";
    infoBox.style.transform  = "translateY(0)";
  }

  /* ----------------------------------------------------------
     5.5 Navegación
  ---------------------------------------------------------- */

  /**
   * Navega el carrusel al índice indicado con wrap-around
   * circular y bloqueo anti-spam durante la animación.
   *
   * @param {number} index - Índice destino (puede ser fuera de rango).
   */
  function goToIndex(index) {
    if (state.animating) return;

    state.animating = true;
    state.index = wrapIndex(index, state.data.items.length);

    updateCardStates();
    syncIndicators();
    renderInfo();

    // Liberamos el bloqueo tras el tiempo de animación CSS
    setTimeout(() => { state.animating = false; }, ANIMATION_DURATION);
  }

  /* ----------------------------------------------------------
     5.6 Eventos de interacción
  ---------------------------------------------------------- */

  /**
   * Asigna el evento click a cada tarjeta del carrusel.
   * Se llama tras buildCards() ya que el DOM se regenera
   * en cada cambio de categoría.
   */
  function bindCardClicks() {
    carouselTrack.querySelectorAll(".carousel-card").forEach(card => {
      // Click con ratón
      card.addEventListener("click", () => {
        const idx = Number(card.dataset.index);
        if (!state.animating && idx !== state.index) goToIndex(idx);
      });

      // Enter/Space con teclado (las tarjetas tienen tabindex="0")
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          const idx = Number(card.dataset.index);
          if (!state.animating && idx !== state.index) goToIndex(idx);
        }
      });
    });
  }

  /**
   * Actualiza el estado visual del switcher de categorías,
   * marcando como activo el botón correspondiente al tipo actual.
   *
   * @param {string} type - Clave de categoría activa.
   */
  function syncSwitchBtns(type) {
    switchBtns.forEach(btn => btn.classList.toggle("active", btn.dataset.type === type));
  }

  // Switcher de categorías
  switchBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.type;
      if (state.animating || type === state.type) return;

      state.type  = type;
      state.data  = DATA[type];
      state.index = 0;

      // Refleja el cambio en la URL sin recargar la página
      window.history.pushState({}, "", `?tipo=${type}`);

      init();
    });
  });

  // Flechas laterales
  if (prevBtn) prevBtn.addEventListener("click", () => goToIndex(state.index - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => goToIndex(state.index + 1));

  // Navegación por teclado (flechas izquierda/derecha)
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft")  goToIndex(state.index - 1);
    if (e.key === "ArrowRight") goToIndex(state.index + 1);
  });

  /* ----------------------------------------------------------
     5.7 Soporte táctil (swipe)
     Registra posición inicial en touchstart y calcula
     dirección en touchend. touchmove con passive:true
     permite scroll nativo sin bloquear el hilo principal.
  ---------------------------------------------------------- */

  let touchStartX = 0;

  carouselTrack.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  carouselTrack.addEventListener("touchend", (e) => {
    if (state.animating) return;
    const distance = e.changedTouches[0].screenX - touchStartX;

    if      (distance < -SWIPE_THRESHOLD) goToIndex(state.index + 1); // swipe izquierda → siguiente
    else if (distance >  SWIPE_THRESHOLD) goToIndex(state.index - 1); // swipe derecha  → anterior
  }, { passive: true });

  /* ----------------------------------------------------------
     5.8 init() — función raíz que construye el carrusel completo.
     Se llama al cargar y al cambiar de categoría.
  ---------------------------------------------------------- */

  /**
   * Inicializa o reinicializa el carrusel completo:
   * construye tarjetas, indicadores, panel de info,
   * sincroniza UI y enlaza eventos de click.
   */
  function init() {
    buildCards();
    buildIndicators();
    renderInfo();
    syncSwitchBtns(state.type);
    updateCardStates();
    bindCardClicks();

    // Actualiza textos de cabecera opcionales
    if (categoryBadge)    categoryBadge.textContent    = state.data.categoryBadge;
    if (categoryTitle)    categoryTitle.textContent    = state.data.categoryTitle;
    if (categorySubtitle) categorySubtitle.textContent = state.data.categorySubtitle;

    // Actualiza el <title> del documento
    document.title = `${state.data.categoryBadge} | Consultora Tres Valles`;
  }

  // ¡Arranca!
  init();

}); // fin DOMContentLoaded