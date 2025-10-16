const MONTH_MAP = {
    enero: 0,
    febrero: 1,
    marzo: 2,
    abril: 3,
    mayo: 4,
    junio: 5,
    julio: 6,
    agosto: 7,
    septiembre: 8,
    setiembre: 8,
    octubre: 9,
    noviembre: 10,
    diciembre: 11
};

const parseMes = (mesLabel, fallbackDate) => {
    if (!mesLabel) {
        return fallbackDate;
    }

    const normalizado = mesLabel
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+de\s+/g, " ");

    const partes = normalizado.trim().split(/\s+/);
    const nombreMes = partes[0];
    const anio = parseInt(partes[partes.length - 1], 10);

    if (!Number.isNaN(anio) && nombreMes in MONTH_MAP) {
        return new Date(Date.UTC(anio, MONTH_MAP[nombreMes], 1));
    }

    return fallbackDate;
};

const crearFila = ({ mesLabel, indicador, causa, url }) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${mesLabel}</td>
        <td>
            <span class="variacion-indicador ${indicador.clase}">
                <span class="variacion-icono"><i class="fas ${indicador.icono}" aria-hidden="true"></i></span>
                <span class="variacion-valor">${indicador.etiqueta}</span>
            </span>
        </td>
        <td>${causa}</td>
        <td><a href="${url}" class="btn-reporte" target="_blank">Ver</a></td>
    `;
    return tr;
};

const renderVacio = tbody => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td class="no-reportes" colspan="4">
            No hay reportes disponibles para el periodo seleccionado.
        </td>
    `;
    tbody.appendChild(tr);
};

fetch("reports/index.json")
    .then(res => res.json())
    .then(files => {
        const tbody = document.querySelector(".reporte-table tbody");
        const tabsContainer = document.querySelector(".year-tabs");

        if (!tbody || !tabsContainer) {
            return;
        }

        const baseList = files
            .map(file => ({
                file,
                date: new Date(file.match(/\d{4}_\d{2}/)[0].replace("_", "-") + "-01")
            }))
            .sort((a, b) => b.date - a.date);

        return Promise.all(
            baseList.map(({ file, date }) => {
                const url = "reports/" + file;

                return fetch(url)
                    .then(res => res.text())
                    .then(html => {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(html, "text/html");
                        const resumen = doc.querySelector("#resumen-general");
                        const mesLabel =
                            resumen?.querySelector("h2")?.dataset?.mes ??
                            date.toLocaleDateString("es-CL", { month: "long", year: "numeric" });
                        const card = resumen?.querySelector(".card-resumen");
                        const variacionValor = parseFloat(card?.dataset?.variacion ?? "0");
                        const variacion = Number.isFinite(variacionValor)
                            ? `${variacionValor > 0 ? "+" : ""}${variacionValor.toFixed(2)}`
                            : card?.dataset?.variacion ?? "0";
                        const tipo = (card?.dataset?.tipo ?? "neutra").toLowerCase();
                        const causa = card?.innerText?.trim() ?? "Sin detalle";
                        const esPositivo = Number.isFinite(variacionValor) ? variacionValor > 0 : tipo === "alza";

                        const indicador = (() => {
                            if (tipo === "baja") {
                                return { clase: "variacion-baja", icono: "fa-arrow-down", etiqueta: `${variacion}%` };
                            }
                            if (tipo === "alza" || esPositivo) {
                                return { clase: "variacion-alza", icono: "fa-arrow-up", etiqueta: `${variacion}%` };
                            }
                            return { clase: "variacion-neutra", icono: "fa-minus", etiqueta: `${variacion}%` };
                        })();

                        return {
                            mesLabel,
                            indicador,
                            causa,
                            url,
                            sortDate: parseMes(mesLabel, date)
                        };
                    });
            })
        ).then(filas => {
            const agrupado = new Map();

            filas
                .filter(fila => fila.sortDate instanceof Date && !Number.isNaN(fila.sortDate.valueOf()))
                .sort((a, b) => b.sortDate - a.sortDate)
                .forEach(fila => {
                    const year = fila.sortDate.getUTCFullYear();
                    if (!agrupado.has(year)) {
                        agrupado.set(year, []);
                    }
                    agrupado.get(year).push(fila);
                });

            const years = Array.from(agrupado.keys()).sort((a, b) => b - a);

            if (!years.length) {
                tbody.innerHTML = "";
                renderVacio(tbody);
                return;
            }

            let activeYear = years[0];

            const renderYearRows = year => {
                tbody.innerHTML = "";
                const rows = agrupado.get(year) ?? [];

                if (!rows.length) {
                    renderVacio(tbody);
                    return;
                }

                rows.forEach(fila => tbody.appendChild(crearFila(fila)));
            };

            const updateActiveTab = () => {
                const botones = tabsContainer.querySelectorAll(".year-tab");
                botones.forEach(btn => {
                    const { year } = btn.dataset;
                    if (Number(year) === activeYear) {
                        btn.classList.add("is-active");
                        btn.setAttribute("aria-selected", "true");
                        btn.setAttribute("tabindex", "0");
                    } else {
                        btn.classList.remove("is-active");
                        btn.setAttribute("aria-selected", "false");
                        btn.setAttribute("tabindex", "-1");
                    }
                });
            };

            tabsContainer.innerHTML = "";
            years.forEach(year => {
                const button = document.createElement("button");
                button.type = "button";
                button.className = "year-tab";
                button.dataset.year = String(year);
                button.setAttribute("role", "tab");
                button.innerHTML = `
                    ${year}
                    <span class="year-count">(${agrupado.get(year).length})</span>
                `;
                button.addEventListener("click", () => {
                    if (activeYear === year) {
                        return;
                    }
                    activeYear = year;
                    updateActiveTab();
                    renderYearRows(activeYear);
                });
                tabsContainer.appendChild(button);
            });

            tabsContainer.setAttribute("role", "tablist");
            updateActiveTab();
            renderYearRows(activeYear);
        });
    })
    .catch(err => {
        console.error("Error al cargar los informes", err);
    });
