// Función para obtener los valores seleccionados de un grupo de checkboxes
function getCheckboxValues(prefix) {
    const checkboxes = document.querySelectorAll(`input[id^="${prefix}"]:checked`);
    console.log(`Checkboxes encontrados para ${prefix}:`, checkboxes); // Debug
    return Array.from(checkboxes).map(checkbox => checkbox.value);
}

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

    const url = "https://script.google.com/macros/s/AKfycbzeEjm52NQSz-4aatvdS5Rlr9RBfcypJwVtXLX0Kb25a5YirKwxBhUoacyUJL2g6Qy7/exec";

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
            RegistradoHuellero: document.querySelector('input[name="tieneHuella"]:checked')?.value || "",
            NumeroDepartamento: document.getElementById("departamento")?.value.trim() || "",
            TieneEstacionamiento: document.querySelector('input[name="tieneEstacionamiento"]:checked')?.value || "no",
            CantidadEstacionamientos: parseInt(document.getElementById("cantidadEstacionamientos")?.value, 10) || 0,
            NumerosDeEstacionamiento: [],
            TieneBodega: document.querySelector('input[name="tieneBodega"]:checked')?.value || "no",
            CantidadBodegas: parseInt(document.getElementById("cantidadBodegas")?.value, 10) || 0,
            NumerosDeBodega: [],
            PropietarioOArrendatario: document.querySelector('input[name="tipoPropietario"]:checked')?.value || "",
            ContratoDeArriendo: "",
            TieneAuto: document.querySelector('input[name="tieneAuto"]:checked')?.value || "no",
            CantidadDeAutos: parseInt(document.getElementById("cantidadAutos")?.value, 10) || 0,
            Autos: [],
            TieneMascota: document.querySelector('input[name="tieneMascota"]:checked')?.value || "no",
            CantidadDeMascotas: parseInt(document.getElementById("cantidadMascotas")?.value, 10) || 0,
            Mascotas: [],
            TieneResidentesAdicionales: document.querySelector('input[name="tieneResidente"]:checked')?.value || "no",
            CantidadDeResidentes: parseInt(document.getElementById("cantidadResidentes")?.value, 10) || 0,
            Residentes: [],
            TieneBicicleta: document.querySelector('input[name="tieneBicicleta"]:checked')?.value || "no",
            CantidadBicicletas: parseInt(document.getElementById("cantidadBicicletas")?.value, 10) || 0,
            Bicicletas: [],
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
            Tipo: document.querySelector(`input[name="tipoVehiculo_${i}"]:checked`)?.value || "auto",
            Marca: document.getElementById(`marcaAuto${i}`)?.value.trim() || "",
            Modelo: document.getElementById(`modeloAuto${i}`)?.value.trim() || "",
            Color: document.getElementById(`colorAuto${i}`)?.value.trim() || "",
            Patente: document.getElementById(`patenteAuto${i}`)?.value.trim() || "",
        };
        if (auto.Marca || auto.Modelo || auto.Color || auto.Patente) {
            jsonData.ContactoPrincipal.Autos.push(auto);
        }
    }

    // 4. Mascotas
    const cantidadMascotas = jsonData.ContactoPrincipal.CantidadDeMascotas;
    for (let i = 1; i <= cantidadMascotas; i++) {
        const mascota = {
            Raza: document.getElementById(`razaMascota${i}`)?.value.trim() || "",
            Nombre: document.getElementById(`nombreMascota${i}`)?.value.trim() || "",
            Vacunas: document.querySelector(`input[name="vacunasMascota_${i}"]:checked`)?.value || "no",
        };
        if (mascota.Raza || mascota.Nombre) {
            jsonData.ContactoPrincipal.Mascotas.push(mascota);
        }
    }

    // 5. Residentes
    const cantidadResidentes = jsonData.ContactoPrincipal.CantidadDeResidentes;
    for (let i = 1; i <= cantidadResidentes; i++) {
        const necesidadesEspeciales = getCheckboxValues(`necesidadesResidente_${i}_`);
        console.log(`Necesidades especiales de residente ${i}:`, necesidadesEspeciales);

        // Verificar si el usuario marcó "Otras (especificar en comentarios)"
        const otrasCheckbox = document.getElementById(`necesidadesResidente_${i}_otras`);
        const otrasNecesidad = document.getElementById(`necesidadesResidente_${i}_comentario`)?.value.trim() || "";

        if (otrasCheckbox && otrasCheckbox.checked && otrasNecesidad) {
            necesidadesEspeciales.push(`Otras: ${otrasNecesidad}`);
        }

        const residente = {
            Nombre: document.getElementById(`nombreResidente${i}`)?.value.trim() || "",
            Apellido: document.getElementById(`apellidoResidente${i}`)?.value.trim() || "",
            Edad: parseInt(document.getElementById(`edadResidente${i}`)?.value, 10) || 0,
            Identificacion: document.getElementById(`identificacionResidente${i}`)?.value.trim() || "",
            Telefono: document.getElementById(`telefonoResidente${i}`)?.value.trim() || "",
            Correo: document.getElementById(`correoResidente${i}`)?.value.trim() || "",
            Parentesco: document.getElementById(`parentescoResidente${i}`)?.value.trim() || "",
            NecesidadesEspeciales: necesidadesEspeciales,
        };

        if (residente.Nombre || residente.Apellido || residente.Identificacion || necesidadesEspeciales.length > 0) {
            jsonData.ContactoPrincipal.Residentes.push(residente);
        }
    }

    // 6. Bicicletas
    const cantidadBicicletas = jsonData.ContactoPrincipal.CantidadBicicletas;
    for (let i = 1; i <= cantidadBicicletas; i++) {
        const bicicleta = {
            Marca: document.getElementById(`marcaBicicleta${i}`)?.value.trim() || "",
            Color: document.getElementById(`colorBicicleta${i}`)?.value.trim() || "",
            Bicicletero: document.getElementById(`bicicleteroBicicleta${i}`)?.value.trim() || "",
        };
        if (bicicleta.Marca || bicicleta.Color || bicicleta.Bicicletero) {
            jsonData.ContactoPrincipal.Bicicletas.push(bicicleta);
        }
    }

    // Revisar si hay un contrato de arriendo adjunto
    const contratoInput = document.getElementById("contrato");
    const hasContrato = contratoInput && contratoInput.files && contratoInput.files.length > 0;

    // Construir solicitud HTTP dependiendo si hay contrato o no
    let fetchOptions;

    if (hasContrato)
    {
        console.log("Se detectó un archivo adjunto. Enviando como JSON con Base64...");

        // Convertir el archivo a Base64
        const reader = new FileReader();
        reader.onload = function () {
            const base64File = reader.result.split(",")[1]; // Obtener solo el contenido Base64
            jsonData.ContactoPrincipal.ContratoDeArriendo = base64File;
            jsonData.ContactoPrincipal.NombreArchivo = contratoInput.files[0].name;

            // Enviar datos como texto plano
            fetchOptions = {
                method: "POST",
                headers: { "Content-Type": "text/plain;charset=utf-8" },
                body: JSON.stringify(jsonData),
            };

            console.log("fetchOptions (request enviado):", fetchOptions);

            // Enviar los datos al servidor
            enviarDatos(fetchOptions);
        };

        reader.onerror = function (error) {
            console.error("Error al leer el archivo:", error);
        };

        reader.readAsDataURL(contratoInput.files[0]);
    }
    else
    {
        console.log("No se detectó archivo adjunto. Enviando como JSON...");
        fetchOptions = {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify(jsonData),
        };

        enviarDatos(fetchOptions);
    }

    // Imprimir el JSON completo
    //console.log("JSON completo a enviar:", JSON.stringify(jsonData, null, 2));
    console.log("fetchOptions (request enviado):", fetchOptions);
    console.log("JSON completo antes de enviar:", JSON.stringify(jsonData, null, 2));

    function enviarDatos(fetchOptions) {

        try {
            const jsonData = JSON.parse(fetchOptions.body);
            localStorage.setItem("debug_last_sent_json", JSON.stringify(jsonData, null, 2));
            console.log("JSON guardado en localStorage para depuración.");
        } catch (error) {
            console.error("Error al guardar JSON en localStorage:", error);
        }

        // También permitir la descarga del JSON como un archivo para depuración
        guardarJSONComoArchivo(fetchOptions.body);

        fetch(url, fetchOptions)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);
                }
                return response.text();
            })
            .then((result) => {
                console.log("Datos procesados:", result);

                // Ocultar spinner
                spinner.classList.add("hidden");

                // Mostrar mensaje de éxito
                showConfirmationMessage("¡Gracias por tu respuesta! Tu información ha sido registrada correctamente.", "success");

                // Redirigir después de 3 segundos
                setTimeout(() => {
                    overlay.classList.add("hidden");
                    document.getElementById("registroForm").reset();
                    window.location.href = "index.html";
                }, 3000);
            })
            .catch((error) => {
                console.error("Error al enviar el formulario:", error);

                // Ocultar spinner
                spinner.classList.add("hidden");

                // Mostrar mensaje de error
                showConfirmationMessage(`Hubo un problema al enviar tu información: ${error.message}`, "error");
            });
    }

});


// Función para descargar el JSON enviado como archivo
function guardarJSONComoArchivo(jsonData) {
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "debug_sent_data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    console.log("Archivo de depuración generado.");
}