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

fetch("reports/index.json")
    .then(res => res.json())
    .then(files => {
        const baseList = files
            .map(file => ({
                file,
                date: new Date(file.match(/\d{4}_\d{2}/)[0].replace("_", "-") + "-01")
            }))
            .sort((a, b) => b.date - a.date)
            .slice(0, 12);

        const tbody = document.querySelector(".reporte-table tbody");

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
                        const variacion = card?.dataset?.variacion ?? "0";
                        const tipo = card?.dataset?.tipo ?? "neutra";
                        const causa = card?.innerText?.trim() ?? "Sin detalle";
                        const color = tipo === "baja" ? "green" : tipo === "alta" ? "red" : "gray";
                        const icono = tipo === "baja" ? "&darr;" : tipo === "alta" ? "&uarr;" : "&rarr;";

                        return {
                            mesLabel,
                            variacion,
                            color,
                            icono,
                            causa,
                            url,
                            sortDate: parseMes(mesLabel, date)
                        };
                    });
            })
        ).then(rows => {
            rows
                .sort((a, b) => b.sortDate - a.sortDate)
                .forEach(({ mesLabel, variacion, color, icono, causa, url }) => {
                    const tr = document.createElement("tr");
                    tr.innerHTML = `
                        <td>${mesLabel}</td>
                        <td style="color: ${color};">${icono} ${variacion}%</td>
                        <td>${causa}</td>
                        <td><a href="${url}" class="btn-reporte" target="_blank">Ver</a></td>
                    `;
                    tbody.appendChild(tr);
                });
        });
    })
    .catch(err => {
        console.error("Error al cargar los informes", err);
    });
