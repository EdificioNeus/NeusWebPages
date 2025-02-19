document.addEventListener("DOMContentLoaded", () => {
    const abrirCamaraBtn = document.getElementById("abrirCamara");
    const cameraContainer = document.getElementById("cameraContainer");
    const esPropietario = document.getElementById("esPropietario");
    const esArrendatario = document.getElementById("esArrendatario");
    const closeCameraBtn = document.getElementById("closeCamera");
    const contratoArriendo = document.getElementById("contratoArriendo");
    const departamento = document.getElementById("departamentoInput");

    // Ocultar elementos al inicio
    cameraContainer?.classList.add("hidden");
    contratoArriendo?.classList.add("hidden"); // Ocultar por defecto

    // ✅ Manejo del mensaje de error del departamento
    if (departamento) {
        const errorMessage = departamento.closest(".input-container")?.querySelector(".error-message");
        if (errorMessage) {
            errorMessage.style.display = "none";
        }

        departamento.addEventListener("change", () => {
            validateField(departamento);
        });
    }

    // ✅ Eventos de la cámara
    abrirCamaraBtn?.addEventListener("click", () => {
        if (esArrendatario?.checked) {
            cameraContainer.classList.remove("hidden");
            window.abrirCamara?.();
        } else {
            console.warn("⚠️ La cámara solo se puede abrir si seleccionas 'Arrendatario'.");
        }
    });

    closeCameraBtn?.addEventListener("click", () => {
        window.detenerCamara?.();
        cameraContainer.classList.add("hidden");
    });

    // ✅ Eventos de cambio de rol
    esPropietario?.addEventListener("change", () => {
        cameraContainer.classList.add("hidden");
        contratoArriendo.classList.add("hidden");
        window.detenerCamara?.();
    });

    esArrendatario?.addEventListener("change", () => {
        contratoArriendo.classList.remove("hidden");
    });

    // ✅ Validación de campos
    document.querySelectorAll("input, select, textarea").forEach(field => {
        field.addEventListener("change", () => validateField(field));
    });

    // ✅ Validación específica del departamento (SIN la validación eliminada)
    departamento?.addEventListener("change", () => {
        validateField(departamento);
    });
});

// ✅ FUNCIÓN DE VALIDACIÓN CON TIMEOUT DE 3 SEGUNDOS
function validateField(field) {
    if (!field || field.type === "file") return;

    if (field.id !== "departamentoInput" && (field.closest(".hidden") || field.disabled || field.type === "hidden")) {
        return;
    }

    let isValid = true;
    let message = "";
    let errorMessage = field.closest(".input-container")?.querySelector(".error-message");

    if (!errorMessage) {
        console.warn(`No se encontró el mensaje de error para el campo: ${field.id}`);
        return "";
    }

    // ✅ Validaciones en cadena
    if (field.hasAttribute("required") && !field.value.trim()) {
        isValid = false;
        message = "Este campo es requerido";
    } else if (field.type === "tel" && !/^\+?[0-9\s()-]{8,15}$/.test(field.value.trim())) {
        isValid = false;
        message = "Número de teléfono inválido";
    } else if (field.type === "email" && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(field.value.trim())) {
        isValid = false;
        message = "Correo electrónico inválido";
    } else if (field.type === "number" && field.value) {
        const value = parseFloat(field.value);
        const min = field.min ? parseFloat(field.min) : null;
        const max = field.max ? parseFloat(field.max) : null;
        if ((min !== null && value < min) || (max !== null && value > max)) {
            isValid = false;
            message = `El valor debe estar entre ${min} y ${max}`;
        }
    } else if (field.dataset.validation === "rut" && typeof Fn !== "undefined") {
        const normalizedRut = field.value.replace(/\./g, "").replace(/-/g, "-").toLowerCase();
        if (!Fn.validaRut(normalizedRut)) {
            isValid = false;
            message = "RUT inválido";
        }
    }

    // ✅ Manejo de mensajes de error con `display`
    field.classList.toggle("input-error", !isValid);

    if (errorMessage) {
        if (!isValid) {
            errorMessage.textContent = message;
            errorMessage.style.display = "block";

            // ❗ Ocultar el mensaje después de 3 segundos
            setTimeout(() => {
                errorMessage.style.display = "none";
                errorMessage.textContent = "";
            }, 30000);
        } else {
            errorMessage.style.display = "none";
            errorMessage.textContent = ""; // Se asegura que se borre el mensaje de error
        }
    }

    return message;
}

// ✅ FUNCIÓN PARA VALIDAR UNA SECCIÓN COMPLETA
function validateCurrentSection() {
    const currentSection = document.querySelector(".section.active");
    if (!currentSection) return true; // Si no hay sección activa, se considera válido

    const fields = currentSection.querySelectorAll("input, select, textarea");
    let isValid = true;

    for (const field of fields) { // Usar for...of para salir temprano si hay un error
        if (validateField(field)) { // Si validateField devuelve un mensaje, hay un error
            isValid = false;
        }
    }

    const contratoInput = document.getElementById("contrato");
    if (contratoInput && !contratoInput.closest(".hidden")) {
        const contratoError = contratoInput.nextElementSibling;
        const isValidContrato = imagenesCapturadas.length > 0 || contratoInput.files.length > 0 || contratoInput.dataset.valid === "true";
        contratoInput.classList.toggle("input-error", !isValidContrato);
        if (contratoError) {
            contratoError.textContent = isValidContrato ? "" : "Debe subir un contrato o tomar una foto";
            contratoError.style.display = isValidContrato ? "none" : "block";
        }
        isValid = isValid && isValidContrato; // Mantener el valor de isValid
    }

    return isValid;
}

// ✅ FUNCIÓN PARA MOSTRAR MENSAJE DE CONFIRMACIÓN
function showConfirmationMessage(message, type = "success") {
    const overlay = document.getElementById("overlay");
    const spinner = document.getElementById("spinner");
    const confirmationMessage = document.getElementById("confirmationMessage");

    // Mostrar el overlay y ocultar el spinner
    overlay.classList.remove("hidden");
    spinner.classList.add("hidden");

    // Crear botón de cierre "X"
    const closeButton = `<button class="close-btn" onclick="closeConfirmationMessage()">×</button>`;

    // Configurar el mensaje con la "X" para cerrar
    confirmationMessage.innerHTML = `${closeButton}<h2>${type === "success" ? "Éxito" : "Error"}</h2><p>${message}</p>`;

    confirmationMessage.classList.remove("hidden", "success", "error");
    confirmationMessage.classList.add(type);

    // ❗ Ocultar el mensaje después de 5 segundos
    setTimeout(() => closeConfirmationMessage(), 5000);
}

// ✅ FUNCIÓN PARA CERRAR MENSAJES
function closeConfirmationMessage() {
    document.getElementById("overlay")?.classList.add("hidden");
    document.getElementById("confirmationMessage")?.classList.add("hidden");
}

// Exponer funciones globalmente
window.validateSection  = validateCurrentSection;
window.showConfirmationMessage = showConfirmationMessage;
