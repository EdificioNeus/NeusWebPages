// Variables globales
let currentStep = 0; // Inicialmente en la primera etapa
const sections = document.querySelectorAll('.section');
const progressLine = document.getElementById('progress-line');
const progressNodes = document.querySelectorAll('.progress-node');
const nextButton = document.getElementById('nextBtn');
const prevButton = document.getElementById('prevBtn');

// Función para mostrar la sección actual
function showSection(index) {
    sections.forEach((section, i) => {
        section.classList.toggle("active", i === index); // Mostrar la sección activa
    });

    updateProgress(index); // Actualizar la barra de progreso

    // Limpiar errores de validación al cambiar de sección
    const currentSection = sections[index];
    const errorFields = currentSection.querySelectorAll(".input-error");
    errorFields.forEach((field) => {
        field.classList.remove("input-error");
        const errorMessage = field.nextElementSibling;
        if (errorMessage) errorMessage.style.display = "none";
    });

    // Cambiar el texto y la acción del botón en la última sección
    if (index === sections.length - 1) {
        nextButton.textContent = "Enviar datos";
        nextButton.dataset.action = "submit";
    } else {
        nextButton.textContent = "Siguiente";
        nextButton.dataset.action = "next";
    }

    // Mostrar/Ocultar botón "Anterior"
    prevButton.style.display = index === 0 ? "none" : "block";
}

// Actualizar la barra de progreso
function updateProgress(step) {
    const progressPercentage = (step / (progressNodes.length - 1)) * 100;

    anime({
        targets: progressLine,
        width: `${progressPercentage}%`,
        easing: 'easeInOutQuad',
        duration: 500,
    });

    progressNodes.forEach((node, index) => {
        if (index <= step) {
            node.classList.add('active');
        } else {
            node.classList.remove('active');
        }
    });
}

// Evento del botón "Siguiente"
nextButton.addEventListener("click", () => {
    const action = nextButton.dataset.action; // Obtener la acción actual

    // Validar la sección actual usando el validador genérico
    let isValid = window.validateSection();

    if (action === "next" && isValid) {
        currentStep++;
        showSection(currentStep);
    } else if (action === "submit") {
        console.log("Enviando formulario...");
        if (isValid) {
            document.getElementById("registroForm").dispatchEvent(new Event("submit"));
        }
    }
});

// Evento del botón "Anterior"
prevButton.addEventListener('click', () => {
    if (currentStep > 0) {
        currentStep--;
        showSection(currentStep);
    }
});

// Habilitar clic en los nodos de la barra de progreso
progressNodes.forEach((node, index) => {
    node.addEventListener('click', () => {
        if (index < currentStep) {
            // Permitir regresar a secciones anteriores
            currentStep = index;
            showSection(currentStep);
        } else if (index > currentStep) {
            // Intentando avanzar, validar la sección actual primero
            let isValid = window.validateSection();
            if (isValid) {
                currentStep = index;
                showSection(currentStep);
            }
        }
    });
});

// Inicializar la primera sección
showSection(currentStep);
