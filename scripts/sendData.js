document.getElementById("registroForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevenir el comportamiento predeterminado del formulario
    console.log("1. Evento 'submit' detectado. Preparando datos para enviar...");

    const url = "https://script.google.com/macros/s/AKfycbz6vAst1KncZP17CzNJk9ksE1cXrtzXVsZAL2SBjmSrWXWYQjuEDt33PQXuz5_zjgJc/exec";

    // Extraer datos del formulario
    const data = {
        nombre: document.getElementById("nombre")?.value.trim() || "",
        rut: document.getElementById("rut")?.value.trim() || "",
        nacionalidad: document.getElementById("nacionalidad")?.value.trim() || "",
        departamento: document.getElementById("departamento")?.value.trim() || "",
        contacto: document.getElementById("contacto")?.value.trim() || "",
        email: document.getElementById("email")?.value.trim() || "",
        emergencia: document.getElementById("emergencia")?.value.trim() || "",
        parentesco: document.getElementById("parentesco")?.value.trim() || "",
    };

    console.log("2. Datos preparados para enviar:", data);

    // Validar que todos los campos obligatorios tengan valores
    if (!data.nombre || !data.rut || !data.departamento) {
        alert("Por favor, completa todos los campos obligatorios.");
        console.error("3. Validación fallida. Faltan campos obligatorios:", data);
        return;
    }

    console.log("3. Todos los campos obligatorios están completos. Enviando datos a:", url);

    // Enviar los datos al servidor
    fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => {
            console.log("4. Respuesta completa del servidor recibida:", response);
            if (!response.ok) {
                throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);
            }
            return response.json(); // Convertir respuesta a JSON
        })
        .then((responseData) => {
            console.log("5. Respuesta JSON procesada:", responseData);
            if (responseData.status === "success") {
                alert("Formulario enviado exitosamente.");
                document.getElementById("registroForm").reset(); // Limpiar el formulario
            } else {
                throw new Error(responseData.message || "Error desconocido en la respuesta.");
            }
        })
        .catch((error) => {
            console.error("6. Error al enviar el formulario:", error);
            alert(`Hubo un error al enviar el formulario. Detalles: ${error.message}`);
        });
});
