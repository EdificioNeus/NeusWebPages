window.Fn = {
    validaRut: function (rutCompleto) {
        if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rutCompleto)) return false;
        var tmp = rutCompleto.split('-');
        var digv = tmp[1];
        var rut = tmp[0];
        if (digv == 'K') digv = 'k';
        return this.dv(rut) == digv;
    },
    dv: function (T) {
        var M = 0,
            S = 1;
        for (; T; T = Math.floor(T / 10)) S = (S + (T % 10) * (9 - (M++ % 6))) % 11;
        return S ? S - 1 : 'k';
    },
};

document.addEventListener('DOMContentLoaded', () => {
    // Lógica para alternar entre RUT y DNI
    document.querySelectorAll('input[name="documentType"]').forEach((radio) => {
        radio.addEventListener('change', function () {
            const rutContainer = document.getElementById('rutContainer');
            const dniContainer = document.getElementById('dniContainer');
            const rutInput = document.getElementById('rut');
            const dniInput = document.getElementById('dni');

            if (this.value === 'RUT') {
                rutContainer.classList.remove('hidden');
                dniContainer.classList.add('hidden');
                rutInput.setAttribute('required', 'true');
                dniInput.removeAttribute('required');
                dniInput.value = ""; // Limpia el valor del DNI

            } else if (this.value === 'DNI') {
                rutContainer.classList.add('hidden');
                dniContainer.classList.remove('hidden');
                dniInput.setAttribute('required', 'true');
                rutInput.removeAttribute('required');
                rutInput.value = ""; // Limpia el valor del RUT
            }

            // Limpiar errores si los había
            rutInput.classList.remove('input-error');
            dniInput.classList.remove('input-error');
            const rutErrorMessage = rutInput.nextElementSibling;
            const dniErrorMessage = dniInput.nextElementSibling;
            if (rutErrorMessage) rutErrorMessage.style.display = "none";
            if (dniErrorMessage) dniErrorMessage.style.display = "none";
        });
    });

    // Inicializar visibilidad inicial
    const initialOption = document.querySelector('input[name="documentType"]:checked');
    if (initialOption) {
        initialOption.dispatchEvent(new Event('change'));
    }
});

// Validación dinámica para los campos RUT y DNI
function validateCurrentSection() {
    let isValid = true;
    const currentSection = sections[currentStep]; // Asegúrate de que estas variables estén definidas
    const requiredFields = currentSection.querySelectorAll("input[required]");

    requiredFields.forEach((field) => {
        const isHidden = field.closest(".hidden"); // Verifica si el campo está oculto
        const errorMessage = field.nextElementSibling;

        if (!isHidden && !field.value.trim()) {
            field.classList.add("input-error");
            errorMessage.textContent = 'Este campo es requerido';
            errorMessage.style.display = "block";
            isValid = false;
        } else if (field.id === "rut" && !isHidden && !window.Fn.validaRut(field.value.trim())) {
            // Aquí usamos la función de validaRut.js
            field.classList.add("input-error");
            errorMessage.textContent = 'RUT inválido';
            errorMessage.style.display = "block";
            isValid = false;
        } else {
            field.classList.remove("input-error");
            errorMessage.style.display = "none";
        }
    });

    return isValid;
}

// Inicializar visibilidad inicial
const initialOption = document.querySelector('input[name="documentType"][value="RUT"]');
if (initialOption) {
    initialOption.dispatchEvent(new Event('change'));
}
