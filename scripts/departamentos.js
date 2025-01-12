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

    // Verificar si el departamento ya tiene datos registrados al seleccionarlo
    departamentoSelect.addEventListener('change', () => {
        const selectedDepartamento = departamentoSelect.value;
        console.log(`Departamento seleccionado: ${selectedDepartamento}`);
    
        if (selectedDepartamento) {
            const overlay = document.getElementById('overlay');
            const spinner = document.getElementById('spinner');
    
            // Mostrar spinner
            console.log('Mostrando overlay y spinner...');
            overlay.classList.remove('hidden');
            spinner.classList.remove('hidden');
    
            // Consulta al App Script para verificar el departamento
            fetch(`https://script.google.com/macros/s/AKfycbyDGCaCQtEsn09UV5oolKmChuR6CjYV3TGX85wgYcfg5v0MbZkcZuHtUrYEVAzY_d6_/exec?departamento=${encodeURIComponent(selectedDepartamento)}`)
                .then((response) => {
                    console.log('Respuesta recibida del servidor:', response);
                    return response.json();
                })
                .then((data) => {
                    console.log('Datos procesados:', data);
    
                    // Ocultar spinner
                    console.log('Ocultando overlay y spinner...');
                    overlay.classList.add('hidden');
                    spinner.classList.add('hidden');
    
                    if (data.status === 'success' && data.exists) 
                        {
                        console.log(`El departamento ${selectedDepartamento} ya tiene datos registrados.`);
                        showConfirmationMessage(`El departamento ${selectedDepartamento} ya tiene datos registrados.`,'error');
                        departamentoSelect.value = ''; // Restablecer el valor del select
                    } else {
                        console.log(`El departamento ${selectedDepartamento} no tiene datos registrados.`);
                    }
                })
                .catch((error) => {
                    console.error('Error al verificar el departamento:', error);
                    console.log('Ocultando overlay y spinner por error...');
                    overlay.classList.add('hidden');
                    spinner.classList.add('hidden');
                });
        } else {
            console.log('No se seleccionó ningún departamento.');
        }
    });
    
});

