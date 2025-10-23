function esCorreoValido(correo) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(correo);
}

function contraseñasCoinciden(pass1, pass2) {
  return pass1 === pass2 && pass1.length > 0;
}

// Validación del formulario de contacto
// Registramos la validación cuando el DOM esté listo para asegurar que los elementos existen.
document.addEventListener('DOMContentLoaded', function() {
  // Intentar seleccionar el formulario de contacto de forma robusta.
  // Primero por `section#contact form`, si no existe, buscar por `form[aria-label]` que contenga "contacto".
  var formContacto = document.querySelector('section#contact form') || Array.from(document.querySelectorAll('form')).find(function(f){
    var a = f.getAttribute('aria-label') || '';
    return /contacto/i.test(a);
  });

  if (formContacto) {
    formContacto.addEventListener('submit', function (e) {
      var emailInput = formContacto.querySelector('input[type="email"]');
      if (!emailInput) return; // nada que validar

      var correo = (emailInput.value || '').trim();

      // Quito las clases de error o éxito previas
      emailInput.classList.remove('input-error', 'input-ok');

      // Verifico si el correo es válido
      if (!esCorreoValido(correo)) {
        // Prevengo el envío
        e.preventDefault();
        // Añadir clase de error para estilos (puedes definir .input-error en CSS)
        emailInput.classList.add('input-error');
        // Mostrar mensaje accesible: si existe un <small> de ayuda lo actualizamos, si no usamos alert mínimo
        var ayuda = formContacto.querySelector('#email-help');
        if (ayuda) {
          ayuda.textContent = 'Introduce un correo electrónico con formato válido (ej: name@dominio.com).';
          ayuda.style.color = '#b00020';
          ayuda.setAttribute('role', 'alert');
        } else {
          // Mensaje fallback
          alert('Por favor, introduce un correo electrónico válido.');
        }
        // Foco en el campo inválido
        emailInput.focus();
        // detener procesamiento
        return;
      }

      // Si es válido, añadir clase de éxito y permitir envío (no llamar a preventDefault)
      emailInput.classList.add('input-ok');
      var ayuda2 = formContacto.querySelector('#email-help');
      if (ayuda2) {
        ayuda2.textContent = '';
        ayuda2.removeAttribute('role');
      }
    });
  }

  // Inicializar los carousels: solo cambian con las flechas
  const carousels = document.querySelectorAll('.carousel');
  carousels.forEach(carousel => {
    new bootstrap.Carousel(carousel, {
      interval: false,     // deshabilitar autoplay
      keyboard: false,     // deshabilitar control por teclado
      touch: false,        // deshabilitar gestos táctiles/swipe
      pause: false         // deshabilitar pausa al pasar el mouse
    });
  });
});

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar los carousels: solo cambian con las flechas
    const carousels = document.querySelectorAll('.carousel');
    carousels.forEach(carousel => {
        new bootstrap.Carousel(carousel, {
            interval: false,     // deshabilitar autoplay
            keyboard: false,     // deshabilitar control por teclado
            touch: false,        // deshabilitar gestos táctiles/swipe
            pause: false         // deshabilitar pausa al pasar el mouse
        });
    });
});

