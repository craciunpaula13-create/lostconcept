// ==========================================================
// Global Utility Functions
// ==========================================================
function esCorreoValido(correo) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(correo);
}

function contraseñasCoinciden(pass1, pass2) {
  return pass1 === pass2 && pass1.length > 0;
}

// ==========================================================
// Theme Management (Dark Mode)
// ==========================================================
(function () {
  try {
    const mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    function apply(dark) {
      if (dark) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
      }
    }
    apply(mq && mq.matches);
    if (mq && mq.addEventListener) mq.addEventListener('change', function (e) { apply(e.matches); });
    else if (mq && mq.addListener) mq.addListener(function (e) { apply(e.matches); });
  } catch (e) {
    /* no hacer nada si hay errores */
  }
})();

// ==========================================================
// Intro Animation
// ==========================================================
document.addEventListener('DOMContentLoaded', function () {
  try {
    document.body.classList.add('intro-playing');
    var logo = document.getElementById('intro-logo');
    var overlay = document.getElementById('intro-overlay');

    // Timeline: no forzamos opacidad 0 (el logo es visible por CSS), solo animamos escala/rotación/salida
    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.to(logo, { duration: 0.8, scale: 1, opacity: 1, ease: 'back.out(1.7)' })
      .to(logo, { duration: 0.5, rotation: 6, y: -6, yoyo: true, repeat: 1, ease: 'sine.inOut' }, '+=0.25')
      .to(logo, { duration: 0.9, scale: 2.2, opacity: 0, ease: 'power2.in' }, '+=0.2')
      .to(overlay, {
        duration: 0.6, opacity: 0, onComplete: function () {
          // ocultar completamente y restaurar scroll
          overlay.classList.add('hidden');
          overlay.style.pointerEvents = 'none';
          document.body.classList.remove('intro-playing');
        }
      }, '-=0.4');
  } catch (e) {
    // Si GSAP falla, asegurar que el overlay no bloquee la página
    var o = document.getElementById('intro-overlay');
    if (o) { o.classList.add('hidden'); }
    document.body.classList.remove('intro-playing');
    console.warn('Intro animation failed or GSAP not loaded', e);
  }
});

// ==========================================================
// Contact Form Validation
// ==========================================================
document.addEventListener('DOMContentLoaded', function () {
  var formContacto = document.querySelector('section#contact form') || Array.from(document.querySelectorAll('form')).find(function (f) {
    var a = f.getAttribute('aria-label') || '';
    return /contacto/i.test(a);
  });

  if (formContacto) {
    formContacto.addEventListener('submit', function (e) {
      var emailInput = formContacto.querySelector('input[type="email"]');
      if (!emailInput) return;

      var correo = (emailInput.value || '').trim();

      emailInput.classList.remove('input-error', 'input-ok');

      if (!esCorreoValido(correo)) {
        e.preventDefault();
        emailInput.classList.add('input-error');
        var ayuda = formContacto.querySelector('#email-help');
        if (ayuda) {
          ayuda.textContent = 'Introduce un correo electrónico con formato válido (ej: name@dominio.com).';
          ayuda.style.color = '#b00020';
          ayuda.setAttribute('role', 'alert');
        } else {
          alert('Por favor, introduce un correo electrónico válido.');
        }
        emailInput.focus();
        return;
      }

      emailInput.classList.add('input-ok');
      var ayuda2 = formContacto.querySelector('#email-help');
      if (ayuda2) {
        ayuda2.textContent = '';
        ayuda2.removeAttribute('role');
      }
    });
  }

  // Inicializar los carousels
  const homeCarousel = document.getElementById('homeCarousel');
  if (homeCarousel) {
    new bootstrap.Carousel(homeCarousel, {
      interval: 5000,
      keyboard: false,
      touch: true,
      pause: false,
      ride: 'carousel'
    });
  }

  // Inicializar otros carousels
  const otherCarousels = document.querySelectorAll('.carousel:not(#homeCarousel)');
  otherCarousels.forEach(carousel => {
    new bootstrap.Carousel(carousel, {
      interval: false,
      keyboard: false,
      touch: false,
      pause: false
    });
  });

  // Modal de producto
  const shopSection = document.getElementById('shop');
  if (shopSection) {
    shopSection.addEventListener('click', function (event) {
      const verBtn = event.target.closest('a.btn, button.btn');
      if (!verBtn || !verBtn.textContent.toLowerCase().includes('ver')) return;
      // Evitar scroll al top si el botón es un enlace
      event.preventDefault();
      // Buscar la tarjeta de producto asociada
      const card = verBtn.closest('.card');
      if (!card) return;

      // Extraer datos del productoo 
      const img = card.querySelector('img');
      const t = card.querySelector('.card-title');
      const d = card.querySelector('.card-text');
      const p = card.querySelector('.product-price');
      const title = t ? t.textContent.trim() : (img ? img.alt : 'Producto');
      const desc = d ? d.textContent.trim() : 'Descripción detallada del producto. Aquí puedes añadir talla, material y más información.';
      const price = p ? p.textContent.trim() : '€49.99';

      // Crear overlay
      const overlay = document.createElement('div');
      overlay.className = 'product-modal-overlay';

      const modal = document.createElement('div');
      modal.className = 'product-modal';

      const left = document.createElement('div');
      left.className = 'left';
      const largeImg = document.createElement('img');
      largeImg.src = img ? img.src : '';
      largeImg.alt = img ? img.alt : title;
      left.appendChild(largeImg);

      const right = document.createElement('div');
      right.className = 'right';
      const closeBtn = document.createElement('button');
      closeBtn.className = 'close-btn';
      closeBtn.innerHTML = '&times;';
      closeBtn.setAttribute('aria-label', 'Cerrar');
      right.appendChild(closeBtn);

      const h3 = document.createElement('h3');
      h3.textContent = title;
      right.appendChild(h3);

      const description = document.createElement('div');
      description.className = 'description';
      description.textContent = desc;
      right.appendChild(description);

      const priceEl = document.createElement('div');
      priceEl.className = 'product-price';
      priceEl.textContent = price;
      right.appendChild(priceEl);

      modal.appendChild(left);
      modal.appendChild(right);
      overlay.appendChild(modal);
      document.body.appendChild(overlay);
      document.body.style.overflow = 'hidden';

      // Handler de cierre
      function closeModal() {
        document.body.removeChild(overlay);
        document.body.style.overflow = '';
      }

      closeBtn.addEventListener('click', closeModal);
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closeModal();
      });
      // Cerrar con ESC
      function onKey(e) { if (e.key === 'Escape') closeModal(); }
      document.addEventListener('keydown', onKey);
      // Limpiar listener de teclado al cerrar
      overlay.addEventListener('remove', function () { document.removeEventListener('keydown', onKey); });
    });
  }
});

// Banner animation
document.addEventListener('DOMContentLoaded', function () {
  const banner = document.querySelector('.banner-content');
  if (banner) {
    const contentWidth = banner.scrollWidth / 4;
    gsap.set(banner, { x: 0 });
    gsap.to(banner, {
      x: -contentWidth,
      duration: 15,
      ease: "none",
      repeat: -1,
      onRepeat: () => {
        gsap.set(banner, { x: 0 });
      }
    });
  }
});

// Función para insertar el separador antes de una sección
function insertSectionSeparator(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) return null;
  // Don't insert if the section is hidden (e.g., fitting room hidden in mobile)
  const computed = window.getComputedStyle(section);
  if (computed && (computed.display === 'none' || computed.visibility === 'hidden' || section.offsetHeight === 0)) {
    return null;
  }

  // If we've already inserted a separator for this section, return the existing one
  if (section.dataset && section.dataset.separatorInserted === '1') {
    const prev = section.previousElementSibling;
    if (prev && prev.classList && prev.classList.contains('section-separator')) {
      return prev.querySelector('img');
    }
  }

  // If immediately previous sibling is a separator, mark and return it (prevents duplicates)
  const prevSibling = section.previousElementSibling;
  if (prevSibling && prevSibling.classList && prevSibling.classList.contains('section-separator')) {
    section.dataset.separatorInserted = '1';
    return prevSibling.querySelector('img');
  }

  // Create and insert the separator
  const separator = document.createElement('div');
  separator.className = 'section-separator';
  separator.innerHTML = `<img src="fotos/logoo.png" alt="Lost Concept Logo Separator" class="separator-logo">`;
  section.parentNode.insertBefore(separator, section);
  // Mark the section so we don't insert again
  section.dataset.separatorInserted = '1';
  return separator.querySelector('img');
}

// Update separators: remove separators whose sections are hidden and insert for visible ones
function updateSeparators() {
  try {
    const sections = ['shop', 'fittingroom', 'about', 'contact'];
    sections.forEach(id => {
      const section = document.getElementById(id);
      if (!section) return;
      const computed = window.getComputedStyle(section);
      const prev = section.previousElementSibling;

      if (computed && (computed.display === 'none' || computed.visibility === 'hidden' || section.offsetHeight === 0)) {
        // section hidden: remove any separator right before it
        if (prev && prev.classList && prev.classList.contains('section-separator')) {
          prev.parentNode.removeChild(prev);
          delete section.dataset.separatorInserted;
        }
      } else {
        // section visible: ensure there's a separator (but avoid duplicates)
        if (!(prev && prev.classList && prev.classList.contains('section-separator'))) {
          insertSectionSeparator(id);
        }
      }
    });
    // After adjustments, remove consecutive separators (edge-case)
    const seps = Array.from(document.querySelectorAll('.section-separator'));
    for (let i = seps.length - 1; i > 0; i--) {
      const cur = seps[i];
      const prev = seps[i - 1];
      if (cur && prev && prev.nextElementSibling === cur) {
        // two separators adjacent (no section between) - remove the later one
        cur.parentNode.removeChild(cur);
      }
    }
  } catch (e) {
    console.warn('updateSeparators error', e);
  }
}

// Re-evaluate on resize (debounced)
let _sepResizeTimer = null;
window.addEventListener('resize', function () {
  clearTimeout(_sepResizeTimer);
  _sepResizeTimer = setTimeout(updateSeparators, 150);
});

// Inicializar separadores y animaciones
document.addEventListener('DOMContentLoaded', () => {
  try {
    // Insertar separadores antes de todas las secciones principales
    const sections = ['shop', 'fittingroom', 'about', 'contact'];
    const logos = sections.map(id => insertSectionSeparator(id)).filter(Boolean);

    // Respetar preferencia de reducir movimiento
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduceMotion && logos.length > 0) {
      logos.forEach((logo, idx) => {
        gsap.set(logo, { transformOrigin: 'center center' });
        // Animación de escala con GSAP
        gsap.to(logo, {
          scale: 1.2,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: idx * 0.3
        });
      });
    }
  } catch (e) {
    console.warn('Error al inicializar animación de separadores:', e);
  }
});

// Run a cleanup once on load to ensure hidden sections don't keep separators
document.addEventListener('DOMContentLoaded', updateSeparators);