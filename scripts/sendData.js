document.getElementById("registroForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevenir el comportamiento predeterminado del formulario
    console.log("Formulario enviado. Preparando datos...");

    const url = "https://script.google.com/macros/s/AKfycbwRvlC_lIJwJ-C8mUAuVz7JD4xm6obijORx7T0rW2RBMJ9Dtl4VOaniDNpdxZmd0YuB/exec";

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

    console.log("Datos preparados:", data);

    // Validar que todos los campos obligatorios tengan valores
    if (!data.nombre || !data.rut || !data.departamento) {
        alert("Por favor, completa todos los campos obligatorios.");
        return;
    }

    // Enviar los datos al servidor
    fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);
            }
            console.log("Respuesta del servidor:", response);
            return response.text();
        })
        .then((responseData) => {
            console.log("Datos procesados:", responseData);
            alert("Formulario enviado exitosamente.");
            document.getElementById("registroForm").reset(); // Limpiar el formulario
        })
        .catch((error) => {
            console.error("Error al enviar el formulario:", error);
            alert(`Hubo un error al enviar el formulario. Detalles: ${error.message}`);
        });        
});
