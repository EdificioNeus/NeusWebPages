function poblarSeccionActiva(sectionId) {
    console.log(`📌 Poblando sección visible: ${sectionId}`, JSON.stringify(datosFormulario, null, 2));

    if (!datosFormulario) {
        console.warn("⚠️ No hay datos guardados en 'datosFormulario'. Se omite el poblado.");
        return;
    }

    switch (sectionId) {
        case "DatosDepartamento":
            poblarDatosDepartamento(datosFormulario);
            break;
        case "section-vehiculos":
            if (datosFormulario.autos) poblarAutos(datosFormulario.autos);
            break;
        case "section-residentes":
            if (datosFormulario.residentes) poblarResidentes(datosFormulario.residentes);
            break;
        case "section-mascotas":
            if (datosFormulario.mascotas) poblarMascotas(datosFormulario.mascotas);
            break;
        case "section-bicicletas":
            if (datosFormulario.bicicletas) poblarBicicletas(datosFormulario.bicicletas);
            break;
        default:
            console.warn(`⚠️ No hay función para poblar la sección: ${sectionId}`);
    }
}

function poblarAutos(autos) {
    console.log("🚗 Poblando autos:", autos);

    if (!autos) {
        console.warn("⚠️ No hay datos de autos para poblar.");
        return;
    }

    const cantidadAutos = document.getElementById("cantidadAutos");
    const camposAutos = document.getElementById("camposAutos");

    // ✅ Si hay autos, marcar "sí", de lo contrario, marcar "no"
    const tieneAutoValor = autos.length > 0 ? "si" : "no";
    seleccionarRadio("tieneAuto", tieneAutoValor);

    // ✅ Forzar el evento `change` en el radio seleccionado
    const radioSeleccionado = document.querySelector(`input[name="tieneAuto"][value="${tieneAutoValor}"]`);
    if (radioSeleccionado) {
        radioSeleccionado.dispatchEvent(new Event("change"));
    }

    // Limpiar los autos previos
    camposAutos.innerHTML = "";

    if (autos.length > 0) {
        cantidadAutos.value = autos.length;
        cantidadAutos.dispatchEvent(new Event("input")); // Generar campos dinámicos

        setTimeout(() => {
            autos.forEach((auto, index) => {
                asignarValorCampo(`marcaAuto${index + 1}`, auto.Marca);
                asignarValorCampo(`modeloAuto${index + 1}`, auto.Modelo);
                asignarValorCampo(`colorAuto${index + 1}`, auto.Color);
                asignarValorCampo(`patenteAuto${index + 1}`, auto.Patente);
            });
        }, 500);
    }
}

function poblarResidentes(residentes) {
    console.log("👥 Poblando residentes:", residentes);

    if (!residentes) {
        console.warn("⚠️ No hay datos de residentes para poblar.");
        return;
    }

    const cantidadResidentes = document.getElementById("cantidadResidentes");
    const camposResidentes = document.getElementById("camposResidentes");

    // ✅ Si hay residentes, marcar "sí", de lo contrario, marcar "no"
    const tieneResidenteValor = residentes.length > 0 ? "si" : "no";
    seleccionarRadio("tieneResidente", tieneResidenteValor);

    // ✅ Forzar el evento `change` en el radio seleccionado para activar la sección
    const radioSeleccionado = document.querySelector(`input[name="tieneResidente"][value="${tieneResidenteValor}"]`);
    if (radioSeleccionado) {
        radioSeleccionado.dispatchEvent(new Event("change"));
    }

    // Limpiar los residentes previos
    camposResidentes.innerHTML = "";

    if (residentes.length > 0) {
        cantidadResidentes.value = residentes.length;
        cantidadResidentes.dispatchEvent(new Event("input")); // Generar campos dinámicos

        setTimeout(() => {
            residentes.forEach((residente, index) => {
                asignarValorCampo(`nombreResidente${index + 1}`, residente.Nombres);
                asignarValorCampo(`apellidoResidente${index + 1}`, residente.Apellidos);
                asignarValorCampo(`edadResidente${index + 1}`, residente.Edad);
                asignarValorCampo(`identificacionResidente${index + 1}`, residente.NumeroIdentificacion);
                asignarValorCampo(`telefonoResidente${index + 1}`, residente.Telefono);
                asignarValorCampo(`correoResidente${index + 1}`, residente.Correo);
                asignarValorCampo(`parentescoResidente${index + 1}`, residente.Parentesco);

                // ✅ Poblar el radio de Registro en Huellero
                seleccionarRadio(`registroHuellero_${index + 1}`, residente.RegistroHuellero);

                // ✅ Poblar Necesidades Especiales (checkboxes)
                if (residente.NecesidadesEspeciales) {
                    const necesidadesArray = residente.NecesidadesEspeciales.split(",").map(nec => nec.trim()); // Dividir por coma y limpiar espacios
                    console.log(`📢 Necesidades especiales de ${residente.Nombres}:`, necesidadesArray);

                    // ✅ Ajustar el `name` del radio necesitaAdaptacion con doble índice
                    const nameNecesitaAdaptacion = `necesitaAdaptacion_${index + 1}_${index + 1}`;
                    seleccionarRadio(nameNecesitaAdaptacion, "si");

                    // ✅ Disparar evento `change` para activar la sección de necesidades especiales
                    const radioAdaptacion = document.querySelector(`input[name="${nameNecesitaAdaptacion}"][value="si"]`);
                    if (radioAdaptacion) {
                        radioAdaptacion.dispatchEvent(new Event("change"));
                    }

                    setTimeout(() => {
                        necesidadesArray.forEach(necesidad => {
                            if (necesidad.startsWith("Otras:")) {
                                // ✅ Extraer el texto de "Otras"
                                const otrasNecesidadTexto = necesidad.replace("Otras:", "").trim();

                                // ✅ Marcar el checkbox "Otras"
                                const checkboxOtras = document.getElementById(`necesidadesResidente_${index + 1}_${index + 1}_otras`);
                                const inputOtras = document.getElementById(`necesidadesResidente_${index + 1}_${index + 1}_comentario`);

                                if (checkboxOtras && inputOtras) {
                                    checkboxOtras.checked = true;
                                    inputOtras.value = otrasNecesidadTexto;
                                    inputOtras.removeAttribute("disabled");
                                    console.log(`✅ Marcando "Otras" con el texto: ${otrasNecesidadTexto}`);
                                }
                            } else {
                                // ✅ Marcar los otros checkboxes normales
                                const nameCheckbox = `necesidadesResidente_${index + 1}_${index + 1}[]`;
                                const checkbox = document.querySelector(`input[name="${nameCheckbox}"][value="${necesidad}"]`);
                                if (checkbox) {
                                    checkbox.checked = true;
                                    console.log(`✅ Checkbox marcado: ${necesidad} para residente ${residente.Nombres}`);
                                } else {
                                    console.warn(`⚠️ Checkbox no encontrado para necesidad: ${necesidad}`);
                                }
                            }
                        });
                    }, 500);
                } else {
                    // ✅ Si no tiene necesidades especiales, marcar "no" en `necesitaAdaptacion`
                    const nameNecesitaAdaptacion = `necesitaAdaptacion_${index + 1}_${index + 1}`;
                    seleccionarRadio(nameNecesitaAdaptacion, "no");
                }
            });
        }, 500);
    }
}


function poblarMascotas(mascotas) {
    console.log("🐶 Poblando mascotas:", mascotas);

    if (!mascotas) {
        console.warn("⚠️ No hay datos de mascotas para poblar.");
        return;
    }

    const cantidadMascotas = document.getElementById("cantidadMascotas");
    const camposMascotas = document.getElementById("camposMascotas");

    // ✅ Si hay mascotas, marcar "sí", de lo contrario, marcar "no"
    const tieneMascotaValor = mascotas.length > 0 ? "si" : "no";
    seleccionarRadio("tieneMascota", tieneMascotaValor);

    // ✅ Disparar `change` en el radio para que se despliegue la sección
    const radioSeleccionado = document.querySelector(`input[name="tieneMascota"][value="${tieneMascotaValor}"]`);
    if (radioSeleccionado) {
        radioSeleccionado.dispatchEvent(new Event("change"));
    }

    // Limpiar las mascotas previas
    camposMascotas.innerHTML = "";

    if (mascotas.length > 0) {
        cantidadMascotas.value = mascotas.length;
        cantidadMascotas.dispatchEvent(new Event("input"));

        setTimeout(() => {
            mascotas.forEach((mascota, index) => {
                asignarValorCampo(`razaMascota${index + 1}`, mascota.Raza);
                asignarValorCampo(`nombreMascota${index + 1}`, mascota.Nombre);

                // ✅ Marcar el radio de vacunasMascota correctamente
                const nameVacunas = `vacunasMascota_${index + 1}`;
                console.log(`📢 Buscando radio: name="${nameVacunas}" con valor "${mascota.VacunasAlDia}"`);

                seleccionarRadio(nameVacunas, mascota.VacunasAlDia);
            });
        }, 500);
    }
}

function poblarBicicletas(bicicletas) {
    console.log("🚴 Poblando bicicletas:", bicicletas);

    if (!bicicletas) {
        console.warn("⚠️ No hay datos de bicicletas para poblar.");
        return;
    }

    const cantidadBicicletas = document.getElementById("cantidadBicicletas");
    const camposBicicletas = document.getElementById("camposBicicletas");

    // ✅ Si hay bicicletas, marcar "sí", de lo contrario, marcar "no"
    const tieneBicicletaValor = bicicletas.length > 0 ? "si" : "no";
    seleccionarRadio("tieneBicicleta", tieneBicicletaValor);

    // ✅ Disparar `change` en el radio para que se despliegue la sección
    const radioSeleccionado = document.querySelector(`input[name="tieneBicicleta"][value="${tieneBicicletaValor}"]`);
    if (radioSeleccionado) {
        radioSeleccionado.dispatchEvent(new Event("change"));
    }

    // Limpiar las bicicletas previas
    camposBicicletas.innerHTML = "";

    if (bicicletas.length > 0) {
        cantidadBicicletas.value = bicicletas.length;
        cantidadBicicletas.dispatchEvent(new Event("input"));

        setTimeout(() => {
            bicicletas.forEach((bicicleta, index) => {
                asignarValorCampo(`marcaBicicleta${index + 1}`, bicicleta.Marca);
                asignarValorCampo(`colorBicicleta${index + 1}`, bicicleta.Color);
                asignarValorCampo(`bicicleteroBicicleta${index + 1}`, bicicleta["NúmeroBicicletero"]);
            });
        }, 500);
    }
}

function poblarDatosDepartamento(data) {
    console.log("🏠 Poblando datos del departamento:", data);

    if (!data)
    {
        console.warn("⚠️ No hay datos de departamento para poblar.");
        return;
    }

    // Seleccionar propietario o arrendatario
    seleccionarRadio("tipoPropietario", data.propietarioOArrendatario);

	const contratoArriendoContainer = document.getElementById("contratoArriendo");
    const contratoInput = document.getElementById("contrato");
    const contratoLink = document.getElementById("contratoLink"); // ⬅️ Nuevo enlace
    const eliminarContratoBtn = document.getElementById("eliminarContrato"); // ⬅️ Nuevo botón

    // Si es arrendatario, mostrar el contenedor de carga de contrato
    if (data.propietarioOArrendatario === "arrendatario") {
        contratoArriendoContainer.classList.remove("hidden");

        if (data.contratoDeArriendo && data.contratoDeArriendo.startsWith("https://drive.google.com")) {
            // 📂 Mostrar el enlace al contrato
            contratoLink.href = data.contratoDeArriendo;
            contratoLink.textContent = "📄 Ver contrato";
            contratoLink.classList.remove("hidden");

            // 🗑️ Mostrar botón para eliminar contrato
            eliminarContratoBtn.classList.remove("hidden");
        } else {
            // Si no hay contrato cargado, ocultar elementos
            contratoLink.classList.add("hidden");
            eliminarContratoBtn.classList.add("hidden");
        }
    } else {
        contratoArriendoContainer.classList.add("hidden");
        contratoLink.classList.add("hidden");
        eliminarContratoBtn.classList.add("hidden");
    }

    // Seleccionar si tiene estacionamiento
    seleccionarRadio("tieneEstacionamiento", data.tieneEstacionamiento);
    if (data.tieneEstacionamiento === "si")
    {
        document.getElementById("datosEstacionamiento").classList.remove("hidden");
        asignarValorCampo("cantidadEstacionamientos", data.cantidadEstacionamientos);
        document.getElementById("cantidadEstacionamientos").dispatchEvent(new Event("input"));

        setTimeout(() => {
            data.estacionamientos.forEach((estacionamiento, index) => {
                asignarValorCampo(`numeroEstacionamiento${index + 1}`, estacionamiento["Número"]);
                seleccionarRadio(`tieneControlPorton_${index + 1}`, estacionamiento["TieneControlPorton"]);
            });
        }, 500);
    } else {
        document.getElementById("datosEstacionamiento").classList.add("hidden");
    }

    // Seleccionar si tiene bodega
    seleccionarRadio("tieneBodega", data.tieneBodega);
    if (data.tieneBodega === "si")
    {
        document.getElementById("datosBodega").classList.remove("hidden");
        asignarValorCampo("cantidadBodegas", data.cantidadBodegas);
        document.getElementById("cantidadBodegas").dispatchEvent(new Event("input"));

        setTimeout(() => {
            data.bodegas.forEach((bodega, index) => {
                asignarValorCampo(`numeroBodega${index + 1}`, bodega["Número"]);
            });
        }, 500);
    }
    else
    {
        document.getElementById("datosBodega").classList.add("hidden");
    }
}
