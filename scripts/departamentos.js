document.addEventListener('DOMContentLoaded', () => {
    const departamentoSelect = document.getElementById('departamento');

    // Ruta al archivo JSON
    const jsonPath = 'files/departamentos.json';

    // Fetch al archivo JSON
    fetch(jsonPath)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            // Eliminar la opción predeterminada de "Cargando opciones..."
            departamentoSelect.innerHTML = '';

            // Agregar una opción inicial seleccionable
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Seleccione un departamento';
            defaultOption.disabled = true;
            defaultOption.selected = true;
            departamentoSelect.appendChild(defaultOption);

            // Poblar el select con las opciones del JSON
            data.forEach((departamento) => {
                const option = document.createElement('option');
                option.value = departamento;
                option.textContent = departamento;
                departamentoSelect.appendChild(option);
            });
        })
        .catch((error) => {
            console.error('Error cargando los departamentos:', error);
            // Mostrar un mensaje de error en caso de fallo
            departamentoSelect.innerHTML = '';
            const errorOption = document.createElement('option');
            errorOption.value = '';
            errorOption.textContent = 'Error cargando opciones';
            errorOption.disabled = true;
            departamentoSelect.appendChild(errorOption);
        });
});
