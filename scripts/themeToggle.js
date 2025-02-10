document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("themeToggle");
    if (!themeToggle) return;

    const icon = themeToggle.querySelector("i");

    // Asegurar que el icono inicial sea correcto
    if (document.body.classList.contains("light-mode")) {
        icon.classList.replace("fa-sun", "fa-moon");
    } else {
        icon.classList.replace("fa-moon", "fa-sun");
    }

    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("light-mode");

        // Alternar icono entre sol y luna
        if (document.body.classList.contains("light-mode")) {
            icon.classList.replace("fa-sun", "fa-moon");
        } else {
            icon.classList.replace("fa-moon", "fa-sun");
        }
    });
});
