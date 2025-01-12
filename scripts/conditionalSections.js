// Función genérica para alternar secciones o campos condicionales
function toggleConditionalInputs(triggerValue, config) {
    const { showContainerId, hideContainerId, showFields, hideFields } = config;

    console.log(`toggleConditionalInputs disparado con triggerValue: ${triggerValue}`);
    console.log("Configuración recibida:", config);

    // Mostrar el contenedor correspondiente
    const showContainer = document.getElementById(showContainerId);
    if (showContainer) {
        console.log(`Mostrando contenedor: ${showContainerId}`);
        showContainer.classList.remove("hidden");
    } else {
        console.warn(`Contenedor a mostrar no encontrado: ${showContainerId}`);
    }

    // Ocultar el contenedor correspondiente (si existe)
    if (hideContainerId) {
        const hideContainer = document.getElementById(hideContainerId);
        if (hideContainer) {
            console.log(`Ocultando contenedor: ${hideContainerId}`);
            hideContainer.classList.add("hidden");

            // Limpia los campos dinámicos dentro del contenedor oculto
            const dynamicFields = hideContainer.querySelectorAll("input, select");
            dynamicFields.forEach((field) => {
                field.removeAttribute("required");
                field.value = ""; // Limpia campos dinámicos
            });
        } else {
            console.warn(`Contenedor a ocultar no encontrado: ${hideContainerId}`);
        }
    }

    // Configurar los campos como requeridos o no
    showFields.forEach((fieldId) => {
        const field = document.getElementById(fieldId);
        if (field) {
            console.log(`Haciendo requerido el campo: ${fieldId}`);
            field.setAttribute("required", "true");

            // Aplicar un valor predeterminado SOLO si es cantidadBodegas, cantidadEstacionamientos o cantidadAutos
            if (
                (fieldId === "cantidadBodegas" ||
                    fieldId === "cantidadEstacionamientos" ||
                    fieldId === "cantidadAutos") &&
                !field.value
            ) {
                field.value = "1"; // Establece valor por defecto
                field.dispatchEvent(new Event("input")); // Dispara el evento input
            }
        } else {
            console.warn(`Campo a hacer requerido no encontrado: ${fieldId}`);
        }
    });

    hideFields.forEach((fieldId) => {
        const field = document.getElementById(fieldId);
        if (field) {
            console.log(`Removiendo requerido del campo: ${fieldId}`);
            field.removeAttribute("required");
            field.value = ""; // Limpia el valor del campo al desactivarlo
        } else {
            console.warn(`Campo a desactivar no encontrado: ${fieldId}`);
        }
    });
}

// Configuración de eventos al cargar
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded: Inicializando eventos.");

    // Eventos para alternar entre RUT y DNI
    document.querySelectorAll('input[name="documentType"]').forEach((radio) => {
        radio.addEventListener("change", function () {
            console.log(`Radio cambiado: documentType, valor: ${this.value}`);
            if (this.value === "RUT") {
                toggleConditionalInputs(this.value, {
                    showContainerId: "rutContainer",
                    hideContainerId: "dniContainer",
                    showFields: ["rut"],
                    hideFields: ["dni"],
                });
            } else if (this.value === "DNI") {
                toggleConditionalInputs(this.value, {
                    showContainerId: "dniContainer",
                    hideContainerId: "rutContainer",
                    showFields: ["dni"],
                    hideFields: ["rut"],
                });
            }
        });
    });

    // Eventos para alternar la sección de datos de la bodega
    document.querySelectorAll('input[name="tieneBodega"]').forEach((radio) => {
        radio.addEventListener("change", function () {
            console.log(`Radio cambiado: tieneBodega, valor: ${this.value}`);
            if (this.value === "si") {
                toggleConditionalInputs(this.value, {
                    showContainerId: "datosBodega",
                    showFields: ["cantidadBodegas"],
                    hideFields: [],
                });
                const cantidadBodegas = document.getElementById("cantidadBodegas");
                if (cantidadBodegas) {
                    cantidadBodegas.dispatchEvent(new Event("input"));
                }
            } else if (this.value === "no") {
                toggleConditionalInputs(this.value, {
                    hideContainerId: "datosBodega",
                    hideFields: ["cantidadBodegas"],
                    showFields: [],
                });
                const camposBodegas = document.getElementById("camposBodegas");
                if (camposBodegas) {
                    camposBodegas.innerHTML = "";
                }
            }
        });
    });

    // Eventos para alternar la sección de datos de estacionamiento
    document.querySelectorAll('input[name="tieneEstacionamiento"]').forEach((radio) => {
        radio.addEventListener("change", function () {
            console.log(`Radio cambiado: tieneEstacionamiento, valor: ${this.value}`);
            if (this.value === "si") {
                toggleConditionalInputs(this.value, {
                    showContainerId: "datosEstacionamiento",
                    showFields: ["cantidadEstacionamientos"],
                    hideFields: [],
                });
                const cantidadEstacionamientos = document.getElementById("cantidadEstacionamientos");
                if (cantidadEstacionamientos) {
                    cantidadEstacionamientos.dispatchEvent(new Event("input"));
                }
            } else if (this.value === "no") {
                toggleConditionalInputs(this.value, {
                    hideContainerId: "datosEstacionamiento",
                    hideFields: ["cantidadEstacionamientos"],
                    showFields: [],
                });
                const camposEstacionamientos = document.getElementById("camposEstacionamientos");
                if (camposEstacionamientos) {
                    camposEstacionamientos.innerHTML = "";
                }
            }
        });
    });

    // Eventos para alternar la sección de datos de autos
    document.querySelectorAll('input[name="tieneAuto"]').forEach((radio) => {
        radio.addEventListener("change", function () {
            console.log(`Radio cambiado: tieneAuto, valor: ${this.value}`);
            if (this.value === "si") {
                toggleConditionalInputs(this.value, {
                    showContainerId: "datosAutos",
                    showFields: ["cantidadAutos"],
                    hideFields: [],
                });

                // Obtener el campo cantidadAutos y asignar valor predeterminado
                const cantidadAutos = document.getElementById("cantidadAutos");
                if (cantidadAutos) {
                    if (!cantidadAutos.value || cantidadAutos.value === "0") {
                        cantidadAutos.value = "1"; // Asignar el valor predeterminado
                    }
                    cantidadAutos.dispatchEvent(new Event("input")); // Disparar evento para generar campos
                }
            } else if (this.value === "no") {
                toggleConditionalInputs(this.value, {
                    hideContainerId: "datosAutos",
                    hideFields: ["cantidadAutos"],
                    showFields: [],
                });
                const camposAutos = document.getElementById("camposAutos");
                if (camposAutos) {
                    camposAutos.innerHTML = ""; // Limpiar campos dinámicos de autos
                }
            }
        });
    });

    // Eventos para alternar la sección de datos de residentes
    document.querySelectorAll('input[name="tieneResidente"]').forEach((radio) => {
        radio.addEventListener("change", function () {
            console.log(`Radio cambiado: tieneResidente, valor: ${this.value}`);
            if (this.value === "si") {
                toggleConditionalInputs(this.value, {
                    showContainerId: "datosResidentes",
                    showFields: ["cantidadResidentes"],
                    hideFields: [],
                });

                // Obtener el campo cantidadResidentes y asignar valor predeterminado
                const cantidadResidentes = document.getElementById("cantidadResidentes");
                if (cantidadResidentes) {
                    if (!cantidadResidentes.value || cantidadResidentes.value === "0") {
                        cantidadResidentes.value = "1"; // Asignar el valor predeterminado
                    }
                    cantidadResidentes.dispatchEvent(new Event("input")); // Disparar evento para generar campos
                }
            } else if (this.value === "no") {
                toggleConditionalInputs(this.value, {
                    hideContainerId: "datosResidentes",
                    hideFields: ["cantidadResidentes"],
                    showFields: [],
                });
                const camposResidentes = document.getElementById("camposResidentes");
                if (camposResidentes) {
                    camposResidentes.innerHTML = ""; // Limpiar campos dinámicos de autos
                }
            }
        });
    });

    // Eventos para alternar la sección de datos de Mascotas
    document.querySelectorAll('input[name="tieneMascota"]').forEach((radio) => {
        radio.addEventListener("change", function () {
            console.log(`Radio cambiado: tieneMascota, valor: ${this.value}`);
            if (this.value === "si") {
                toggleConditionalInputs(this.value, {
                    showContainerId: "datosMascotas",
                    showFields: ["cantidadMascotas"],
                    hideFields: [],
                });

                // Obtener el campo cantidadAutos y asignar valor predeterminado
                const cantidadMascotas = document.getElementById("cantidadMascotas");
                if (cantidadMascotas) {
                    if (!cantidadMascotas.value || cantidadMascotas.value === "0") {
                        cantidadMascotas.value = "1"; // Asignar el valor predeterminado
                    }
                    cantidadMascotas.dispatchEvent(new Event("input")); // Disparar evento para generar campos
                }
            } else if (this.value === "no") {
                toggleConditionalInputs(this.value, {
                    hideContainerId: "datosMascotas",
                    hideFields: ["cantidadMascotas"],
                    showFields: [],
                });
                const camposMascotas = document.getElementById("camposMascotas");
                if (camposMascotas) {
                    camposMascotas.innerHTML = ""; // Limpiar campos dinámicos de autos
                }
            }
        });
    });

    // Eventos para alternar entre Propietario y Arrendatario
    document.querySelectorAll('input[name="tipoPropietario"]').forEach((radio) => {
        radio.addEventListener("change", function () {
            console.log(`Radio cambiado: tipoPropietario, valor: ${this.value}`);
            if (this.value === "arrendatario") {
                toggleConditionalInputs(this.value, {
                    showContainerId: "contratoArriendo",
                    showFields: ["contrato"],
                    hideFields: [],
                });
            } else if (this.value === "propietario") {
                toggleConditionalInputs(this.value, {
                    hideContainerId: "contratoArriendo",
                    hideFields: ["contrato"],
                    showFields: [],
                });
            }
        });
    });

    // Generar dinámicamente los campos de bodegas según la cantidad ingresada
    document.getElementById("cantidadBodegas").addEventListener("input", function () {
        const cantidad = parseInt(this.value, 10) || 0;
        const camposBodegas = document.getElementById("camposBodegas");
        console.log(`Generando campos para ${cantidad} bodegas.`);

        camposBodegas.innerHTML = "";

        if (cantidad > 0 && cantidad <= 10) {
            for (let i = 1; i <= cantidad; i++) {
                const bodegaContainer = document.createElement("div");
                bodegaContainer.classList.add("bodega-container");
            
                // Agregar título para cada bodega
                const title = document.createElement("h3");
                title.textContent = `Bodega ${i}`;
                bodegaContainer.appendChild(title);
            
                const bodegaField = createDynamicField(i, "Número de Bodega", "numeroBodega",true);
                bodegaContainer.appendChild(bodegaField);
            
                camposBodegas.appendChild(bodegaContainer);
            }
        }
    });

    // Generar dinámicamente los campos de estacionamientos según la cantidad ingresada
    document.getElementById("cantidadEstacionamientos").addEventListener("input", function () {
        const cantidad = parseInt(this.value, 10) || 0;
        const camposEstacionamientos = document.getElementById("camposEstacionamientos");
        console.log(`Generando campos para ${cantidad} estacionamientos.`);

        camposEstacionamientos.innerHTML = "";

        if (cantidad > 0 && cantidad <= 10) {
            for (let i = 1; i <= cantidad; i++) {
                const estacionamientoContainer = document.createElement("div");
                estacionamientoContainer.classList.add("estacionamiento-container");
            
                // Agregar título para cada estacionamiento
                const title = document.createElement("h3");
                title.textContent = `Estacionamiento ${i}`;
                estacionamientoContainer.appendChild(title);
            
                const estacionamientoField = createDynamicField(i, "Número de Estacionamiento", "numeroEstacionamiento",true);
                estacionamientoContainer.appendChild(estacionamientoField);
            
                camposEstacionamientos.appendChild(estacionamientoContainer);
            }
        }
    });

    // Generar dinámicamente los campos de autos según la cantidad ingresada
    document.getElementById("cantidadAutos").addEventListener("input", function () {
        const cantidad = parseInt(this.value, 10) || 0;
        const camposAutos = document.getElementById("camposAutos");
        console.log(`Generando campos para ${cantidad} Autos.`);

        camposAutos.innerHTML = "";

        if (cantidad > 0 && cantidad <= 10) {
            for (let i = 1; i <= cantidad; i++) {
                // Crear contenedor para cada auto
                const autoContainer = document.createElement("div");
                autoContainer.classList.add("auto-container");

                // Agregar el título del auto
                const title = document.createElement("h3");
                title.textContent = `Auto ${i}`;
                autoContainer.appendChild(title);

                // Crear campos dinámicos: Marca, Modelo, Color, Patente
                const marcaField = createDynamicField(i, "Marca", "marcaAuto",false);
                const modeloField = createDynamicField(i, "Modelo", "modeloAuto",false);
                const colorField = createDynamicField(i, "Color", "colorAuto",false);
                const patenteField = createDynamicField(i, "Patente", "patenteAuto",true);

                // Agregar los campos al contenedor del auto
                autoContainer.appendChild(marcaField);
                autoContainer.appendChild(modeloField);
                autoContainer.appendChild(colorField);
                autoContainer.appendChild(patenteField);

                // Añadir el contenedor completo al DOM
                camposAutos.appendChild(autoContainer);
            }
        } else if (cantidad > 10) {
            const error = document.createElement("p");
            error.textContent = "Máximo 10 autos permitidos";
            error.style.color = "red";
            camposAutos.appendChild(error);
        }
    });

    // Generar dinámicamente los campos de residentes según la cantidad ingresada
    document.getElementById("cantidadResidentes").addEventListener("input", function () {
        const cantidad = parseInt(this.value, 10) || 0;
        const camposResidentes = document.getElementById("camposResidentes");
        console.log(`Generando campos para ${cantidad} Residentes.`);

        camposResidentes.innerHTML = "";

        if (cantidad > 0 && cantidad <= 10) {
            for (let i = 1; i <= cantidad; i++) {
                // Crear contenedor para cada auto
                const residenteContainer = document.createElement("div");
                residenteContainer.classList.add("residente-container");

                // Agregar el título del auto
                const title = document.createElement("h3");
                title.textContent = `Residente ${i}`;
                residenteContainer.appendChild(title);

                // Crear campos dinámicos: Marca, Modelo, Color, Patente
                const nombresField = createDynamicField(i, "Nombres", "nombreResidente",true);
                const apellidosField = createDynamicField(i, "Apellidos", "apellidoResidente",true);
                const identificacionField = createDynamicField(i, "Nº identificación", "identificacionResidente",true);
                const telefonoField = createDynamicField(i, "Telefono", "telefonoResidente",true, "tel");
                const correoField = createDynamicField(i, "Correo", "correoResidente","email");
                const parentescoField = createDynamicField(i, "Parentesco", "parentescoResidente", false);

                // Agregar los campos al contenedor del auto
                residenteContainer.appendChild(nombresField);
                residenteContainer.appendChild(apellidosField);
                residenteContainer.appendChild(identificacionField);
                residenteContainer.appendChild(telefonoField);
                residenteContainer.appendChild(correoField);
                residenteContainer.appendChild(parentescoField);

                // Añadir el contenedor completo al DOM
                camposResidentes.appendChild(residenteContainer);
            }
        } else if (cantidad > 10) {
            const error = document.createElement("p");
            error.textContent = "Máximo 10 autos permitidos";
            error.style.color = "red";
            camposResidentes.appendChild(error);
        }
    });

    // Generar dinámicamente los campos de Mascotas según la cantidad ingresada
    document.getElementById("cantidadMascotas").addEventListener("input", function () {
        const cantidad = parseInt(this.value, 10) || 0;
        const camposMascotas = document.getElementById("camposMascotas");
        console.log(`Generando campos para ${cantidad} Mascotas.`);

        camposMascotas.innerHTML = "";

        if (cantidad > 0 && cantidad <= 10) {
            for (let i = 1; i <= cantidad; i++) {
                // Crear contenedor para cada auto
                const mascotaContainer = document.createElement("div");
                mascotaContainer.classList.add("mascota-container");

                // Agregar el título del Mascota
                const title = document.createElement("h3");
                title.textContent = `Mascota ${i}`;
                mascotaContainer.appendChild(title);

                // Crear campos dinámicos: Marca, Modelo, Color, Patente
                const razaField = createDynamicField(i, "Raza", "razaMascota",true);
                const nombreField = createDynamicField(i, "Nombre", "nombreMascota",false);

                // Agregar los campos al contenedor del Mascota
                mascotaContainer.appendChild(razaField);
                mascotaContainer.appendChild(nombreField);

                // Añadir el contenedor completo al DOM
                camposMascotas.appendChild(mascotaContainer);
            }
        } else if (cantidad > 10) {
            const error = document.createElement("p");
            error.textContent = "Máximo 10 mascotas permitidos";
            error.style.color = "red";
            camposMascotas.appendChild(error);
        }
    });

    // Inicializar valores predeterminados
    console.log("Inicializando valores predeterminados para bodegas, estacionamientos y autos.");
    const cantidadBodegas = document.getElementById("cantidadBodegas");
    if (cantidadBodegas) {
        if (!cantidadBodegas.value || cantidadBodegas.value === "0") {
            cantidadBodegas.value = "1"; // Establecer valor predeterminado si no está definido
        }
        cantidadBodegas.dispatchEvent(new Event("input"));
    }

    const cantidadEstacionamientos = document.getElementById("cantidadEstacionamientos");
    if (cantidadEstacionamientos) {
        if (!cantidadEstacionamientos.value || cantidadEstacionamientos.value === "0") {
            cantidadEstacionamientos.value = "1"; // Establecer valor predeterminado si no está definido
        }
        cantidadEstacionamientos.dispatchEvent(new Event("input"));
    }

    const cantidadAutos = document.getElementById("cantidadAutos");
    if (cantidadAutos) {
        if (!cantidadAutos.value || cantidadAutos.value === "0") {
            cantidadAutos.value = "1"; // Establecer valor predeterminado si no está definido
        }
        cantidadAutos.dispatchEvent(new Event("input"));
    } else {
        console.warn("El campo cantidadAutos no se encontró en el DOM.");
    }

    const cantidadResidentes = document.getElementById("cantidadResidentes");
    if (cantidadResidentes) {
        if (!cantidadResidentes.value || cantidadResidentes.value === "0") {
            cantidadResidentes.value = "1"; // Establecer valor predeterminado si no está definido
        }
        cantidadResidentes.dispatchEvent(new Event("input"));
    } else {
        console.warn("El campo cantidadResidentes no se encontró en el DOM.");
    }

    const cantidadMascotas = document.getElementById("cantidadMascotas");
    if (cantidadMascotas) {
        if (!cantidadMascotas.value || cantidadMascotas.value === "0") {
            cantidadMascotas.value = "1"; // Establecer valor predeterminado si no está definido
        }
        cantidadMascotas.dispatchEvent(new Event("input"));
    } else {
        console.warn("El campo cantidadMascotas no se encontró en el DOM.");
    }

    // Inicializar estado inicial de las secciones
    document.querySelectorAll('input[name="documentType"]:checked, input[name="tieneBodega"]:checked, input[name="tieneEstacionamiento"]:checked, input[name="tieneAuto"]:checked, input[name="tieneMascota"]:checked, , input[name="tieneResidente"]:checked')
        .forEach(option => {
            console.log(`Inicializando opción seleccionada: ${option.name} - ${option.value}`);
            option.dispatchEvent(new Event("change"));
        });
});

// Función para crear un campo dinámico reutilizable
function createDynamicField(index, labelName, idPrefix, required = true, type = "Text") {
    const container = document.createElement("div");
    container.classList.add("input-container");

    const label = document.createElement("label");
    label.setAttribute("for", `${idPrefix}${index}`);
    label.textContent = `${labelName}`;

    const input = document.createElement("input");
    input.setAttribute("type", type);
    input.setAttribute("id", `${idPrefix}${index}`);
    input.setAttribute("name", `${idPrefix}${index}`);
    
    // Aplicar el atributo required si está configurado como true
    if (required) {
        input.setAttribute("required", "true");
    } else {
        input.removeAttribute("required");
    }

    const errorMessage = document.createElement("span");
    errorMessage.classList.add("error-message");
    errorMessage.textContent = `El campo ${labelName} es requerido`;

    container.appendChild(label);
    container.appendChild(input);
    container.appendChild(errorMessage);

    return container;
}