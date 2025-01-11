// Cargar las nacionalidades desde un archivo JSON
async function cargarNacionalidades() {
    const select = document.getElementById("nacionalidad");

    try {
        const response = await fetch("files/nacionalidades.json"); // Ruta del JSON
        if (!response.ok) {
            throw new Error("Error al cargar las nacionalidades.");
        }

        const nacionalidades = await response.json();

        // Limpiar opciones actuales
        select.innerHTML = "";

        // Agregar opciones dinámicamente
        nacionalidades.forEach((nacionalidad) => {
            const option = document.createElement("option");
            option.value = nacionalidad;
            option.textContent = nacionalidad;
            select.appendChild(option);
        });

        // Seleccionar la opción predeterminada (Chilena)
        select.value = "Chilena";

    } catch (error) {
        console.error("Error cargando las nacionalidades:", error);

        // Mostrar mensaje de error en caso de fallo
        const option = document.createElement("option");
        option.value = "";
        option.textContent = "Error al cargar las opciones.";
        select.appendChild(option);
    }
}

// Llamar a la función al cargar la página
document.addEventListener("DOMContentLoaded", cargarNacionalidades);
