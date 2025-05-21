
fetch("reports/index.json")
    .then(res => res.json())
    .then(files => {
        // Ordenar descendente por fecha extraída del nombre
        const sorted = files
            .map(f => ({
                file: f,
                date: new Date(f.match(/\d{4}_\d{2}/)[0].replace("_", "-") + "-01")
            }))
            .sort((a, b) => b.date - a.date)
            .slice(0, 12);  // los últimos 12

        const tbody = document.querySelector(".reporte-table tbody");

        sorted.forEach(({ file, date }) => {
            const url = "reports/" + file;

            fetch(url)
                .then(res => res.text())
                .then(html => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, "text/html");
                    const resumen = doc.querySelector("#resumen-general");
                    const mes = resumen?.querySelector("h2")?.dataset?.mes || date.toLocaleDateString("es-CL", { month: "long", year: "numeric" });
                    const card = resumen?.querySelector(".card-resumen");
                    const variacion = card?.dataset?.variacion || "0";
                    const tipo = card?.dataset?.tipo || "neutra";
                    const causa = card?.innerText?.trim() || "Sin detalle";
                    const color = tipo === "baja" ? "green" : tipo === "alta" ? "red" : "gray";
                    const icono = tipo === "baja" ? "⬇️" : tipo === "alta" ? "⬆️" : "➖";

                    const tr = document.createElement("tr");
                    tr.innerHTML = `
                        <td>${mes}</td>
                        <td style="color: ${color};">${icono} ${variacion}%</td>
                        <td>${causa}</td>
                        <td><a href="${url}" class="btn-reporte" target="_blank">Ver</a></td>
                    `;
                    tbody.appendChild(tr);
                });
        });
    });
