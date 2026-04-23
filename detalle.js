/* ============================================================
   1. DATA POR CATEGORÍA (Tus textos e imágenes)
   ============================================================ */
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
  
/* ============================================================
   2. ESTADO GLOBAL
   ============================================================ */
let selectedType = new URLSearchParams(window.location.search).get("tipo") || "cursos";
let currentData = data[selectedType] || data.cursos;
let currentIndex = 0;
let isAnimating = false;

/* ============================================================
   3. INICIALIZACIÓN SEGURA (Espera a que cargue el HTML)
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
    
    // Referencias al DOM
    const carouselTrack = document.getElementById("carouselTrack");
    const carouselIndicators = document.getElementById("carouselIndicators");
    const switchBtns = document.querySelectorAll('.switch-btn');
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    // Elementos de texto de la cabecera
    const categoryBadge = document.getElementById("categoryBadge"); // Puede que ya no exista si pusiste los botones encima, pero por si acaso
    const categoryTitle = document.getElementById("categoryTitle");
    const categorySubtitle = document.getElementById("categorySubtitle");

    // Función principal que construye todo
    function init() {
        if (!carouselTrack) return; // Si no encuentra el carrusel, se detiene para no dar error
        
        // Limpiamos contenido anterior
        carouselTrack.innerHTML = "";
        if (carouselIndicators) carouselIndicators.innerHTML = "";

        // Escribimos textos de la cabecera
        if (categoryBadge) categoryBadge.textContent = currentData.categoryBadge;
        if (categoryTitle) categoryTitle.textContent = currentData.categoryTitle;
        if (categorySubtitle) categorySubtitle.textContent = currentData.categorySubtitle;
        document.title = `${currentData.categoryBadge} | Consultora Tres Valles`;

        // Creamos las tarjetas
        carouselTrack.innerHTML = currentData.items.map((item, index) => `
            <article class="carousel-card is-hidden" data-index="${index}">
                <img src="${item.image}" alt="${item.title}">
                <div class="card-overlay">
                    <span class="card-tag">${item.tag}</span>
                    <h3>${item.title}</h3>
                </div>
            </article>
        `).join("");

        // Llamamos a las funciones que arman el resto
        renderIndicators();
        renderInfo();
        updateActiveBtn(selectedType);
        updateCardStates();
        bindCardClicks();
    }

    // Calcula las posiciones 3D
    function updateCardStates() {
        const cards = Array.from(carouselTrack.querySelectorAll(".carousel-card"));
        const total = cards.length;
        
        cards.forEach((card, index) => {
            const diff = getCircularDiff(index, currentIndex, total);
            card.classList.remove("is-center","is-left-1","is-right-1","is-left-2","is-right-2","is-hidden");
            
            if (diff === 0) card.classList.add("is-center");
            else if (diff === -1) card.classList.add("is-left-1");
            else if (diff === 1) card.classList.add("is-right-1");
            else if (diff === -2 && total > 4) card.classList.add("is-left-2");
            else if (diff === 2 && total > 4) card.classList.add("is-right-2");
            else card.classList.add("is-hidden");
        });
    }

    // Pinta los puntitos de abajo
    function renderIndicators() {
        if (!carouselIndicators) return;
        currentData.items.forEach((_, index) => {
            const button = document.createElement("button");
            button.className = "carousel-indicator";
            if (index === currentIndex) button.classList.add("active");
            button.onclick = () => {
                if (!isAnimating && index !== currentIndex) goToIndex(index);
            };
            carouselIndicators.appendChild(button);
        });
    }

    // Pinta la info de la tarjeta seleccionada
    function renderInfo() {
        const item = currentData.items[currentIndex];
        if (!item) return;
        
        document.getElementById("infoMiniTag").textContent = item.tag;
        document.getElementById("infoTitle").textContent = item.title;
        document.getElementById("infoDescription").textContent = item.description;
        document.getElementById("infoDuration").textContent = item.duration;
        document.getElementById("infoMode").textContent = item.mode;
        document.getElementById("infoLevel").textContent = item.level;

        const benefitsList = document.getElementById("infoBenefits");
        if (benefitsList) {
            benefitsList.innerHTML = item.benefits.map(b => `<li>${b}</li>`).join("");
        }

        const message = encodeURIComponent(`Hola, me interesa ${item.title} de la sección ${currentData.categoryBadge}. Quisiera más información.`);
        const infoBtn = document.getElementById("infoButton");
        if(infoBtn) infoBtn.href = `https://wa.me/56971486076?text=${message}`;
    }

    // Movimiento del carrusel
    function goToIndex(index) {
        if (isAnimating) return;
        isAnimating = true;
        currentIndex = (index + currentData.items.length) % currentData.items.length;
        
        updateCardStates();
        
        if (carouselIndicators) {
            const inds = carouselIndicators.querySelectorAll('.carousel-indicator');
            inds.forEach((btn, i) => btn.classList.toggle('active', i === currentIndex));
        }
        
        renderInfo();
        
        // Animación de la caja de info
        const infoBox = document.getElementById("infoBox");
        if (infoBox) {
            infoBox.style.transition = "none";
            infoBox.style.opacity = "0";
            infoBox.style.transform = "translateY(15px)";
            infoBox.offsetHeight; // Reflow
            infoBox.style.transition = "opacity 0.4s ease, transform 0.4s ease";
            infoBox.style.opacity = "1";
            infoBox.style.transform = "translateY(0)";
        }

        setTimeout(() => { isAnimating = false; }, 720); // Mismo tiempo que en CSS
    }

    // Clicks en las tarjetas
    function bindCardClicks() {
        carouselTrack.querySelectorAll(".carousel-card").forEach(card => {
            card.onclick = () => {
                const idx = Number(card.dataset.index);
                if (!isAnimating && idx !== currentIndex) goToIndex(idx);
            };
        });
    }

    // Switcher Visual (Botones de arriba)
    function updateActiveBtn(type) {
        switchBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.type === type));
    }

    // Eventos del Switcher (Botones de arriba)
    switchBtns.forEach(btn => {
        btn.onclick = () => {
            const type = btn.dataset.type;
            if (isAnimating || type === selectedType) return; // Evita recargar si ya estás ahí
            
            selectedType = type;
            currentData = data[type];
            currentIndex = 0; // Vuelve a la primera tarjeta
            
            // Cambia la URL visualmente
            window.history.pushState({}, '', `?tipo=${type}`);
            
            init(); // Reconstruye todo
        };
    });

    // Flechas laterales
    if (prevBtn) prevBtn.onclick = () => goToIndex(currentIndex - 1);
    if (nextBtn) nextBtn.onclick = () => goToIndex(currentIndex + 1);

    // Teclado
    window.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") goToIndex(currentIndex - 1);
        if (event.key === "ArrowRight") goToIndex(currentIndex + 1);
    });

    /* ============================================================
   5. MAGIA TÁCTIL (Swipe en celulares)
   ============================================================ */
let touchStartX = 0;
let touchEndX = 0;
const SWIPE_THRESHOLD = 50; // Cuántos píxeles hay que mover el dedo para que cuente como swipe

// Escuchamos cuando el usuario pone el dedo en la pantalla
carouselTrack.addEventListener('touchstart', (event) => {
    touchStartX = event.changedTouches[0].screenX;
});

// Escuchamos cuando el usuario saca el dedo de la pantalla
carouselTrack.addEventListener('touchend', (event) => {
    touchEndX = event.changedTouches[0].screenX;
    handleSwipe();
});

// Lógica para decidir si movió a la izquierda o a la derecha
function handleSwipe() {
    // Si la animación está corriendo, ignoramos el swipe para no bugear
    if (isAnimating) return;

    const distance = touchEndX - touchStartX;

    // Si la distancia es negativa (dedo fue a la izquierda), queremos la siguiente tarjeta
    if (distance < -SWIPE_THRESHOLD) {
        goToIndex(currentIndex + 1);
    }
    // Si la distancia es positiva (dedo fue a la derecha), queremos la tarjeta anterior
    else if (distance > SWIPE_THRESHOLD) {
        goToIndex(currentIndex - 1);
    }
}

    // ¡Arranca la máquina!
    init(); 
});

/* ============================================================
   4. UTILIDADES MATEMÁTICAS (No tocar)
   ============================================================ */
function getCircularDiff(index, current, total) {
    let diff = index - current;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
}