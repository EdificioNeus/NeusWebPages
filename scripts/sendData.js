document.getElementById("registroForm").addEventListener("submit", function(e) {
    e.preventDefault(); // Prevenir el comportamiento predeterminado del formulario

    const url = "AKfycbwRvlC_lIJwJ-C8mUAuVz7JD4xm6obijORx7T0rW2RBMJ9Dtl4VOaniDNpdxZmd0YuB"; // Reemplaza con la URL generada en Google Apps Script

    // Extraer datos del formulario
    const data = {
        nombre: document.getElementById("nombre").value,
        rut: document.getElementById("rut").value,
        nacionalidad: document.getElementById("nacionalidad").value,
        departamento: document.getElementById("departamento").value,
        contacto: document.getElementById("contacto").value,
        email: document.getElementById("email").value,
        emergencia: document.getElementById("emergencia").value,
        parentesco: document.getElementById("parentesco").value
    };

    // Enviar los datos a Google Apps Script
    fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.text())
    .then(data => {
        alert("Formulario enviado exitosamente.");
        // Opcional: Limpiar el formulario después de enviarlo
        document.getElementById("registroForm").reset();
    })
    .catch(error => {
        alert("Hubo un error al enviar el formulario: " + error.message);
    });
});
