window.imagenesCapturadas = []; // Array global para almacenar imágenes capturadas
function abrirCamara() {
    console.log("Intentando abrir la cámara...");

    const cameraContainer = document.getElementById("cameraContainer");
    const video = document.getElementById("video");

    if (!cameraContainer || !video) {
        console.error("No se encontraron elementos de la cámara en el DOM.");
        return;
    }

    // Mostrar la cámara solo cuando el usuario lo solicite
    cameraContainer.style.display = "block";

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            console.log("Cámara activada, asignando stream al video...");
            video.srcObject = stream;
            window.videoStream = stream;
        })
        .catch(error => {
            console.error("Error al acceder a la cámara:", error);
        });
}

function detenerCamara() {
    console.log("Cerrando cámara...");

    if (window.videoStream) {
        window.videoStream.getTracks().forEach(track => track.stop());
        console.log("Cámara detenida.");
    } else {
        console.warn("No hay una cámara activa para detener.");
    }

    const cameraContainer = document.getElementById("cameraContainer");
    if (cameraContainer) {
        cameraContainer.style.display = "none"; // Ocultar cuando se cierre
    }
}

window.abrirCamara = abrirCamara;
window.detenerCamara = detenerCamara;

document.addEventListener("DOMContentLoaded", function () {
    const dropZone = document.getElementById("contrato");
    const abrirCamaraBtn = document.getElementById("abrirCamara");
    const previewContainer = document.getElementById("previewContainer");
    const esArrendatario = document.getElementById("esArrendatario");
    const esPropietario = document.getElementById("esPropietario");
    let videoStream = null;
    const captureButton = document.getElementById("captureButton");
    const video = document.getElementById("video");

    if (captureButton && video) {
        captureButton.addEventListener("click", (e) => {
            e.preventDefault();
            capturarImagen(video);
        });
    }

    // --- DRAG & DROP PARA ARCHIVOS ---
    if (dropZone) {
        dropZone.addEventListener("dragover", (event) => {
            event.preventDefault();
            dropZone.classList.add("dragover");
        });

        dropZone.addEventListener("dragleave", () => {
            dropZone.classList.remove("dragover");
        });

        dropZone.addEventListener("drop", (event) => {
            event.preventDefault();
            dropZone.classList.remove("dragover");

            if (event.dataTransfer.files.length > 0) {
                dropZone.files = event.dataTransfer.files; // Asigna los archivos
            }
        });
    }

    // --- MANEJAR CAMBIO ENTRE PROPIETARIO Y ARRENDATARIO ---
    esArrendatario.addEventListener("change", () => {
        document.getElementById("contratoArriendo").classList.remove("hidden");
    });

    esPropietario.addEventListener("change", () => {
        document.getElementById("contratoArriendo").classList.add("hidden");
        cerrarCamaraSiEstaAbierta();
    });

    // --- ABRIR CÁMARA SOLO CUANDO SE SELECCIONE "ARRENDATARIO" ---
    if (abrirCamaraBtn) {
        abrirCamaraBtn.addEventListener("click", () => {
            if (esArrendatario.checked) {
                abrirCamara();
            }
        });
    }

    function abrirCamara() {
        const cameraContainer = document.getElementById("cameraContainer");
        if (!cameraContainer) return;

        cameraContainer.classList.remove("hidden");

        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                const video = document.getElementById("video");
                video.srcObject = stream;
                videoStream = stream;
            })
            .catch(error => {
                console.error("Error al acceder a la cámara:", error);
            });
    }

    // --- CAPTURAR IMAGEN ---
    function capturarImagen(video) {
        if (imagenesCapturadas.length >= 5) {
            alert("Máximo 5 imágenes permitidas.");
            return;
        }

        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imagenData = canvas.toDataURL("image/jpeg");

        imagenesCapturadas.push(imagenData);
        refreshPreviewContainer(imagenData);

        setTimeout(() => {
            const abrirCamaraBtn = document.getElementById("abrirCamara");
            console.log("Estado del botón Usar Cámara:", abrirCamaraBtn ? abrirCamaraBtn.style.display : "No encontrado");
        }, 500);

        // Simula la carga del contrato
        const contratoInput = document.getElementById("contrato");
        const contratoError = contratoInput?.nextElementSibling;

        if (contratoInput) {
            const pdfDataUri = convertirImagenesAPDF();

            if (pdfDataUri) {
                contratoInput.dataset.pdf = pdfDataUri; // Guarda el PDF en un atributo
                contratoInput.setAttribute("data-valid", "true"); // Atributo que usaremos en la validación

                // Disparar eventos para forzar reconocimiento del cambio
                contratoInput.dispatchEvent(new Event("change", { bubbles: true }));
                contratoInput.dispatchEvent(new Event("input", { bubbles: true }));
            }

            contratoInput.classList.remove("input-error");
            if (contratoError) contratoError.style.display = "none";
        }

        document.getElementById("abrirCamara").style.display = "block";
        document.getElementById("abrirCamara").classList.remove("hidden");

    }

    // --- MOSTRAR IMAGEN PREVIA ---
    function refreshPreviewContainer() {
        const previewContainer = document.getElementById("previewContainer");
        previewContainer.innerHTML = ""; // Limpiar el contenedor

        window.imagenesCapturadas.forEach((imagenData, index) => {
            // Contenedor para cada previsualización
            const previewWrapper = document.createElement("div");
            previewWrapper.classList.add("preview-wrapper");
            previewWrapper.style.position = "relative";
            previewWrapper.style.display = "inline-block";
            previewWrapper.style.margin = "5px";

            // Imagen
            const img = document.createElement("img");
            img.src = imagenData;
            img.classList.add("preview-image");

            // Botón para eliminar (la "X")
            const deleteBtn = document.createElement("span");
            deleteBtn.classList.add("delete-preview");
            deleteBtn.textContent = "×";
            // Estilos para la "X"
            deleteBtn.style.position = "absolute";
            deleteBtn.style.top = "0";
            deleteBtn.style.right = "0";
            deleteBtn.style.background = "rgba(255, 0, 0, 0.8)";
            deleteBtn.style.color = "white";
            deleteBtn.style.borderRadius = "50%";
            deleteBtn.style.cursor = "pointer";
            deleteBtn.style.padding = "2px 6px";
            deleteBtn.style.fontSize = "16px";

            // Eliminar la imagen al hacer clic en la "X"
            deleteBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                window.imagenesCapturadas.splice(index, 1);
                refreshPreviewContainer();
            });

            previewWrapper.appendChild(img);
            previewWrapper.appendChild(deleteBtn);
            previewContainer.appendChild(previewWrapper);
        });
    }

    // --- CERRAR CÁMARA ---
    function detenerCamara() {
        const cameraContainer = document.getElementById("cameraContainer");

        if (videoStream) {
            videoStream.getTracks().forEach(track => track.stop());
        }

        if (cameraContainer) {
            cameraContainer.classList.add("hidden"); // Ocultar cámara al cerrarla
        }
    }

    function cerrarCamaraSiEstaAbierta() {
        const cameraContainer = document.getElementById("cameraContainer");
        if (cameraContainer) {
            detenerCamara(cameraContainer);
        }
    }

    // --- CONVERTIR IMÁGENES A PDF ---
    window.convertirImagenesAPDF = function () {
        if (window.imagenesCapturadas.length === 0) return null;

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();

        window.imagenesCapturadas.forEach((imagen, index) => {
            if (index > 0) pdf.addPage();
            pdf.addImage(imagen, "JPEG", 10, 10, 180, 160);
        });

        return pdf.output("datauristring"); // Devuelve el PDF en Base64
    };
});
