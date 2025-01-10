// Variables globales
let currentSection = 0;
const sections = document.querySelectorAll('.section');
const progressBar = document.getElementById('progress');

// Mostrar la sección actual
function showSection(index) {
    sections.forEach((section, i) => {
        section.classList.toggle('active', i === index);
    });
    updateProgressBar(index);
}

// Actualizar barra de progreso
function updateProgressBar(index) {
    const progress = ((index + 1) / sections.length) * 100;
    progressBar.style.width = progress + '%';
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
