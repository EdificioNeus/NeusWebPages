document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los elementos del dropdown custom
    const dropdownBox = document.querySelector('.dropdown-box');
    const selectedItemInput = document.querySelector('.selected-item input');
    const dropdownContent = document.querySelector('.dropdown-content');
    const departamentoList = document.getElementById('departamentoList');
    const searchInput = document.getElementById('departamentoSearch');
    const jsonPath = 'files/departamentos.json';

    // Función para cargar las opciones desde el JSON
    function loadDepartamentos() {
      fetch(jsonPath)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          // Limpiar la lista de opciones
          departamentoList.innerHTML = '';

          // Agregar opción placeholder
          const placeholder = document.createElement('li');
          //placeholder.classList.add('dropdown-item', 'active');
          //placeholder.textContent = 'Seleccione un departamento';
          placeholder.addEventListener('click', () => {
            setActiveDepartamento(placeholder);
          });
          departamentoList.appendChild(placeholder);

          // Agregar cada departamento como opción
          data.forEach((departamento) => {
            const li = document.createElement('li');
            li.classList.add('dropdown-item');
            li.textContent = departamento;
            li.addEventListener('click', () => {
              setActiveDepartamento(li);
            });
            departamentoList.appendChild(li);
          });
        })
        .catch((error) => {
          console.error('Error cargando los departamentos:', error);
          departamentoList.innerHTML = '<li class="dropdown-item">Error cargando opciones</li>';
        });
    }

    // Función para establecer la opción seleccionada y verificarla en el servidor
    function setActiveDepartamento(element) {
      // Quitar la clase active de todas las opciones
      const allItems = document.querySelectorAll('#departamentoList li');
      allItems.forEach(item => item.classList.remove('active'));

      // Marcar la opción clickeada como activa
      element.classList.add('active');

      // Actualizar el input readonly con el valor seleccionado
      selectedItemInput.value = element.textContent;

      // Llamar a la función para verificar en el servidor
      verifyDepartamento(element.textContent);

      // Cerrar el dropdown
      closeDropdown();
    }

    // Funciones para abrir y cerrar el dropdown
    function openDropdown() {
      dropdownBox.classList.add('active');
      searchInput.focus();
    }
    function closeDropdown() {
      dropdownBox.classList.remove('active');
    }

    // Filtrar las opciones según lo que se escribe en el campo de búsqueda
    searchInput.addEventListener("keyup", () => {
      const filter = searchInput.value.toLowerCase();
      const items = document.querySelectorAll("#departamentoList li");
      items.forEach(item => {
        if (item.textContent.toLowerCase().startsWith(filter)) {
          item.style.display = "";
        } else {
          item.style.display = "none";
        }
      });
    });

    // Abrir/cerrar el dropdown al hacer clic en el área de selección
    document.querySelector('.selected-item').addEventListener("click", openDropdown);
    window.addEventListener("click", (e) => {
      if (!dropdownBox.contains(e.target)) {
        closeDropdown();
      }
    });

    // Función para verificar en el servidor si el departamento ya tiene datos registrados
    function verifyDepartamento(selectedDepartamento) {
      // Si es el placeholder, no hacer nada
      if (!selectedDepartamento || selectedDepartamento === 'Seleccione un departamento') return;

      const overlay = document.getElementById('overlay');
      const spinner = document.getElementById('spinner');

      // Mostrar overlay y spinner
      overlay.classList.remove('hidden');
      spinner.classList.remove('hidden');

      fetch(`https://script.google.com/macros/s/AKfycbzeEjm52NQSz-4aatvdS5Rlr9RBfcypJwVtXLX0Kb25a5YirKwxBhUoacyUJL2g6Qy7/exec?departamento=${encodeURIComponent(selectedDepartamento)}`)
        .then(response => response.json())
        .then(data => {
          overlay.classList.add('hidden');
          spinner.classList.add('hidden');

          if (data.status === 'success' && data.exists) {
            console.log(`El departamento ${selectedDepartamento} ya tiene datos registrados.`);
            showConfirmationMessage(`El departamento ${selectedDepartamento} ya tiene datos registrados.`, 'error');
            // Reiniciar el dropdown al placeholder
            selectedItemInput.value = 'Seleccione un departamento';
            const allItems = document.querySelectorAll('#departamentoList li');
            allItems.forEach(item => item.classList.remove('active'));
            if (allItems[0]) allItems[0].classList.add('active');
          } else {
            console.log(`El departamento ${selectedDepartamento} no tiene datos registrados.`);
          }
        })
        .catch(error => {
          console.error('Error al verificar el departamento:', error);
          overlay.classList.add('hidden');
          spinner.classList.add('hidden');
        });
    }

    // Iniciar la carga de departamentos al cargar el DOM
    loadDepartamentos();
  });
