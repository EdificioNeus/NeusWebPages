# Project: Neus Web Pages

## Project Overview

This project is a static website for the "Edificio Neus" building. Its main purpose is to serve as a portal for residents, providing the following functionalities:

*   **Resident Registration:** A multi-step form (`formulario.html`) allows residents to register and update their information, including contact details, pets, vehicles, and more. This form is dynamically populated with data from JSON files and includes features like document validation and image capture.
*   **Information Hub:** The main page (`index.html`) serves as a landing page with important announcements and links. It dynamically loads content from `config.json`.
*   **Expense Reports:** The `informes.html` page displays monthly common expense reports, with charts and detailed tables. These reports are loaded dynamically.

The website is built using **HTML, CSS, and JavaScript**. It uses the **minima** theme for Jekyll, which suggests it's designed to be hosted on GitHub Pages. The project is structured with separate files for styles, scripts, and data, indicating a modular approach to development.

## Building and Running

This is a static website, so there's no complex build process required.

*   **Running Locally:** To run the website, simply open the `.html` files (e.g., `index.html`, `formulario.html`) in a web browser.
*   **Hosting:** The project is likely hosted on GitHub Pages, as indicated by the presence of a `_config.yml` file and a `.github/workflows/static.yml` file.

## Development Conventions

*   **Configuration:** The main configuration is stored in `config.json`. This file controls the content of the main page and other dynamic parts of the site.
*   **Modularity:** The JavaScript code is organized into modules with specific functionalities (e.g., `navigation.js`, `poblarDatos.js`, `reportLoader.js`). This makes the code easier to maintain and understand.
*   **Data-Driven:** The website dynamically loads data from JSON files (e.g., `bodegas.json`, `departamentos.json`, `nacionalidades.json`) to populate forms and other elements. This separates the data from the presentation and makes it easier to update.
*   **Styling:** The project uses separate CSS files for different pages, promoting a clean and organized styling approach.
*   **External Libraries:** The project uses external libraries like `anime.js` for animations, `jspdf` for PDF generation, `SweetAlert2` for modals, and `Chart.js` for charts.
