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

const parseNumberFromCurrency = value => {
    if (value === null || value === undefined) {
        return null;
    }

    if (typeof value === "number") {
        return Number.isFinite(value) ? value : null;
    }

    const cleaned = String(value)
        .replace(/[^\d,.-]/g, "")
        .replace(/\.(?=\d{3}(\D|$))/g, "")
        .replace(",", ".");

    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : null;
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

const CURRENCY_FORMATTER = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0
});

const PERCENTAGE_FORMATTER = new Intl.NumberFormat("es-CL", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

const formatCurrency = value =>
    value === null || value === undefined || Number.isNaN(value) ? "Sin dato" : CURRENCY_FORMATTER.format(value);

const modalContainer = document.getElementById("detalleVariacionModal");
const modalElements = modalContainer
    ? {
          dialog: modalContainer.querySelector(".detalle-modal__dialog"),
          periodo: modalContainer.querySelector("[data-modal-periodo]"),
          variacion: modalContainer.querySelector("[data-modal-variacion]"),
          variacionMonto: modalContainer.querySelector("[data-modal-variacion-monto]"),
          totalActual: modalContainer.querySelector("[data-modal-total-actual]"),
          totalAnterior: modalContainer.querySelector("[data-modal-total-anterior]"),
          causa: modalContainer.querySelector("[data-modal-causa]"),
          subfondo: modalContainer.querySelector("[data-modal-subfondo]"),
          items: modalContainer.querySelector("[data-modal-items]"),
          closeBtn: modalContainer.querySelector(".detalle-modal__close")
      }
    : {};

let lastFocusedElement = null;

const renderItemsList = items => {
    if (!modalElements.items) {
        return;
    }

    modalElements.items.innerHTML = "";
    const validItems = items.filter(item => item && item.trim());

    if (!validItems.length) {
        const li = document.createElement("li");
        li.textContent = "Sin ítems destacados.";
        modalElements.items.appendChild(li);
        return;
    }

    validItems.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        modalElements.items.appendChild(li);
    });
};

const closeDetalleModal = () => {
    if (!modalContainer) {
        return;
    }

    modalContainer.classList.add("hidden");
    modalContainer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");

    if (lastFocusedElement instanceof HTMLElement) {
        lastFocusedElement.focus();
    }
    lastFocusedElement = null;
};

const openDetalleModal = data => {
    if (!modalContainer || !data) {
        return;
    }

    lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    if (modalElements.periodo) {
        modalElements.periodo.textContent = data.mesLabel
            ? `Periodo analizado: ${data.mesLabel}`
            : "Periodo no disponible";
    }
    if (modalElements.variacion) {
        modalElements.variacion.textContent = data.indicador?.etiqueta ?? "Sin dato";
    }
    if (modalElements.variacionMonto) {
        const variacionMontoTexto =
            data.variacionMontoTexto ??
            (data.variacionMontoValor !== null && data.variacionMontoValor !== undefined
                ? CURRENCY_FORMATTER.format(data.variacionMontoValor)
                : "Sin dato");
        modalElements.variacionMonto.textContent = variacionMontoTexto;
    }
    if (modalElements.totalActual) {
        modalElements.totalActual.textContent = formatCurrency(data.totalActual);
    }
    if (modalElements.totalAnterior) {
        modalElements.totalAnterior.textContent = formatCurrency(data.totalAnterior);
    }
    if (modalElements.causa) {
        modalElements.causa.textContent = data.causa ?? "Sin detalle disponible.";
    }
    if (modalElements.subfondo) {
        modalElements.subfondo.textContent = data.subfondoPrincipal
            ? data.subfondoPrincipal
            : "No se identificó un subfondo principal.";
    }

    renderItemsList([data.itemPrincipalUno, data.itemPrincipalDos]);

    modalContainer.classList.remove("hidden");
    modalContainer.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    modalElements.dialog?.focus();
};

if (modalContainer) {
    modalContainer.querySelectorAll("[data-modal-dismiss]").forEach(btn =>
        btn.addEventListener("click", () => closeDetalleModal())
    );

    modalContainer.addEventListener("click", event => {
        const target = event.target;
        if (
            target === modalContainer ||
            (target instanceof HTMLElement && target.hasAttribute("data-modal-dismiss"))
        ) {
            closeDetalleModal();
        }
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && !modalContainer.classList.contains("hidden")) {
            closeDetalleModal();
        }
    });
}

const crearFila = (fila, detalleHandler) => {
    const { mesLabel, indicador, causa, url } = fila;
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
        <td>
            <div class="reporte-acciones">
                <a href="${url}" class="btn-reporte" target="_blank" rel="noopener">Ver</a>
                <button type="button" class="btn-detalle">Detalle</button>
            </div>
        </td>
    `;
    const detalleBtn = tr.querySelector(".btn-detalle");
    if (detalleBtn && typeof detalleHandler === "function") {
        detalleBtn.addEventListener("click", () => detalleHandler(fila));
    }
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

const chartCanvas = document.getElementById("variacionChart");
let variacionChartInstance = null;

const renderChart = (year, datasetsPorAnio) => {
    if (!chartCanvas) {
        return;
    }

    const dataset = datasetsPorAnio.get(year);
    const chartSection = chartCanvas.closest(".variacion-chart-section");

    if (!dataset || !dataset.labels.length) {
        if (variacionChartInstance) {
            variacionChartInstance.destroy();
            variacionChartInstance = null;
        }
        chartCanvas.classList.add("hidden");
        if (chartSection) {
            chartSection.classList.add("hidden");
        }
        return;
    }

    if (chartSection) {
        chartSection.classList.remove("hidden");
    }
    chartCanvas.classList.remove("hidden");

    if (variacionChartInstance) {
        variacionChartInstance.destroy();
    }

    variacionChartInstance = new Chart(chartCanvas, {
        type: "bar",
        data: {
            labels: dataset.labels,
            datasets: [
                {
                    type: "bar",
                    label: "Total mensual",
                    data: dataset.totales,
                    backgroundColor: "rgba(0, 119, 204, 0.4)",
                    borderColor: "rgba(0, 119, 204, 0.9)",
                    borderWidth: 1.5,
                    yAxisID: "totales"
                },
                {
                    type: "line",
                    label: "Variación %",
                    data: dataset.variaciones,
                    borderColor: "rgba(214, 51, 132, 0.95)",
                    backgroundColor: "rgba(214, 51, 132, 0.2)",
                    borderWidth: 2,
                    tension: 0.25,
                    fill: false,
                    pointRadius: 4,
                    pointBackgroundColor: "rgba(214, 51, 132, 0.95)",
                    yAxisID: "variacion"
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: "index",
                intersect: false
            },
            scales: {
                totales: {
                    type: "linear",
                    position: "left",
                    ticks: {
                        callback: value => CURRENCY_FORMATTER.format(value)
                    },
                    grid: {
                        drawOnChartArea: true
                    }
                },
                variacion: {
                    type: "linear",
                    position: "right",
                    ticks: {
                        callback: value => `${PERCENTAGE_FORMATTER.format(value)}%`
                    },
                    grid: {
                        drawOnChartArea: false
                    },
                    suggestedMin: -10,
                    suggestedMax: 10
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: context => {
                            if (context.dataset.yAxisID === "totales") {
                                return `${context.dataset.label}: ${CURRENCY_FORMATTER.format(context.parsed.y)}`;
                            }
                            return `${context.dataset.label}: ${PERCENTAGE_FORMATTER.format(context.parsed.y)}%`;
                        }
                    }
                },
                legend: {
                    labels: {
                        usePointStyle: true
                    }
                }
            }
        }
    });
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
                        const causaTexto = card?.innerText
                            ? card.innerText.replace(/\s+/g, " ").trim()
                            : "";
                        const causa = causaTexto || "Sin detalle";
                        const esPositivo = Number.isFinite(variacionValor) ? variacionValor > 0 : tipo === "alza";
                        const totalActual =
                            parseNumberFromCurrency(card?.dataset?.totalActual) ??
                            (() => {
                                const texto = card?.innerText ?? "";
                                const match = texto.match(/Total\s+mes\s+actual:\s*\$?([\d\.\,]+)/i);
                                return match ? parseNumberFromCurrency(match[1]) : null;
                            })();
                        const totalAnterior =
                            parseNumberFromCurrency(card?.dataset?.totalAnterior) ??
                            (() => {
                                const texto = card?.innerText ?? "";
                                const match = texto.match(/Total\s+mes\s+anterior:\s*\$?([\d\.\,]+)/i);
                                return match ? parseNumberFromCurrency(match[1]) : null;
                            })();
                        let variacionMontoValor = parseNumberFromCurrency(card?.dataset?.variacionMonto);
                        if (
                            (variacionMontoValor === null || Number.isNaN(variacionMontoValor)) &&
                            totalActual !== null &&
                            totalAnterior !== null
                        ) {
                            variacionMontoValor = totalActual - totalAnterior;
                        }
                        const variacionMontoTexto =
                            card?.dataset?.variacionMontoFormateado ??
                            (variacionMontoValor !== null && variacionMontoValor !== undefined
                                ? CURRENCY_FORMATTER.format(variacionMontoValor)
                                : null);
                        const subfondoPrincipal = (card?.dataset?.subfondoPrincipal ?? "").trim();
                        const itemPrincipalUno = (card?.dataset?.itemPrincipalUno ?? "").trim();
                        const itemPrincipalDos = (card?.dataset?.itemPrincipalDos ?? "").trim();

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
                            sortDate: parseMes(mesLabel, date),
                            variacionValor: Number.isFinite(variacionValor) ? variacionValor : null,
                            totalActual,
                            totalAnterior,
                            variacionMontoValor: Number.isFinite(variacionMontoValor) ? variacionMontoValor : null,
                            variacionMontoTexto,
                            subfondoPrincipal,
                            itemPrincipalUno,
                            itemPrincipalDos
                        };
                    });
            })
        ).then(filas => {
            const agrupado = new Map();
            const datasetsPorAnio = new Map();

            const validas = filas.filter(
                fila => fila.sortDate instanceof Date && !Number.isNaN(fila.sortDate.valueOf())
            );

            const ordenDesc = validas.slice().sort((a, b) => b.sortDate - a.sortDate);
            const ordenAsc = ordenDesc.slice().reverse();

            ordenDesc.forEach(fila => {
                const year = fila.sortDate.getUTCFullYear();
                if (!agrupado.has(year)) {
                    agrupado.set(year, []);
                }
                agrupado.get(year).push(fila);
            });

            ordenAsc.forEach(fila => {
                const year = fila.sortDate.getUTCFullYear();
                if (!datasetsPorAnio.has(year)) {
                    datasetsPorAnio.set(year, { labels: [], totales: [], variaciones: [] });
                }
                const dataset = datasetsPorAnio.get(year);
                dataset.labels.push(fila.mesLabel);
                dataset.totales.push(fila.totalActual);
                dataset.variaciones.push(fila.variacionValor);
            });

            const years = Array.from(agrupado.keys()).sort((a, b) => b - a);

            if (!years.length) {
                tbody.innerHTML = "";
                renderVacio(tbody);
                renderChart(null, datasetsPorAnio);
                return;
            }

            let activeYear = years[0];

            const renderYearRows = year => {
                if (modalContainer && !modalContainer.classList.contains("hidden")) {
                    lastFocusedElement = null;
                    closeDetalleModal();
                }

                tbody.innerHTML = "";
                const rows = agrupado.get(year) ?? [];

                if (!rows.length) {
                    renderVacio(tbody);
                    renderChart(year, datasetsPorAnio);
                    return;
                }

                rows.forEach(fila => tbody.appendChild(crearFila(fila, openDetalleModal)));
                renderChart(year, datasetsPorAnio);
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
