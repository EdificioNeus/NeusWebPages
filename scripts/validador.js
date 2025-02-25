document.addEventListener("DOMContentLoaded", () => {
    const abrirCamaraBtn = document.getElementById("abrirCamara");
    const cameraContainer = document.getElementById("cameraContainer");
    const esPropietario = document.getElementById("esPropietario");
    const esArrendatario = document.getElementById("esArrendatario");
    const closeCameraBtn = document.getElementById("closeCamera");
    const contratoArriendo = document.getElementById("contratoArriendo");

    // Asegurar que la cámara esté oculta al inicio
    if (cameraContainer) {
        cameraContainer.classList.add("hidden");
      }


    if (abrirCamaraBtn) {
        abrirCamaraBtn.addEventListener("click", () => {
            if (typeof window.abrirCamara === "function") {
                if (esArrendatario.checked) {
                    cameraContainer.classList.remove("hidden"); // Mostrar cámara solo si es arrendatario
                    window.abrirCamara();
                } else {
                    console.warn("⚠️ La cámara solo se puede abrir si seleccionas 'Arrendatario'.");
                }
            } else {
                console.error("⚠️ La función abrirCamara() no está definida.");
            }
        });
    }

    if (closeCameraBtn) {
        closeCameraBtn.addEventListener("click", () => {
            if (typeof window.detenerCamara === "function") {
                window.detenerCamara();
                cameraContainer.classList.add("hidden"); // Ocultar cámara al cerrarla
            } else {
                console.error("⚠️ La función detenerCamara() no está definida.");
            }
        });
    }

    // Si cambia a propietario, ocultar la cámara y sección de contrato
    if (esPropietario) {
        esPropietario.addEventListener("change", () => {
            cameraContainer.classList.add("hidden");
            contratoArriendo.classList.add("hidden"); // Ocultar la sección del contrato
            if (typeof window.detenerCamara === "function") window.detenerCamara();
        });
    }

    if (esArrendatario) {
        esArrendatario.addEventListener("change", () => {
            contratoArriendo.classList.remove("hidden"); // Mostrar el campo de contrato
        });
    }
});

// Evento para inicializar las validaciones
document.addEventListener("DOMContentLoaded", () => {
    // Asocia un evento 'blur' genérico a todos los campos del formulario
    const formFields = document.querySelectorAll("input, select, textarea");
    formFields.forEach((field) => {
        field.addEventListener("blur", validateField); // Llama a la función genérica en cada campo
    });
});

// Función genérica para validar un campo
function validateField(event) {
    const field = event.target || event; // Permitir llamar a validateField con o sin evento
    const errorMessage = field.nextElementSibling; // Mensaje de error ubicado después del campo
    let isValid = true;
    let message = "";

    if (field.type === "file") return "";

    // Ignorar validación si el campo está oculto, deshabilitado o no es visible
    if (field.closest(".hidden") || field.disabled || field.type === "hidden" || field.type === "file") {
        console.log(`Campo ignorado en validación: ${field.name || field.id}`);
        return "";
    }

    // 1. Validar campos requeridos
    if (field.hasAttribute("required") && !field.value.trim()) {
        isValid = false;
        message = "Este campo es requerido";
    }

    // 2. Validar números de teléfono
    if (isValid && field.type === "tel" && !/^\+?[0-9()-]{8,15}$/.test(field.value.trim())) {
        isValid = false;
        message = "Número de teléfono inválido";
    }

    // 3. Validar correos electrónicos
    if (isValid && field.type === "email" && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(field.value.trim())) {
        isValid = false;
        message = "Correo electrónico inválido";
    }

    // 4. Validar números (min y max)
    if (isValid && field.type === "number" && field.value) {
        const value = parseFloat(field.value);
        const min = field.min ? parseFloat(field.min) : null;
        const max = field.max ? parseFloat(field.max) : null;

        if ((min !== null && value < min) || (max !== null && value > max)) {
            isValid = false;
            message = `El valor debe estar entre ${min} y ${max}`;
        }
    }

    // Validar RUT (solo si tiene el atributo data-validation="rut")
    if (isValid && field.dataset.validation === "rut" && typeof Fn !== "undefined") {
        let normalizedRut = field.value.replace(/\./g, '').replace(/-/g, '-').toLowerCase();
        console.log("Validando RUT:", normalizedRut); // <-- Agregar este log para depuración

        if (!Fn.validaRut(normalizedRut)) {
            isValid = false;
            message = "RUT inválido";
        }
    }

    // Mostrar/ocultar mensajes de error
    if (!isValid) {
        console.error(`Error en el campo: ${field.name || field.id}, mensaje: ${message}`);
        field.classList.add("input-error");
        if (errorMessage) {
            errorMessage.textContent = message; // Muestra el mensaje correspondiente
            errorMessage.style.display = "block";
        }
    } else {
        field.classList.remove("input-error");
        if (errorMessage) {
            errorMessage.style.display = "none"; // Oculta el mensaje
        }
    }

    return message; // Retorna el mensaje para uso en validaciones más amplias
}

// Función para validar todos los campos visibles de una sección
function validateCurrentSection() {
    const currentSection = document.querySelector(".section.active");
    const fields = currentSection.querySelectorAll("input, select, textarea");
    const contratoInput = document.getElementById("contrato");

    let isValid = true;

    fields.forEach((field) => {
        const message = validateField(field); // Utiliza la función validateField
        if (message) {
            isValid = false; // Si hay algún error, marca la sección como inválida
        }
    });

    // Validar solo si la sección de contrato está visible
    if (contratoInput && !contratoInput.closest(".hidden")) {
        const contratoError = contratoInput.nextElementSibling;

        if (imagenesCapturadas.length > 0 || contratoInput.files.length > 0 || contratoInput.dataset.valid === "true") {
            contratoInput.classList.remove("input-error");
            if (contratoError) contratoError.style.display = "none";
        } else {
            contratoInput.classList.add("input-error");
            if (contratoError) {
                contratoError.textContent = "Debe subir un contrato o tomar una foto";
                contratoError.style.display = "block";
            }
            isValid = false;
        }
    }

    console.log("Validación final: ", isValid);
    return isValid;
}

function showConfirmationMessage(message, type = 'success') {
    const overlay = document.getElementById('overlay');
    const spinner = document.getElementById('spinner');
    const confirmationMessage = document.getElementById('confirmationMessage');

    // Mostrar el overlay y ocultar el spinner
    overlay.classList.remove('hidden');
    spinner.classList.add('hidden');

    // Crear botón de cierre "X"
    const closeButton = `<button class="close-btn" onclick="closeConfirmationMessage()">×</button>`;

    // Configurar el mensaje con la "X" para cerrar
    confirmationMessage.innerHTML = `
        ${closeButton}
        <h2>${type === 'success' ? 'Éxito' : 'Error'}</h2>
        <p>${message}</p>
    `;

    confirmationMessage.classList.remove('hidden', 'success', 'error');
    confirmationMessage.classList.add(type); // Aplicar estilo basado en tipo

    // Configurar temporizador para ocultar automáticamente
    let timeout = setTimeout(() => closeConfirmationMessage(), 5000);

    // Guardar el timeout para poder cancelarlo si se cierra manualmente
    confirmationMessage.dataset.timeoutId = timeout;
}

// Función para cerrar el mensaje manualmente
function closeConfirmationMessage() {
    // Si no existe un id de sesión, redirige
    if (!sessionStorage.getItem("sessionId")) {
        window.location.href = "index.html";
        return;
    }
    const overlay = document.getElementById('overlay');
    const confirmationMessage = document.getElementById('confirmationMessage');

    overlay.classList.add('hidden');
    confirmationMessage.classList.add('hidden');

    // Cancelar el temporizador si el usuario cierra antes
    clearTimeout(confirmationMessage.dataset.timeoutId);
}

// Hacer que validateCurrentSection sea accesible globalmente
window.validateSection = validateCurrentSection;
window.showConfirmationMessage = showConfirmationMessage;
