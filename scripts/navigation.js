// Variables globales
let currentSection = 0;
const sections = document.querySelectorAll('.section');
const progressBar = document.getElementById('progress');
const steps = document.querySelectorAll('.step');

// Mostrar la sección actual
function showSection(index) {
    sections.forEach((section, i) => {
        section.classList.toggle('active', i === index);
    });
    updateProgress(index);
}

// Actualizar barra de progreso y nodos
function updateProgress(index) {
    const progressWidth = ((index) / (sections.length - 1)) * 100;
    progressBar.style.width = `${progressWidth}%`;

    steps.forEach((step, i) => {
        if (i <= index) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

// Botón "Siguiente"
document.getElementById('nextBtn').addEventListener('click', () => {
    if (currentSection < sections.length - 1) {
        currentSection++;
        showSection(currentSection);
    } else {
        document.getElementById('registroForm').submit(); // Enviar formulario al final
    }
});

// Botón "Anterior"
document.getElementById('prevBtn').addEventListener('click', () => {
    if (currentSection > 0) {
        currentSection--;
        showSection(currentSection);
    }
});

// Inicializar
showSection(currentSection);
