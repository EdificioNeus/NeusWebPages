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

    const url = "https://script.google.com/macros/s/AKfycbyDGCaCQtEsn09UV5oolKmChuR6CjYV3TGX85wgYcfg5v0MbZkcZuHtUrYEVAzY_d6_/exec";

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
            CantidadDeMascotas: parseInt(document.getElementById("cantidadMascotas")?.value, 10) || 0,
            CantidadDeResidentes: parseInt(document.getElementById("cantidadResidentes")?.value, 10) || 0,
            Autos: [],
            Mascotas: [],
            Residentes: [],
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

    // 4. Mascotas
    const cantidadMascotas = jsonData.ContactoPrincipal.CantidadDeMascotas;
    for (let i = 1; i <= cantidadMascotas; i++) {
        const mascota = {
            Raza: document.getElementById(`razaMascota${i}`)?.value.trim() || "",
            Nombre: document.getElementById(`nombreMascota${i}`)?.value.trim() || "",
        };
        if (mascota.Raza || mascota.Nombre) {
            jsonData.ContactoPrincipal.Mascotas.push(mascota);
        }
    }

    // 5. Residentes
    const cantidadResidentes = jsonData.ContactoPrincipal.CantidadDeResidentes;
    for (let i = 1; i <= cantidadResidentes; i++) {
        const residente = {
            Nombre: document.getElementById(`nombreResidente${i}`)?.value.trim() || "",
            Apellido: document.getElementById(`apellidoResidente${i}`)?.value.trim() || "",
            Identificacion: document.getElementById(`identificacionResidente${i}`)?.value.trim() || "",
            Telefono: document.getElementById(`telefonoResidente${i}`)?.value.trim() || "",
            Correo: document.getElementById(`correoResidente${i}`)?.value.trim() || "",
            Parentesco: document.getElementById(`parentescoResidente${i}`)?.value.trim() || "",
        };
        if ((residente.Nombre && residente.Apellido && residente.Identificacion)) {
            jsonData.ContactoPrincipal.Residentes.push(residente);
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

    function enviarDatos(fetchOptions) {
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
