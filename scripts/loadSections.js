document.addEventListener('DOMContentLoaded', function() {
    fetch('config.json')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('dynamic-sections');
            const enlacesContainer = document.getElementById('enlaces-interes-container');
            container.innerHTML = ""; // Limpiar contenido previo
            enlacesContainer.innerHTML = ""; // Limpiar los enlaces previos

            const now = new Date();

            // Generar secciones dinámicas (excepto Enlaces de Interés)
            data.sections.forEach(section => {
                if (section.vigencia) {
                    const expiryDate = new Date(section.vigencia + 'T23:59:59');
                    if (now > expiryDate) {
                        console.warn(`Sección "${section.title}" ha expirado el ${section.vigencia} y no se mostrará.`);
                        return;
                    }
                }

                let sectionElement = document.createElement('div');
                sectionElement.classList.add('info-box');

                // Título
                let title = document.createElement('h2');
                title.textContent = section.title;
                sectionElement.appendChild(title);

                // Descripción (Renderiza HTML)
                if (section.description) {
                    let description = document.createElement('div');
                    description.innerHTML = section.description; // Se inserta como HTML
                    sectionElement.appendChild(description);
                }

                // Botón principal
                if (section.button) {
                    let button = document.createElement('a');
                    button.href = section.button.link;
                    button.classList.add('formulario-btn');

                    let icon = document.createElement('i');
                    icon.className = section.button.icon;
                    button.appendChild(icon);

                    let buttonText = document.createTextNode(" " + section.button.text);
                    button.appendChild(buttonText);

                    sectionElement.appendChild(button);
                }

                // Contador de vigencia
                if (section.contador && section.vigencia) {
                    let counterDiv = document.createElement('div');
                    counterDiv.classList.add('contador');
                    sectionElement.appendChild(counterDiv);

                    const targetDate = new Date(section.vigencia + 'T23:59:59');
                    let interval = setInterval(() => {
                        const now = new Date();
                        const diff = targetDate - now;

                        if (diff <= 0) {
                            clearInterval(interval);
                            counterDiv.textContent = `⏳ Expirado el ${section.vigencia}`;
                            sectionElement.style.opacity = "0.5";
                            setTimeout(() => {
                                sectionElement.remove();
                            }, 5000);
                            return;
                        }

                        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                        const minutes = Math.floor((diff / (1000 * 60)) % 60);
                        const seconds = Math.floor((diff / 1000) % 60);

                        counterDiv.textContent = `⏳ Expira en: ${days} día${days !== 1 ? 's' : ''}, ${hours}h ${minutes}m ${seconds}s`;
                    }, 1000);
                }

                // Agregar la sección al contenedor principal
                container.appendChild(sectionElement);
            });

            // Generar botones de "Enlaces de Interés" agrupados de a 2
            if (data.enlacesInteres && Array.isArray(data.enlacesInteres)) {
                const groups = {};

                // Agrupar los enlaces según su grupo
                data.enlacesInteres.forEach(link => {
                    if (!groups[link.group]) {
                        groups[link.group] = [];
                    }
                    groups[link.group].push(link);
                });

                // Crear las filas de botones
                Object.values(groups).forEach(group => {
                    let buttonGroupDiv = document.createElement('div');
                    buttonGroupDiv.classList.add('button-group');

                    group.forEach(link => {
                        let linkElement = document.createElement('a');
                        linkElement.href = link.link;
                        linkElement.classList.add('btn');

                        // Agregar la clase CSS definida en el JSON
                        if (link.class) {
                            linkElement.classList.add(link.class);
                        }

                        if (link.download) {
                            linkElement.setAttribute('download', '');
                        }

                        let icon = document.createElement('i');
                        icon.className = link.icon;
                        linkElement.appendChild(icon);

                        let linkText = document.createTextNode(" " + link.text);
                        linkElement.appendChild(linkText);

                        buttonGroupDiv.appendChild(linkElement);
                    });

                    enlacesContainer.appendChild(buttonGroupDiv);
                });
            }
        })
        .catch(error => console.error('Error al cargar la configuración:', error));
});
