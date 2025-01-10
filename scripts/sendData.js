document.getElementById("registroForm").addEventListener("submit", function (e) {
    e.preventDefault();
    console.log("Formulario enviado. Preparando datos...");

    const spinner = document.getElementById("spinner");
    const confirmationMessage = document.getElementById("confirmationMessage");

    // Mostrar el spinner
    spinner.classList.remove("hidden");

    const url = "https://script.google.com/macros/s/AKfycbw8zMDGPzFlek4PSVQ8iO_CArfgi05Ilx-AW2EEDvzvfXfDe3xhv0pQOWSvOItfduoh/exec";

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

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "text/plain;charset=utf-8");

    const raw = JSON.stringify(data);

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
    };

    fetch(url, requestOptions)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error del servidor: ${response.statusText}`);
            }
            return response.text();
        })
        .then((result) => {
            console.log("Datos procesados:", result);

            // Mostrar mensaje de éxito
            confirmationMessage.textContent = "¡Formulario enviado exitosamente!";
            confirmationMessage.classList.remove("hidden");
            confirmationMessage.classList.remove("error");

            setTimeout(() => {
                confirmationMessage.classList.add("hidden");
            }, 3000);

            document.getElementById("registroForm").reset();
        })
        .catch((error) => {
            console.error("Error al enviar el formulario:", error);

            // Mostrar mensaje de error
            confirmationMessage.textContent = `Hubo un error: ${error.message}`;
            confirmationMessage.classList.remove("hidden");
            confirmationMessage.classList.add("error");

            setTimeout(() => {
                confirmationMessage.classList.add("hidden");
            }, 5000);
        })
        .finally(() => {
            // Ocultar el spinner
            spinner.classList.add("hidden");
        });
});
