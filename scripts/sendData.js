document.getElementById("registroForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevenir el comportamiento predeterminado del formulario
    console.log("Formulario enviado. Preparando datos...");

    const url = "https://script.google.com/macros/s/AKfycbw8zMDGPzFlek4PSVQ8iO_CArfgi05Ilx-AW2EEDvzvfXfDe3xhv0pQOWSvOItfduoh/exec";

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

    console.log("Datos preparados para enviar:", data);

    // Validar que todos los campos obligatorios tengan valores
    if (!data.nombre || !data.rut || !data.departamento) {
        alert("Por favor, completa todos los campos obligatorios.");
        return;
    }

    // Crear encabezados
    const myHeaders = new Headers();
    //myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Content-Type", "text/plain;charset=utf-8");

    // Crear cuerpo de la solicitud
    const raw = JSON.stringify(data);

    // Configuración de la solicitud
    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    // Enviar los datos al servidor
    fetch(url, requestOptions)
        .then((response) => {
            console.log("Respuesta completa del servidor:", response);
            if (!response.ok) {
                throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);
            }
            return response.text();
        })
        .then((result) => {
            console.log("Datos procesados:", result);
            alert("Formulario enviado exitosamente.");
            document.getElementById("registroForm").reset(); // Limpiar el formulario
        })
        .catch((error) => {
            console.error("Error al enviar el formulario:", error);
            alert(`Hubo un error al enviar el formulario. Detalles: ${error.message}`);
        });
});
