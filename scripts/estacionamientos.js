document.addEventListener('DOMContentLoaded', () => {
    const estacionamientoSelect = document.getElementById('numeroEstacionamiento');

    // Ruta al archivo JSON
    const jsonPath = 'files/estacionamientos.json';

    // Fetch al archivo JSON
    fetch(jsonPath)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            // Limpiar el select antes de agregar opciones
            estacionamientoSelect.innerHTML = '';

            // Agregar una opción inicial seleccionable
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Seleccione un estacionamiento';
            defaultOption.disabled = true;
            defaultOption.selected = true;
            estacionamientoSelect.appendChild(defaultOption);

            // Poblar el select con las opciones del JSON
            data.forEach((estacionamiento) => {
                const option = document.createElement('option');
                option.value = estacionamiento;
                option.textContent = estacionamiento;
                estacionamientoSelect.appendChild(option);
            });
        })
        .catch((error) => {
            console.error('Error cargando los estacionamientos:', error);
            // Mostrar un mensaje de error en caso de fallo
            estacionamientoSelect.innerHTML = '';
            const errorOption = document.createElement('option');
            errorOption.value = '';
            errorOption.textContent = 'Error cargando opciones';
            errorOption.disabled = true;
            estacionamientoSelect.appendChild(errorOption);
        });
});
