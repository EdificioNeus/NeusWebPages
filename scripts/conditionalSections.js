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
            const cantidadEstacionamientos = document.getElementById("cantidadEstacionamientos");

            if (this.value === "si") {
                toggleConditionalInputs(this.value, {
                    showContainerId: "datosEstacionamiento",
                    showFields: ["cantidadEstacionamientos"],
                    hideFields: [],
                });

                if (cantidadEstacionamientos) {
                    cantidadEstacionamientos.value = cantidadEstacionamientos.value || "1"; // Establecer 1 por defecto
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

    // Eventos para alternar la sección de datos de Bicicletas
    document.querySelectorAll('input[name="tieneBicicleta"]').forEach((radio) => {
        radio.addEventListener("change", function () {
            console.log(`Radio cambiado: tieneBicicleta, valor: ${this.value}`);
            if (this.value === "si") {
                toggleConditionalInputs(this.value, {
                    showContainerId: "datosBicicletas",
                    showFields: ["cantidadBicicletas"],
                    hideFields: [],
                });

                // Obtener el campo cantidadBicicletas y asignar valor predeterminado
                const cantidadBicicletas = document.getElementById("cantidadBicicletas");
                if (cantidadBicicletas) {
                    if (!cantidadBicicletas.value || cantidadBicicletas.value === "0") {
                        cantidadBicicletas.value = "1"; // Asignar el valor predeterminado
                    }
                    cantidadBicicletas.dispatchEvent(new Event("input")); // Disparar evento para generar campos
                }
            } else if (this.value === "no") {
                toggleConditionalInputs(this.value, {
                    hideContainerId: "datosBicicletas",
                    hideFields: ["cantidadBicicletas"],
                    showFields: [],
                });
                const camposBicicletas = document.getElementById("camposBicicletas");
                if (camposBicicletas)
                {
                    camposBicicletas.innerHTML = ""; // Limpiar campos dinámicos de autos
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

        // Verifica si ya se han generado los campos para evitar duplicación
        if (camposEstacionamientos.children.length === cantidad) {
            console.log("Los campos ya están generados, evitando duplicación.");
            return;
        }

        camposEstacionamientos.innerHTML = "";

        if (cantidad > 0 && cantidad <= 10) {
            fetch('files/estacionamientos.json')
                .then(response => response.json())
                .then(estacionamientosDisponibles => {
                    for (let i = 1; i <= cantidad; i++) {
                        const estacionamientoContainer = document.createElement("div");
                        estacionamientoContainer.classList.add("estacionamiento-container");

                        // Agregar título para cada estacionamiento
                        const title = document.createElement("h3");
                        title.textContent = `Estacionamiento ${i}`;
                        estacionamientoContainer.appendChild(title);

                        // Crear el select de estacionamientos con opciones desde el JSON
                        const estacionamientoField = createDynamicField(i, "Número de Estacionamiento", "numeroEstacionamiento", true, "select", estacionamientosDisponibles);

                        // Crear el radio button de "¿Tiene Control Portón?"
                        const tieneControlPorton = createDynamicRadioGroup(i, "¿Tiene Control Portón?", "controlPorton", [
                            { value: "si", label: "Sí" },
                            { value: "no", label: "No", checked: true }
                        ], true);

                        estacionamientoContainer.appendChild(estacionamientoField);
                        estacionamientoContainer.appendChild(tieneControlPorton);

                        camposEstacionamientos.appendChild(estacionamientoContainer);
                    }
                })
                .catch(error => {
                    console.error('Error cargando los estacionamientos:', error);
                });
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
                title.textContent = `Vehiculo ${i}`;
                autoContainer.appendChild(title);

                // Crear campos dinámicos: Marca, Modelo, Color, Patente
                const marcaField = createDynamicField(i, "Marca", "marcaAuto",false);
                const modeloField = createDynamicField(i, "Modelo", "modeloAuto",false);
                const colorField = createDynamicField(i, "Color", "colorAuto",false);
                const patenteField = createDynamicField(i, "Patente", "patenteAuto",true);

                // Agregar los campos al contenedor del auto
                const tipoRadioGroup = createDynamicRadioGroup(i, "¿Tipo de vehiculo?", "tipoVehiculo", [
                    { value: "auto", label: "Auto" },
                    { value: "moto", label: "Moto" }
                ], true);
                autoContainer.appendChild(tipoRadioGroup);
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
                const residenteContainer = document.createElement("div");
                residenteContainer.classList.add("residente-container");

                // Título del residente
                const title = document.createElement("h3");
                title.textContent = `Residente ${i}`;
                residenteContainer.appendChild(title);

                // Campos básicos
                const nombresField = createDynamicField(i, "Nombres", "nombreResidente", true);
                const apellidosField = createDynamicField(i, "Apellidos", "apellidoResidente", true);
                const edadField = createDynamicField(i, "Edad", "edadResidente", true, "number", "0", "99");
                const identificacionField = createDynamicField(i, "Nº identificación", "identificacionResidente", true);
                const registroBiometrico = createDynamicRadioGroup(i, "¿Registro en Huellero?", "registroHuellero", [
                    { value: "si", label: "Sí" },
                    { value: "no", label: "No" }
                ], true);
                const telefonoField = createDynamicField(i, "Teléfono", "telefonoResidente", true, "tel");
                const correoField = createDynamicField(i, "Correo", "correoResidente", "email");
                const parentescoField = createDynamicField(i, "Parentesco", "parentescoResidente", false);

                // Pregunta sobre necesidades especiales
                const necesitaAdaptacionContainer = document.createElement("div");
                necesitaAdaptacionContainer.classList.add("input-container");

                const necesitaAdaptacionLabel = document.createElement("label");
                necesitaAdaptacionLabel.textContent = "¿Requiere alguna adaptación o asistencia especial?";

                const necesitaAdaptacionRadios = createDynamicRadioGroup(i, "", `necesitaAdaptacion_${i}`, [
                    { value: "si", label: "Sí" },
                    { value: "no", label: "No", checked: true }
                ], true);

                necesitaAdaptacionContainer.appendChild(necesitaAdaptacionLabel);
                necesitaAdaptacionContainer.appendChild(necesitaAdaptacionRadios);

                // Contenedor de necesidades especiales (oculto por defecto)
                const necesidadesContainer = document.createElement("div");
                necesidadesContainer.id = `necesidadesEspecialesContainer_${i}`;
                necesidadesContainer.classList.add("hidden");

                const necesidadesCheckbox = createDynamicCheckboxGroup(i, "Seleccione las necesidades especiales:", `necesidadesResidente_${i}`, [
                    { value: "discapacidad_visual", label: "Discapacidad visual" },
                    { value: "discapacidad_auditiva", label: "Discapacidad auditiva" },
                    { value: "discapacidad_motriz", label: "Discapacidad motriz" },
                    { value: "discapacidad_cognitiva", label: "Discapacidad cognitiva" },
                    { value: "trastorno_habla", label: "Trastorno del habla" },
                    { value: "condicion_medica", label: "Condición médica crónica" },
                    { value: "condicion_psiquiatrica", label: "Condición psiquiátrica" },
                    { value: "alergias_severas", label: "Alergias severas" },
                    { value: "sensibilidad_ambiental", label: "Sensibilidad ambiental" },
                    { value: "otras", label: "Otras (especificar en comentarios)" }
                ]);

                necesidadesContainer.appendChild(necesidadesCheckbox);

                // Evento para mostrar u ocultar necesidades especiales
                necesitaAdaptacionRadios.querySelectorAll("input").forEach(radio => {
                    radio.addEventListener("change", function () {
                        if (this.value === "si") {
                            necesidadesContainer.classList.remove("hidden");
                        } else {
                            necesidadesContainer.classList.add("hidden");
                        }
                    });
                });

                // Agregar los elementos al contenedor del residente
                residenteContainer.appendChild(nombresField);
                residenteContainer.appendChild(apellidosField);
                residenteContainer.appendChild(edadField);
                residenteContainer.appendChild(identificacionField);
                residenteContainer.appendChild(registroBiometrico);
                residenteContainer.appendChild(telefonoField);
                residenteContainer.appendChild(correoField);
                residenteContainer.appendChild(parentescoField);
                residenteContainer.appendChild(necesitaAdaptacionContainer);
                residenteContainer.appendChild(necesidadesContainer);

                // Agregar el contenedor completo
                camposResidentes.appendChild(residenteContainer);
            }
        } else if (cantidad > 10) {
            const error = document.createElement("p");
            error.textContent = "Máximo 10 residentes permitidos";
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
                const vacunasRadioGroup = createDynamicRadioGroup(i, "¿Tiene vacunas al día?", "vacunasMascota", [
                    { value: "si", label: "Sí" },
                    { value: "no", label: "No" }
                ], true);

                // Agregar los campos al contenedor del Mascota
                mascotaContainer.appendChild(razaField);
                mascotaContainer.appendChild(nombreField);
                mascotaContainer.appendChild(vacunasRadioGroup);

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

    // Generar dinámicamente los campos de Bicicletas según la cantidad ingresada
    document.getElementById("cantidadBicicletas").addEventListener("input", function () {
        const cantidad = parseInt(this.value, 10) || 0;
        const camposBicicletas = document.getElementById("camposBicicletas");
        console.log(`Generando campos para ${cantidad} Bicicletas.`);

        camposBicicletas.innerHTML = "";

        if (cantidad > 0 && cantidad <= 10) {
            for (let i = 1; i <= cantidad; i++) {

                const bicicletaContainer = document.createElement("div");
                bicicletaContainer.classList.add("bicicleta-container");

                const title = document.createElement("h3");
                title.textContent = `Bicicleta ${i}`;
                bicicletaContainer.appendChild(title);

                const marcaBicicleta = createDynamicField(i, "Marca", "marcaBicicleta",true);
                const colorBicicleta = createDynamicField(i, "Color", "colorBicicleta",false);
                const numBicicletero = createDynamicField(i, "Bicicletero", "bicicleteroBicicleta",false, "number", "1", "10");

                bicicletaContainer.appendChild(marcaBicicleta);
                bicicletaContainer.appendChild(colorBicicleta);
                bicicletaContainer.appendChild(numBicicletero);

                camposBicicletas.appendChild(bicicletaContainer);
            }
        } else if (cantidad > 10) {
            const error = document.createElement("p");
            error.textContent = "Máximo 10 bicicletas permitidos";
            error.style.color = "red";
            camposBicicletas.appendChild(error);
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

    const cantidadBicicletas = document.getElementById("cantidadBicicletas");
    if (cantidadBicicletas) {
        if (!cantidadBicicletas.value || cantidadBicicletas.value === "0") {
            cantidadBicicletas.value = "1"; // Establecer valor predeterminado si no está definido
        }
        cantidadBicicletas.dispatchEvent(new Event("input"));
    } else {
        console.warn("El campo cantidadBicicletas no se encontró en el DOM.");
    }

    // Inicializar estado inicial de las secciones
    document.querySelectorAll('input[name="documentType"]:checked, input[name="tieneBodega"]:checked, input[name="tieneEstacionamiento"]:checked, input[name="tieneAuto"]:checked, input[name="tieneMascota"]:checked, input[name="tieneResidente"]:checked, input[name="tieneBicicleta"]:checked' )
        .forEach(option => {
            console.log(`Inicializando opción seleccionada: ${option.name} - ${option.value}`);
            option.dispatchEvent(new Event("change"));
        });
});

// Función para crear un campo dinámico reutilizable
function createDynamicField(index, labelName, idPrefix, required = true, type = "text", options = null) {
    const container = document.createElement("div");
    container.classList.add("input-container");

    const label = document.createElement("label");
    label.setAttribute("for", `${idPrefix}${index}`);
    label.textContent = `${labelName}`;

    let input;

    if (options && type === "select") {
        // Si hay opciones, crear un <select>
        input = document.createElement("select");
        input.setAttribute("id", `${idPrefix}${index}`);
        input.setAttribute("name", `${idPrefix}${index}`);

        // Opción por defecto
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = `Seleccione ${labelName}`;
        defaultOption.disabled = true;
        defaultOption.selected = true;
        input.appendChild(defaultOption);

        // Agregar opciones del JSON
        options.forEach(optionValue => {
            const option = document.createElement("option");
            option.value = optionValue;
            option.textContent = optionValue;
            input.appendChild(option);
        });
    } else {
        // Si no hay opciones, crear un <input>
        input = document.createElement("input");
        input.setAttribute("type", type);
        input.setAttribute("id", `${idPrefix}${index}`);
        input.setAttribute("name", `${idPrefix}${index}`);
    }

    if (required) {
        input.setAttribute("required", "true");
    }

    const errorMessage = document.createElement("span");
    errorMessage.classList.add("error-message");
    errorMessage.textContent = `El campo ${labelName} es requerido`;

    container.appendChild(label);
    container.appendChild(input);
    container.appendChild(errorMessage);

    return container;
}

function createDynamicRadioGroup(index, labelName, idPrefix, options, required = true) {
    const container = document.createElement("div");
    container.classList.add("input-container");

    const label = document.createElement("label");
    label.textContent = labelName;

    const radioGroup = document.createElement("div");
    radioGroup.classList.add("radio-group");

    options.forEach((option, idx) => {
        const radioContainer = document.createElement("div");

        const input = document.createElement("input");
        input.setAttribute("type", "radio");
        input.setAttribute("id", `${idPrefix}_${index}_${idx}`);
        input.setAttribute("name", `${idPrefix}_${index}`);
        input.setAttribute("value", option.value);

        // Verificar si la opción tiene `checked: true`, si no hay ninguna, marcar la primera por defecto
        if (option.checked === true) {
            input.checked = true;
        } else if (!options.some(opt => opt.checked) && idx === 0) {
            input.checked = true; // Si ninguna opción tiene `checked`, marcar la primera por defecto
        }

        if (required) {
            input.setAttribute("required", "true");
        }

        const radioLabel = document.createElement("label");
        radioLabel.setAttribute("for", `${idPrefix}_${index}_${idx}`);
        radioLabel.textContent = option.label;

        radioContainer.appendChild(input);
        radioContainer.appendChild(radioLabel);
        radioGroup.appendChild(radioContainer);
    });

    container.appendChild(label);
    container.appendChild(radioGroup);

    return container;
}

function createDynamicCheckboxGroup(index, labelName, idPrefix, options) {
    const container = document.createElement("div");
    container.classList.add("input-container");

    const label = document.createElement("label");
    label.textContent = labelName;

    const checkboxGroup = document.createElement("div");
    checkboxGroup.classList.add("checkbox-group");

    let otrasCheckboxId = `${idPrefix}_${index}_otras`; // ID único para "Otras"
    let otrasInputId = `${idPrefix}_${index}_comentario`; // ID del input de texto

    options.forEach((option, idx) => {
        const checkboxContainer = document.createElement("div");
        checkboxContainer.classList.add("checkbox-item");

        const input = document.createElement("input");
        input.setAttribute("type", "checkbox");
        input.setAttribute("id", `${idPrefix}_${index}_${idx}`);
        input.setAttribute("name", `${idPrefix}_${index}[]`);
        input.setAttribute("value", option.value);

        // Si esta opción es "Otras", asignamos el ID específico
        if (option.value === "otras") {
            input.setAttribute("id", otrasCheckboxId);
        }

        const checkboxLabel = document.createElement("label");
        checkboxLabel.setAttribute("for", `${idPrefix}_${index}_${idx}`);
        checkboxLabel.textContent = option.label;

        checkboxContainer.appendChild(input);
        checkboxContainer.appendChild(checkboxLabel);
        checkboxGroup.appendChild(checkboxContainer);
    });

    // Campo de entrada para "Otras"
    const otrasContainer = document.createElement("div");
    otrasContainer.classList.add("otras-container", "hidden"); // Se oculta por defecto

    const otrasInputLabel = document.createElement("label");
    otrasInputLabel.setAttribute("for", otrasInputId);
    otrasInputLabel.textContent = "Especifique otra necesidad";

    const otrasInput = document.createElement("input");
    otrasInput.setAttribute("type", "text");
    otrasInput.setAttribute("id", otrasInputId);
    otrasInput.setAttribute("name", otrasInputId);
    otrasInput.setAttribute("placeholder", "Ingrese la necesidad...");
    otrasInput.setAttribute("disabled", "true"); // Inicialmente deshabilitado

    otrasContainer.appendChild(otrasInputLabel);
    otrasContainer.appendChild(otrasInput);
    checkboxGroup.appendChild(otrasContainer);

    container.appendChild(label);
    container.appendChild(checkboxGroup);

    // Aseguramos que el evento se agregue correctamente
    setTimeout(() => {
        const otrasCheckbox = document.getElementById(otrasCheckboxId);
        const otrasTextInput = document.getElementById(otrasInputId);

        if (otrasCheckbox && otrasTextInput) {
            otrasCheckbox.addEventListener("change", function () {
                if (this.checked) {
                    otrasContainer.classList.remove("hidden");
                    otrasTextInput.removeAttribute("disabled"); // Habilitar input
                    otrasTextInput.setAttribute("required", "true"); // Hacerlo requerido
                } else {
                    otrasContainer.classList.add("hidden");
                    otrasTextInput.setAttribute("disabled", "true"); // Deshabilitar input
                    otrasTextInput.removeAttribute("required"); // Quitar requerimiento
                    otrasTextInput.value = ""; // Limpiar el campo si se deselecciona
                }
            });
        } else {
            console.warn("No se encontró el checkbox de 'Otras' o el campo de texto.");
        }
    }, 100); // Retrasa la ejecución para asegurar que los elementos existan en el DOM

    return container;
}
