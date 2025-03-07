// Variables globales
let currentStep = 0; // Inicialmente en la primera etapa
const sections = document.querySelectorAll('.section');
const progressLine = document.getElementById('progress-line');
const progressPercentage = document.getElementById('progress-percentage'); // Texto del porcentaje
const nextButton = document.getElementById('nextBtn');
const prevButton = document.getElementById('prevBtn');

// Función para mostrar la sección actual
function showSection(index) {
    console.log(`📌 Mostrando sección ${index} de ${sections.length - 1}`);
    sections.forEach((section, i) => {
        section.classList.toggle("active", i === index);
    });

    updateProgress(index); // Actualizar barra de progreso

    poblarSeccionActiva(sections[index].id);

    // Ocultar el botón "Anterior" en la primera sección
    prevButton.style.display = index === 0 ? "none" : "block";

    // Cambiar el texto del botón "Siguiente" en la última sección
    if (index === sections.length - 1) {
        nextButton.textContent = "Enviar datos";
        nextButton.dataset.action = "submit";
    } else {
        nextButton.textContent = "Siguiente";
        nextButton.dataset.action = "next";
    }
}

function updateProgress(step) {
    const totalSteps = sections.length - 1;
    if (step < 0 || step > totalSteps) return;

    const progress = Math.round((step / totalSteps) * 100);
    console.log(`✔️ Paso actual: ${step} / ${totalSteps} (${progress}%)`);

    anime({
        targets: progressLine,
        width: `${progress}%`,
        easing: 'easeInOutQuad',
        duration: 500,
    });

    if (progressPercentage) {
        progressPercentage.textContent = `${progress}%`;

        const isLightMode = document.body.classList.contains("light-mode");

        if (progress === 0) {
            progressPercentage.classList.add("low-contrast");
        } else {
            progressPercentage.classList.remove("low-contrast");
        }

        // Cambia SOLO el color del texto
        progressPercentage.style.color = isLightMode
            ? (progress === 0 ? "#555" : "#222") // Más oscuro en 0%
            : (progress > 50 ? "#ffffff" : "#e0e0e0"); // Ajuste en Dark Mode
    }
}

// Evento del botón "Siguiente"
nextButton.addEventListener("click", () => {
    const action = nextButton.dataset.action; // Obtener la acción actual

    // Validar la sección actual usando el validador genérico
    let isValid = window.validateSection();

    if (action === "next" && isValid) {
        if (currentStep < sections.length - 1) {  // ✅ Evita avanzar más de lo permitido
            currentStep++;
            showSection(currentStep);
        }
    } else if (action === "submit") {
        console.log("✅ Enviando formulario...");
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

// Inicializar la primera sección
document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ DOM completamente cargado");

    if (!sections.length) {
        console.error("❌ ERROR: No se encontraron secciones.");
        return;
    }

    showSection(currentStep); // Inicializar la primera sección y la barra de progreso
});
