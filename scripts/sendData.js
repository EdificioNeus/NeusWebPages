document.getElementById("registroForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevenir el comportamiento predeterminado del formulario
    console.log("Formulario enviado. Preparando datos...");

    // Referencias al overlay, spinner y mensaje de confirmación
    const overlay = document.getElementById("overlay");
    const spinner = document.getElementById("spinner");
    const confirmationMessage = document.getElementById("confirmationMessage");

    // Mostrar overlay y spinner, ocultar mensaje previo
    overlay.classList.remove("hidden");
    spinner.classList.remove("hidden");
    confirmationMessage.classList.add("hidden");

    const url = "https://script.google.com/macros/s/AKfycbxVkN6yA5wx1ydemNCe99AEUAj33maoCZCReRS7lb5QvUssVc7ktC8JOPQf7of62og/exec";

    // Construir el JSON principal
    const jsonData = {
        ContactoPrincipal: {
            Nombres: document.getElementById("Nombres")?.value.trim() || "",
            Apellidos: document.getElementById("Apellidos")?.value.trim() || "",
            TipoIdentificacion: document.querySelector('input[name="documentType"]:checked')?.value || "",
            NumeroIdentificacion:
                document.getElementById("rutContainer").classList.contains("hidden")
                    ? document.getElementById("dni")?.value.trim() || ""
                    : document.getElementById("rut")?.value.trim() || "",
            CorreoElectronico: document.getElementById("email")?.value.trim() || "",
            Telefono: document.getElementById("contacto")?.value.trim() || "",
            Nacionalidad: document.getElementById("nacionalidad")?.value.trim() || "",
            RegistradoEdipro: document.querySelector('input[name="tieneEdipro"]:checked')?.value || "",
            NumeroDepartamento: document.getElementById("departamento")?.value.trim() || "",
            TieneEstacionamiento: document.querySelector('input[name="tieneEstacionamiento"]:checked')?.value || "no",
            CantidadEstacionamientos: parseInt(document.getElementById("cantidadEstacionamientos")?.value, 10) || 0,
            NumerosDeEstacionamiento: [],
            TieneBodega: document.querySelector('input[name="tieneBodega"]:checked')?.value || "no",
            CantidadBodegas: parseInt(document.getElementById("cantidadBodegas")?.value, 10) || 0,
            NumerosDeBodega: [],
            PropietarioOArrendatario: document.querySelector('input[name="tipoPropietario"]:checked')?.value || "",
            ContratoDeArriendo: "", // Este campo será asignado más adelante si hay archivo
            TieneAuto: document.querySelector('input[name="tieneAuto"]:checked')?.value || "no",
            CantidadDeAutos: parseInt(document.getElementById("cantidadAutos")?.value, 10) || 0,
            Autos: [],
        },
    };

    // Recopilar datos dinámicos
    // 1. Estacionamientos
    const cantidadEstacionamientos = jsonData.ContactoPrincipal.CantidadEstacionamientos;
    for (let i = 1; i <= cantidadEstacionamientos; i++) {
        const numeroEstacionamiento = document.getElementById(`numeroEstacionamiento${i}`)?.value.trim() || "";
        if (numeroEstacionamiento) {
            jsonData.ContactoPrincipal.NumerosDeEstacionamiento.push(numeroEstacionamiento);
        }
    }

    // 2. Bodegas
    const cantidadBodegas = jsonData.ContactoPrincipal.CantidadBodegas;
    for (let i = 1; i <= cantidadBodegas; i++) {
        const numeroBodega = document.getElementById(`numeroBodega${i}`)?.value.trim() || "";
        if (numeroBodega) {
            jsonData.ContactoPrincipal.NumerosDeBodega.push(numeroBodega);
        }
    }

    // 3. Autos
    const cantidadAutos = jsonData.ContactoPrincipal.CantidadDeAutos;
    for (let i = 1; i <= cantidadAutos; i++) {
        const auto = {
            Marca: document.getElementById(`marcaAuto${i}`)?.value.trim() || "",
            Modelo: document.getElementById(`modeloAuto${i}`)?.value.trim() || "",
            Color: document.getElementById(`colorAuto${i}`)?.value.trim() || "",
            Patente: document.getElementById(`patenteAuto${i}`)?.value.trim() || "",
        };
        if (auto.Marca || auto.Modelo || auto.Color || auto.Patente) {
            jsonData.ContactoPrincipal.Autos.push(auto);
        }
    }

    // Revisar si hay un contrato de arriendo adjunto
    const contratoInput = document.getElementById("contrato");
    const hasContrato = contratoInput && contratoInput.files && contratoInput.files.length > 0;

    console.log
    // Construir solicitud HTTP dependiendo si hay contrato o no
    let fetchOptions;

    if (hasContrato) {
        console.log("Se detectó un archivo adjunto. Enviando con FormData...");
        const formData = new FormData();
        formData.append("data", JSON.stringify(jsonData)); // Enviar datos como JSON en un campo separado
        formData.append("contrato", contratoInput.files[0]); // Agregar archivo
        fetchOptions = {
            method: "POST",
            body: formData, // Enviar como FormData
        };
    } 
    else 
    {
        console.log("No se detectó archivo adjunto. Enviando como JSON...");
        fetchOptions = {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify(jsonData),
        };
    }

    // Imprimir el JSON completo
    console.log("JSON completo a enviar:", JSON.stringify(jsonData, null, 2));

    // Enviar los datos al servidor
    fetch(url, fetchOptions)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);
            }
            return response.text();
        })
        .then((result) => {
            console.log("Datos procesados:", result);

            // Ocultar spinner, mostrar mensaje de éxito
            spinner.classList.add("hidden");
            confirmationMessage.innerHTML = `
                <h2>¡Gracias por tu respuesta!</h2>
                <p>Tu información ha sido registrada correctamente.</p>
            `;
            confirmationMessage.classList.remove("hidden");

            // Ocultar overlay y reiniciar formulario después de un tiempo
            setTimeout(() => {
                overlay.classList.add("hidden");
                document.getElementById("registroForm").reset();
                window.location.href = "index.html"; // Redirección al index
            }, 3000);
        })
        .catch((error) => {
            console.error("Error al enviar el formulario:", error);

            // Ocultar spinner, mostrar mensaje de error
            spinner.classList.add("hidden");
            confirmationMessage.innerHTML = `
                <h2>Error al enviar</h2>
                <p>Hubo un problema al enviar tu información: ${error.message}</p>
            `;
            confirmationMessage.classList.remove("hidden");
            confirmationMessage.classList.add("error");

            // Ocultar overlay después de un tiempo
            setTimeout(() => {
                overlay.classList.add("hidden");
            }, 5000);
        });
});
