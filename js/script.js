// UTILIDAD: año en footer
document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  } 

  setupSmoothScroll();
  setupActiveNavOnScroll();
  setupFadeInOnScroll();
  setupMenuToggle(); 
  
  // NUEVO: Inicializa los dos toggles
  setupToggle('toggle-quien-soy', 'detalle-quien-soy'); 
  setupToggle('toggle-habilidades', 'detalle-habilidades');
}); 

// =======================================================
// NUEVA FUNCIÓN: Lógica general de TOGGLE para elementos
// =======================================================
function setupToggle(buttonId, targetId) {
    const toggleButton = document.getElementById(buttonId);
    const targetArea = document.getElementById(targetId);

    if (!toggleButton || !targetArea) return;

    toggleButton.addEventListener('click', () => {
        const isExpanded = targetArea.classList.toggle('expanded');
        toggleButton.classList.toggle('expanded', isExpanded);
    });
    
    // Antiguo toggle de la foto que ya no despliega contenido (se deja para la animación visual del círculo)
    if (buttonId === 'toggle-quien-soy') {
        const perfilToggle = document.getElementById('perfil-toggle');
        if (perfilToggle) {
            perfilToggle.addEventListener('click', () => {
                // Si el usuario hace clic en la foto, expandimos el detalle del perfil
                const targetArea = document.getElementById('detalle-quien-soy');
                const toggleButton = document.getElementById('toggle-quien-soy');
                
                if (targetArea && toggleButton) {
                    const isExpanded = targetArea.classList.toggle('expanded');
                    toggleButton.classList.toggle('expanded', isExpanded);
                }
            });
        }
    }
}
// =======================================================


// =======================================================
// FUNCIÓN: LÓGICA DEL MENÚ HAMBURGUESA
// =======================================================
function setupMenuToggle() {
    const toggleButton = document.querySelector('.menu-toggle');
    const navMenu = document.getElementById('main-nav');
    const body = document.body; // Referencia al body para bloquear el scroll

    if (!toggleButton || !navMenu) return; 

    // Función de utilidad para cerrar el menú y restablecer el icono/aria
    function closeMenu() {
        navMenu.classList.remove('active');
        toggleButton.setAttribute('aria-expanded', 'false');
        const icon = toggleButton.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
        body.style.overflow = ''; // HABILITA el scroll en el body
    }
    
    // Listener principal para el botón de alternancia
    toggleButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Evita que el evento se propague al document listener
        const isExpanded = navMenu.classList.contains('active');
        
        if (isExpanded) {
            // CERRAR
            closeMenu();
        } else {
            // ABRIR
            navMenu.classList.add('active');
            toggleButton.setAttribute('aria-expanded', 'true');
            
            // Cambiar icono a cerrar (X)
            const icon = toggleButton.querySelector('i');
            if (icon) icon.className = 'fas fa-times';
            body.style.overflow = 'hidden'; // BLOQUEA el scroll en el body
        }
    });

    // Función para cerrar el menú si se hace clic en un enlace interno
    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            closeMenu();
            // Mantener el comportamiento de scroll suave original del enlace
        });
    });
    
    // Listener para cerrar al hacer clic FUERA del menú o del botón. 
    document.addEventListener('click', (e) => {
        const menuIsOpen = navMenu.classList.contains('active');
        
        if (menuIsOpen && !navMenu.contains(e.target) && !toggleButton.contains(e.target)) {
            closeMenu();
        }
    });
}
// =======================================================

// Desplazamiento suave en navegación
function setupSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href").substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

// Resaltar enlace activo según scroll (Mantenida para futuro uso)
function setupActiveNavOnScroll() {
  const sections = Array.from(document.querySelectorAll("section[id]"));
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));

  if (!sections.length || !navLinks.length) return;

  function onScroll() {
    const scrollY = window.scrollY || window.pageYOffset;
    const offset = 120;

    let currentId = sections[0].id;

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const top = rect.top + scrollY - offset;
      
      if (section.id !== 'hero' && scrollY >= top) {
        currentId = section.id;
      }
      
      if (section.id === 'branding-identidad-section' && scrollY >= top) {
          currentId = 'portafolio'; 
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute("href") || "";
      if (href.startsWith("#")) {
        const id = href.substring(1);
        
        if (id === 'portafolio' && (currentId === 'portafolio' || currentId === 'branding-identidad-section')) {
             link.classList.add("active");
        } else {
             link.classList.toggle("active", id === currentId);
        }
      }
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

// Animación fade-in al hacer scroll
function setupFadeInOnScroll() {
  const elements = document.querySelectorAll(".anim-fade-in");
  if (!elements.length) return;

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            obs.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.1,
      }
    );

    elements.forEach((el) => observer.observe(el));

    window.initFadeInOnScroll = () => {
      const newElements = document.querySelectorAll(".anim-fade-in:not(.in-view)");
      newElements.forEach((el) => observer.observe(el));
    };
  } else {
    const reveal = () => {
      const trigger = window.innerHeight * 0.86;
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < trigger) {
          el.classList.add("in-view");
        }
      });
    };
    window.addEventListener("scroll", reveal, { passive: true });
    reveal();
    window.initFadeInOnScroll = reveal;
  }
}

// MODALES DE SERVICIOS - CONTENIDO (Mantenidas)
const getButtonHtml = (href) => `<a href="${href}" onclick="closeModal()" class="modal-button-link">Ver Ejemplos</a>`;

const serviceContent = {
  branding: {
    title: "Branding e Identidad",
    body:
      "Desarrollo de identidades visuales que parten del propósito de la marca y se aterrizan en un sistema gráfico funcional: logotipo, paleta, tipografías, aplicaciones y guías de uso. Pensado para marcas que necesitan coherencia y una narrativa visual clara.",
    button: getButtonHtml('index.html#branding-identidad-section'),
  },
  ilustracion: {
    title: "Ilustración Científica",
    body:
      "Ilustraciones y esquemas construidos desde el rigor conceptual: anatomía, ecología, procesos experimentales, ciclos y visualizaciones de datos. El foco está en la claridad, la precisión y la capacidad de enseñar o explicar sin perder atractivo visual.",
    button: getButtonHtml('index.html#portafolio'), 
  },
  editorial: {
    title: "Diseño Editorial",
    body:
      "Maquetación de revistas, informes técnicos, flyers, carteles y material promocional. Organización de la información en niveles de lectura para asegurar consistencia y lectura fluida en digital e impreso.",
    button: getButtonHtml('index.html#portafolio'), 
  },
  web: {
    title: "Desarrollo Web Estratégico",
    body:
      "Landing pages y sitios web ligeros, centrados en contenido y objetivos claros: captación de leads, presentación de portafolio o comunicación de servicios. Diseño visual + implementación en HTML/CSS/JS.",
    button: getButtonHtml('index.html#portafolio'), 
  },
};

function showModal(serviceId) { 
  const modal = document.getElementById("modal-servicio");
  if (!modal) return;

  const content = serviceContent[serviceId] || {}; 
  const titleEl = document.getElementById("modal-title");
  const bodyEl = document.getElementById("modal-body");
  const actionEl = document.getElementById("modal-actions"); 

  if (titleEl && content.title) titleEl.textContent = content.title;
  if (bodyEl && content.body) bodyEl.textContent = content.body;
  
  if (actionEl && content.button) {
    actionEl.innerHTML = content.button;
  } else if (actionEl) {
    actionEl.innerHTML = '';
  }

  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  const modal = document.getElementById("modal-servicio");
  if (!modal) return;
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

// Cerrar modal con ESC
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
  }
});