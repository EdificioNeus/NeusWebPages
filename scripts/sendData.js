// Función para obtener los valores seleccionados de un grupo de checkboxes
function getCheckboxValues(prefix) {
    const checkboxes = document.querySelectorAll(`input[id^="${prefix}"]:checked`);
    return Array.from(checkboxes).map(checkbox => checkbox.value);
}

let requestSent = false; // ✅ Evitar envíos duplicados

document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("disclaimerModal");
    const aceptarBtn = document.getElementById("aceptarPolitica");
    const rechazarBtn = document.getElementById("rechazarPolitica");
    const formulario = document.getElementById("registroForm");

    // Ocultar modal por defecto (seguridad extra)
    modal.style.display = "none";

    // Evitar que el formulario se envíe directamente
    formulario.addEventListener("submit", function (e) {
        e.preventDefault(); // 🔴 Bloquea envío por defecto

        // Mostrar el modal solo cuando el usuario presiona enviar
        modal.style.display = "flex";
    });

    // Si el usuario acepta los términos, cerrar modal y enviar formulario
    aceptarBtn.addEventListener("click", function () {
        modal.style.display = "none"; // Ocultar modal
        enviarFormulario(); // 🔥 Enviar formulario automáticamente
    });

    // Si el usuario rechaza, solo cerramos el modal
    rechazarBtn.addEventListener("click", function () {
        modal.style.display = "none";
    });
});

// Función para enviar los datos al servidor
function enviarFormulario()
{
    if (requestSent) {
        console.warn("⚠️ Ya se envió una solicitud, evitando duplicado.");
        return;
    }

    // Mostrar overlay y spinner
    document.getElementById("overlay").classList.remove("hidden");
    document.getElementById("spinner").classList.remove("hidden");

    // Construcción del JSON con los datos del formulario
    const jsonData = {
        ContactoPrincipal: {
            idPrincipal: idPrincipal, // ✅ Si es edición, agregamos el ID
            Nombres: document.getElementById("Nombres")?.value.trim() || "",
            Apellidos: document.getElementById("Apellidos")?.value.trim() || "",
            TipoIdentificacion: document.querySelector('input[name="documentType"]:checked')?.value || "",
            NumeroIdentificacion: document.getElementById("rutContainer").classList.contains("hidden")
            ? document.getElementById("dni")?.value.trim() || ""
            : document.getElementById("rut")?.value.trim().replace(/\./g, "") || "",
            CorreoElectronico: document.getElementById("email")?.value.trim() || "",
            Telefono: document.getElementById("contacto")?.value.trim() || "",
            Nacionalidad: document.getElementById("nacionalidad")?.value.trim() || "",
            RegistradoEdipro: document.querySelector('input[name="tieneEdipro"]:checked')?.value || "",
            RegistradoHuellero: document.querySelector('input[name="tieneHuella"]:checked')?.value || "",
            NumeroDepartamento: document.getElementById("departamento")?.value.trim() || "",
            TieneEstacionamiento: document.querySelector('input[name="tieneEstacionamiento"]:checked')?.value || "no",
            CantidadEstacionamientos: parseInt(document.getElementById("cantidadEstacionamientos")?.value, 10) || 0,
            NumerosDeEstacionamiento: [],
            TieneControlPorton: [],
            TieneBodega: document.querySelector('input[name="tieneBodega"]:checked')?.value || "no",
            CantidadBodegas: parseInt(document.getElementById("cantidadBodegas")?.value, 10) || 0,
            NumerosDeBodega: [],
            PropietarioOArrendatario: document.querySelector('input[name="tipoPropietario"]:checked')?.value || "",
            ContratoDeArriendo: "Sin contrato", // Valor por defecto
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

    jsonData.modoEdicion = modoEdicion;

	// Recopilar datos dinámicos
 // 1. Estacionamientos
    const cantidadEstacionamientos = jsonData.ContactoPrincipal.CantidadEstacionamientos;
    for (let i = 1; i <= cantidadEstacionamientos; i++) {
        const numeroEstacionamiento = document.getElementById(`numeroEstacionamiento${i}`)?.value.trim() || "";
        const tieneControl = document.querySelector(`input[name="tieneControlPorton_${i}"]:checked`)?.value || "no";

        if (numeroEstacionamiento) {
            jsonData.ContactoPrincipal.NumerosDeEstacionamiento.push(numeroEstacionamiento);
        }
        jsonData.ContactoPrincipal.TieneControlPorton.push(tieneControl);
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
            RegistroHuellero: document.querySelector(`input[name="registroHuellero_${i}"]:checked`)?.value || "",

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

    // Revisar si hay un contrato de arriendo adjunto o generado desde la cámara
    const contratoInput = document.getElementById("contrato");
    const tieneContratoPDF = contratoInput && contratoInput.dataset.pdf && contratoInput.dataset.pdf !== "null";
    const hasContrato = contratoInput && contratoInput.files && contratoInput.files.length > 0;

    // Si el usuario tomó fotos con la cámara y se generó un PDF
    if (tieneContratoPDF) {
        console.log("📸 Usando contrato generado por la cámara.");

        // Remover el prefijo "data:application/pdf;filename=generated.pdf;base64," si existe
        let pdfBase64 = contratoInput.dataset.pdf;
        if (pdfBase64.startsWith("data:application/pdf")) {
            pdfBase64 = pdfBase64.split(",")[1]; // Extraer solo el contenido Base64
        }

        jsonData.ContactoPrincipal.ContratoDeArriendo = pdfBase64; // Solo el Base64
        jsonData.ContactoPrincipal.NombreArchivo = "contrato_generado.pdf"; // Nombre predeterminado
        enviarDatos(jsonData);
    }
    // Si el usuario cargó un archivo manualmente
    else if (hasContrato) {
        console.log("📂 Se detectó un archivo adjunto. Convirtiendo a Base64...");

        // Leer archivo como Base64
        const reader = new FileReader();
        reader.onload = function () {
            const base64File = reader.result.split(",")[1]; // Extraer solo el contenido Base64
            jsonData.ContactoPrincipal.ContratoDeArriendo = base64File;
            jsonData.ContactoPrincipal.NombreArchivo = contratoInput.files[0].name;

            // Enviar los datos con el contrato en Base64
            enviarDatos(jsonData);
        };

        reader.onerror = function (error) {
            console.error("❌ Error al leer el archivo:", error);
        };

        reader.readAsDataURL(contratoInput.files[0]);
    }
    // Si no hay contrato adjunto ni generado, solo se envían los datos sin contrato
    else {
        console.log("⚠️ No se detectó contrato adjunto.");
        jsonData.ContactoPrincipal.ContratoDeArriendo = "Sin contrato";
        enviarDatos(jsonData);
    }

    if (hasContrato)
    {
        console.log("Se detectó un archivo adjunto. Enviando como JSON con Base64...");

        // Convertir el archivo a Base64
        const reader = new FileReader();
        reader.onload = function () {
            const base64File = reader.result.split(",")[1]; // Obtener solo el contenido Base64
            jsonData.ContactoPrincipal.ContratoDeArriendo = base64File;
            jsonData.ContactoPrincipal.NombreArchivo = contratoInput.files[0].name;

            enviarDatos(jsonData);
        };

        reader.onerror = function (error) {
            console.error("Error al leer el archivo:", error);
        };

        reader.readAsDataURL(contratoInput.files[0]);
    }
    else
    {
        enviarDatos(jsonData);
    }
}

// Función para enviar los datos al servidor
function enviarDatos(jsonData)
    {
        if (requestSent)
        {
            console.warn("⚠️ Ya se envió una solicitud, evitando duplicado.");
            return;
        }

        requestSent = true; // ✅ Evitar envíos duplicados
        const url = "https://script.google.com/macros/s/AKfycbwmZek7j0lwfGJHsAfetS7NUINpihwjs79mKRt5QuiwHMRABqJxuGlzNJD_fPIKUlN_/exec";

        const fetchOptions =
        {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify(jsonData),
        };

        console.log("📡 Enviando datos a:", url);
        console.log("📤 JSON enviado:", JSON.stringify(jsonData, null, 2));

        fetch(url, fetchOptions)
            .then(response => {
                console.log("📥 Respuesta recibida:", response);
                return response.text();
            })
            .then(result => {
                console.log("📜 Respuesta del servidor:", result); // 🔍 Imprimir respuesta completa

                try
                {
                    const jsonResponse = JSON.parse(result);
                    if (jsonResponse.status === "success") {
                        console.log("✅ Confirmación de éxito recibida. Mostrando mensaje...");
                        showConfirmationMessage("¡Gracias por tu respuesta! Tu información ha sido registrada correctamente.", "success");

                        // Esperar 3 segundos antes de redirigir
                        setTimeout(() => {
                            document.getElementById("registroForm").reset();
                            console.log("🔄 Redirigiendo a index.html...");
                            window.location.href = "index.html";
                        }, 3000);
                    }
                    else
                    {
                        console.warn("⚠️ Error en respuesta del servidor:", jsonResponse.message);
                        showConfirmationMessage(`⚠️ Error: ${jsonResponse.message}`, "error");
                        requestSent = false;
                    }
                }
                catch (error)
                {
                    console.error("❌ Error al procesar la respuesta JSON:", error);
                    showConfirmationMessage(`⚠️ Respuesta inesperada del servidor.`, "error");
                    requestSent = false;
                }
            })
            .catch(error => {
                console.error("❌ Error al enviar el formulario:", error);
                showConfirmationMessage(`Hubo un problema al enviar tu información: ${error.message}`, "error");
                requestSent = false; // ❌ Permitir reintento
            });
    }
