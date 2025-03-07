let datosFormulario = {}
let modoEdicion = false; // ✅ Nuevo flag global
let idPrincipal = null;   // ✅ Guardamos el ID del registro si existe

document.addEventListener('DOMContentLoaded', () => {
    const departamentoSelect = document.getElementById('departamento');

    // Ruta al archivo JSON
    const jsonPath = 'files/departamentos.json';

    // Fetch al archivo JSON
    fetch(jsonPath)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            // Eliminar la opción predeterminada de "Cargando opciones..."
            departamentoSelect.innerHTML = '';

            // Agregar una opción inicial seleccionable
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Seleccione un departamento';
            defaultOption.disabled = true;
            defaultOption.selected = true;
            departamentoSelect.appendChild(defaultOption);

            // Poblar el select con las opciones del JSON
            data.forEach((departamento) => {
                const option = document.createElement('option');
                option.value = departamento;
                option.textContent = departamento;
                departamentoSelect.appendChild(option);
            });
        })
        .catch((error) => {
            console.error('Error cargando los departamentos:', error);
            const errorOption = document.createElement('option');
            errorOption.value = '';
            errorOption.textContent = 'Error cargando opciones';
            errorOption.disabled = true;
            departamentoSelect.appendChild(errorOption);
        });

    // Evento al seleccionar un departamento
    departamentoSelect.addEventListener('change', () => {
        const selectedDepartamento = departamentoSelect.value;
        console.log(`Departamento seleccionado: ${selectedDepartamento}`);

        if (selectedDepartamento) {
            const overlay = document.getElementById('overlay');
            const spinner = document.getElementById('spinner');

            // Mostrar spinner
            overlay.classList.remove('hidden');
            spinner.classList.remove('hidden');

            // Consulta al App Script para verificar si el departamento ya tiene datos registrados
            fetch(`https://script.google.com/macros/s/AKfycbySyhS1yXEETcVLVsUO6ds3bLFywaJf74w_NzBaf6cukR1rKr2uJZu5NEzfIB5DD2iY/exec?departamento=${encodeURIComponent(selectedDepartamento)}&action=getData`)
                .then(response => response.json())
                .then(data => {

                    if (data.status === 'success' && data.exists) {
                        datosFormulario=data;
                        idPrincipal = data.idPrincipal || null;
                        modoEdicion = true;
                        mostrarModalValidacion(selectedDepartamento);
                    }
                    else
                    {
                        modoEdicion = false;
                        idPrincipal = null;
                        overlay.classList.add('hidden');
                        spinner.classList.add('hidden');
                    }
                })
                .catch(error => {
                    console.error('Error al verificar el departamento:', error);
                    overlay.classList.add('hidden');
                    spinner.classList.add('hidden');
                });
        }
    });
});

let opcionesFalsas = {};

fetch("files/opciones_falsas.json")
    .then(response => response.json())
    .then(data => {
        opcionesFalsas = data;
        console.log("📌 Opciones falsas cargadas:", opcionesFalsas);
    })
    .catch(error => console.error("❌ Error al cargar opciones falsas:", error));

// Función para mostrar el modal con preguntas de validación
function mostrarModalValidacion(departamento) {
    console.log("📢 Solicitando datos para el departamento:", departamento);

    if (!datosFormulario || Object.keys(datosFormulario).length === 0) {
        console.warn("⚠️ No hay datos disponibles en 'datosFormulario'.");
        ocultarCargando();
        return;
    }

    console.log("📌 Usando datos ya obtenidos para la validación:", JSON.stringify(datosFormulario, null, 2));

    // ✅ Ocultar solo el overlay (para que el modal sea visible)
    const overlay = document.getElementById('overlay');
    if (overlay) overlay.classList.add('hidden');

    // ❗❗ No ocultamos el spinner aún, lo haremos después de validar

    generarPreguntasValidacion(datosFormulario);
}


// Generar preguntas aleatorias basadas en la información del departamento
function generarPreguntasValidacion(data) {
    console.log("📌 Datos completos recibidos para validación:", JSON.stringify(data, null, 2));
    let preguntas = [];

    // 🔹 Preguntas sobre residentes
    if (data.residentes && Array.isArray(data.residentes) && data.residentes.length > 0) {
        console.log("👥 Residentes encontrados:", data.residentes);
        const residenteCorrecto = data.residentes[Math.floor(Math.random() * data.residentes.length)];
        if (residenteCorrecto && residenteCorrecto.Nombres) {
            const opciones = mezclarOpciones([residenteCorrecto.Nombres, ...opcionesFalsas.residentes_falsos.slice(0, 5)]);
            preguntas.push({
                pregunta: "¿Cuál es el nombre de un residente?",
                opciones,
                respuesta: residenteCorrecto.Nombres
            });
        }
    }

    // 🔹 Preguntas sobre mascotas
    if (data.mascotas && data.mascotas.length > 0) {
        console.log("🐶 Mascotas encontradas:", data.mascotas);
        const mascotaCorrecta = data.mascotas[Math.floor(Math.random() * data.mascotas.length)];
        if (mascotaCorrecta && mascotaCorrecta.Nombre) {
            const opciones = mezclarOpciones([mascotaCorrecta.Nombre, ...opcionesFalsas.mascotas_falsas.slice(0, 5)]);
            preguntas.push({
                pregunta: "¿Cómo se llama una de las mascotas del departamento?",
                opciones,
                respuesta: mascotaCorrecta.Nombre
            });
        }
    }

    // 🔹 Preguntas sobre autos
    if (data.autos && data.autos.length > 0) {
        console.log("🚗 Autos encontrados:", data.autos);
        const autoCorrecto = data.autos[Math.floor(Math.random() * data.autos.length)];
        if (autoCorrecto && autoCorrecto.Color) {
            const opciones = mezclarOpciones([autoCorrecto.Color, ...opcionesFalsas.autos_colores_falsos.slice(0, 5)]);
            preguntas.push({
                pregunta: "¿De qué color es uno de los autos registrados?",
                opciones,
                respuesta: autoCorrecto.Color
            });
        }
    }

    // 🔹 Preguntas sobre estacionamientos
    if (data.estacionamientos && data.estacionamientos.length > 0) {
        console.log("🚙 Estacionamientos encontrados:", data.estacionamientos);
        const estacionamientoCorrecto = data.estacionamientos[0]["Número"];
        if (estacionamientoCorrecto) {
            const opciones = mezclarOpciones([estacionamientoCorrecto.toString(), ...opcionesFalsas.estacionamientos_falsos.slice(0, 5)]);
            preguntas.push({
                pregunta: "¿Cuál es el número de un estacionamiento del departamento?",
                opciones,
                respuesta: estacionamientoCorrecto.toString()
            });
        }
    }

    // 🔹 Preguntas sobre bodegas
    if (data.bodegas && data.bodegas.length > 0) {
        console.log("📦 Bodegas encontradas:", data.bodegas);
        const bodegaCorrecta = data.bodegas[0]["Número"];
        if (bodegaCorrecta) {
            const opciones = mezclarOpciones([bodegaCorrecta.toString(), ...opcionesFalsas.bodegas_falsas.slice(0, 5)]);
            preguntas.push({
                pregunta: "¿Cuál es el número de una bodega registrada?",
                opciones,
                respuesta: bodegaCorrecta.toString()
            });
        }
    }

    // 🔹 Preguntas sobre bicicletas
    if (data.bicicletas && data.bicicletas.length > 0) {
        console.log("🚴 Bicicletas encontradas:", data.bicicletas);
        const bicicletaCorrecta = data.bicicletas[Math.floor(Math.random() * data.bicicletas.length)];
        if (bicicletaCorrecta && bicicletaCorrecta.Marca) {
            const opciones = mezclarOpciones([bicicletaCorrecta.Marca, ...opcionesFalsas.bicicletas_marcas_falsas.slice(0, 5)]);
            preguntas.push({
                pregunta: "¿Cuál es la marca de una de las bicicletas del departamento?",
                opciones,
                respuesta: bicicletaCorrecta.Marca
            });
        }
    }

    // 🔹 **Si no hay datos de residentes, autos, estacionamientos, etc., hacer preguntas del contacto principal**
    if (preguntas.length === 0) {
        console.warn("⚠️ No se encontraron datos de residentes, autos, estacionamientos, etc. Generando preguntas del contacto principal...");

        // Pregunta sobre el nombre del propietario
        if (data.nombres) {
            const opciones = mezclarOpciones([data.nombres, ...opcionesFalsas.nombres_falsos.slice(0, 5)]);
            preguntas.push({
                pregunta: "¿Cuál es tu nombre registrado?",
                opciones,
                respuesta: data.nombres
            });
        }

        // Pregunta sobre el número de identificación
        if (data.numeroIdentificacion) {
            const opciones = mezclarOpciones([data.numeroIdentificacion, ...opcionesFalsas.identificaciones_falsas.slice(0, 5)]);
            preguntas.push({
                pregunta: "¿Cuál es tu número de identificación?",
                opciones,
                respuesta: data.numeroIdentificacion
            });
        }

        // Pregunta sobre el teléfono
        if (data.telefono) {
            const opciones = mezclarOpciones([data.telefono.toString(), ...opcionesFalsas.telefonos_falsos.slice(0, 5)]);
            preguntas.push({
                pregunta: "¿Cuál es tu número de teléfono registrado?",
                opciones,
                respuesta: data.telefono.toString()
            });
        }

        // Pregunta sobre el correo electrónico
        if (data.correoElectronico) {
            const opciones = mezclarOpciones([data.correoElectronico, ...opcionesFalsas.correos_falsos.slice(0, 5)]);
            preguntas.push({
                pregunta: "¿Cuál es tu correo electrónico registrado?",
                opciones,
                respuesta: data.correoElectronico
            });
        }

        // Pregunta sobre el departamento
        if (data.departamento) {
            const opciones = mezclarOpciones([data.departamento.toString(), ...opcionesFalsas.departamentos_falsos.slice(0, 5)]);
            preguntas.push({
                pregunta: "¿Cuál es tu número de departamento?",
                opciones,
                respuesta: data.departamento.toString()
            });
        }
    }

    // 🔹 Seleccionar solo 3 preguntas aleatorias
    if (preguntas.length > 3) {
        preguntas = preguntas.sort(() => 0.5 - Math.random()).slice(0, 3);
    }

    if (preguntas.length > 0) {
        console.log("📋 Preguntas seleccionadas:", preguntas);
        mostrarModalConPreguntas(preguntas);
    } else {
        console.warn("⚠️ No se generaron preguntas porque no hay suficientes datos.");
    }
}

// Función para mezclar opciones aleatoriamente
function mezclarOpciones(opciones) {
    return opciones.sort(() => Math.random() - 0.5);
}


// Mostrar modal con preguntas de validación
function mostrarModalConPreguntas(preguntas) {
    const modal = document.getElementById("modalValidacion");
    const preguntasContainer = document.getElementById("preguntasContainer");

    preguntasContainer.innerHTML = "";
    preguntas.forEach((p, index) => {
        preguntasContainer.innerHTML += `
            <p>${p.pregunta}</p>
            <select id="pregunta_${index}">
                ${p.opciones.map(opcion => `<option value="${opcion}">${opcion}</option>`).join("")}
            </select>
        `;
    });

    modal.classList.remove("hidden");

    document.getElementById("confirmarValidacion").onclick = function () {
        let respuestasCorrectas = 0;
        preguntas.forEach((p, index) => {
            const respuestaSeleccionada = document.getElementById(`pregunta_${index}`).value;
            if (respuestaSeleccionada === p.respuesta) respuestasCorrectas++;
        });

        if (respuestasCorrectas === 3) {  // ✅ Ahora la comparación es correcta
            modal.classList.add("hidden");
            console.log("✅ Verificación correcta. Poblando formulario...");

            console.log("📢 Llamando a showConfirmationMessage...");
            showConfirmationMessage("Validación exitosa. Ahora puedes editar los datos.", "success");

            poblarFormulario(datosFormulario);

            // ✅ Ahora sí ocultamos el spinner después de la validación exitosa
            ocultarCargando();
        } else {
            modal.classList.add("hidden");

            showConfirmationMessage("Validación fallida. No puede editar los datos", "error");

            // ⏳ Espera 3 segundos y redirige a index.html
            setTimeout(() => {
                window.location.href = "index.html";
            }, 3000);
        }
    };
}

function poblarFormulario(data) {
    //console.log("📌 Poblando el formulario con los datos:", JSON.stringify(data, null, 2));

    // Verificar si los datos están en un array o como objeto
    const datosPrincipales = Array.isArray(data) ? data[0] : data;

    // 🔹 Poblar datos del Contacto Principal
    asignarValorCampo("Nombres", datosPrincipales.nombres);
    asignarValorCampo("Apellidos", datosPrincipales.apellidos);
    asignarValorCampo("contacto", datosPrincipales.telefono);
    asignarValorCampo("email", datosPrincipales.correoElectronico);
    asignarValorCampo("nacionalidad", data.nacionalidad);

    // Seleccionar el tipo de identificación
    seleccionarRadio("documentType", data.tipoIdentificacion);

    // Determinar si se usa RUT o DNI
    if (data.tipoIdentificacion === "RUT") {
        document.getElementById("rutContainer").classList.remove("hidden");
        document.getElementById("dniContainer").classList.add("hidden");
        asignarValorCampo("rut", data.numeroIdentificacion);
    } else if (data.tipoIdentificacion === "DNI") {
        document.getElementById("dniContainer").classList.remove("hidden");
        document.getElementById("rutContainer").classList.add("hidden");
        asignarValorCampo("dni", data.numeroIdentificacion);
    } else {
        console.warn("⚠️ Tipo de identificación desconocido:", data.tipoIdentificacion);
    }

    // Seleccionar el radio button correcto para Edipro y Huellero
    seleccionarRadio("tieneEdipro", data.registradoEdipro);
    seleccionarRadio("tieneHuella", data.registradoHuellero);
}

function asignarValorCampo(id, valor) {
    const campo = document.getElementById(id);
    if (campo) {
        campo.value = valor;
    } else {
        console.warn(`⚠️ No se encontró el campo: ${id}`);
    }
}

function seleccionarRadio(idPrefix, valor) {
    const radio = document.querySelector(`input[name="${idPrefix}"][value="${valor}"]`);
    if (radio) {
        radio.checked = true;
    } else {
        console.warn(`⚠️ No se encontró opción de radio para: ${idPrefix} con valor ${valor}`);
    }
}

function ocultarCargando() {
    const overlay = document.getElementById('overlay');
    const spinner = document.getElementById('spinner');

    if (overlay) overlay.classList.add('hidden');
    if (spinner) spinner.classList.add('hidden');
}
