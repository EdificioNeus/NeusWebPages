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
        section.classList.toggle('active', i === index); // Mostrar la sección activa
    });

    updateProgress(index); // Actualizar la barra de progreso

    // Cambiar el botón en la última sección
    if (index === sections.length - 1) {
        nextButton.textContent = 'Enviar datos'; // Cambiar a "Enviar datos"
        nextButton.dataset.action = 'submit'; // Cambiar acción a "submit"
        console.log("Última sección alcanzada. Botón cambiado a 'Enviar datos'.");
    } else {
        nextButton.textContent = 'Siguiente'; // Cambiar texto a "Siguiente"
        nextButton.dataset.action = 'next'; // Cambiar acción a "next"
        console.log(`Sección ${index + 1} de ${sections.length}`);
    }

    // Mostrar/Ocultar botón "Anterior"
    prevButton.style.display = index === 0 ? 'none' : 'block';
}

// Función para actualizar la barra de progreso
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
nextButton.addEventListener('click', () => {
    const action = nextButton.dataset.action; // Obtener la acción actual del botón
    if (action === 'next') { // Avanzar a la siguiente sección
        if (currentStep < sections.length - 1) {
            currentStep++;
            showSection(currentStep);
        }
    } else if (action === 'submit') { // Enviar el formulario en la última etapa
        console.log("Enviando formulario...");
        // Aquí se dispara el evento submit
        document.getElementById('registroForm').dispatchEvent(new Event('submit'));
    }
});

// Evento del botón "Anterior"
prevButton.addEventListener('click', () => {
    if (currentStep > 0) {
        currentStep--;
        showSection(currentStep);
    }
});

// Habilitar clic en los nodos
progressNodes.forEach((node, index) => {
    node.addEventListener('click', () => {
        if (index !== currentStep) {
            currentStep = index;
            showSection(currentStep);
        }
    });
});

// Inicializar la primera sección
showSection(currentStep);
