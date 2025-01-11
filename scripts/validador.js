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

    // Ignorar validación si el campo está oculto, deshabilitado o no es visible
    if (field.closest(".hidden") || field.disabled || field.type === "hidden") {
        console.log(`Campo ignorado en validación: ${field.name || field.id}`);
        return "";
    }

    // 1. Validar campos requeridos
    if (field.hasAttribute("required") && !field.value.trim()) {
        isValid = false;
        message = "Este campo es requerido";
    }

    // 2. Validar números de teléfono
    if (isValid && field.type === "tel" && !/^\+?[0-9\s()-]{8,15}$/.test(field.value.trim())) {
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

    // 5. Validar RUT (solo si tiene el atributo data-validation="rut")
    if (isValid && field.dataset.validation === "rut" && typeof Fn !== "undefined" && !Fn.validaRut(field.value.trim())) {
        isValid = false;
        message = "RUT inválido";
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
    let isValid = true;

    fields.forEach((field) => {
        const message = validateField(field); // Utiliza la función validateField
        if (message) {
            isValid = false; // Si hay algún error, marca la sección como inválida
        }
    });

    return isValid;
}

// Hacer que validateCurrentSection sea accesible globalmente
window.validateSection = validateCurrentSection;

