document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.getElementById("sidebar");
    const toggleButton = document.getElementById("toggleSidebar");
    const scriptsLink = document.getElementById("scriptsLink");
    const logsLink = document.getElementById("logsLink");
    const scriptsContent = document.getElementById("scriptsContent");
    const logsContent = document.getElementById("logsContent");
    const scriptList = document.querySelector(".script-list");
    const logTableBody = document.getElementById("logTableBody");
    const clearLogsButton = document.getElementById("clearLogs");

    if (!scriptList) {
        console.error("No se encontró el elemento '.script-list' en el DOM.");
    } else {
        scriptList.innerHTML = "";
    }

    // if (!sidebar || !toggleButton || !scriptsLink || !logsLink || !scriptsContent || !logsContent || !scriptList || !logTableBody || !clearLogsButton) {
    //     console.error("Uno o más elementos no se encontraron en el DOM.");
    //     return;
    // }

    // Alternar Sidebar
    toggleButton.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");
        toggleButton.innerHTML = sidebar.classList.contains("collapsed")
            ? '<i class="fa-solid fa-chevron-right"></i>'
            : '<i class="fa-solid fa-chevron-left"></i>';
    });

    //mostrar script al cargar la página
    scriptsContent.style.display = "block";
    logsContent.style.display = "none";

    //alternar entre scripts y logs
    scriptsLink.addEventListener("click", (event) => {
        event.preventDefault();
        scriptsContent.style.display = "block";
        logsContent.style.display = "none";
    });

    // Alterna visibilidad Logs
    logsLink.addEventListener("click", (event) => {
        event.preventDefault();
        logsContent.style.display = "block";
        scriptsContent.style.display = "none";
    });

    function loadScripts() {
        fetch("http://127.0.0.1:8000/get-scripts")
            .then(response => response.json())
            .then(scripts => {
                scriptList.innerHTML = ""; //limpiar lista
                scripts.scripts.forEach(script => {
                    const scriptItem = document.createElement("div")
                    scriptItem.classList.add("script-item");
                    scriptItem.innerHTML = `
                        <span>${script}</span>
                        <div class="buttons">
                            <button class="run-btn" data-script="${script}">
                                <i class="fa-solid fa-play"></i> Ejecutar
                            </button>
                        </div>
                    `;
                    scriptList.appendChild(scriptItem);
                });

                //agrega eventos a los botones
                document.querySelectorAll(".run-btn").forEach(button => {
                    button.addEventListener("click", (event) => {
                        const scriptName = event.target.closest(".run-btn").dataset.script;
                        executeScript(scriptName);
                    });
                });
            })
            .catch(error => console.error("Error cargando scripts:", error));
    }

    //ejecuta script seleccionado
    function executeScript(scriptName) {
        fetch(`http://127.0.0.1:8000/run-script/${scriptName}`, {method: "POST"})
            .then(response => response.json())
            .then(log => {
                addLog(log.id, log.nombre, log.estado, log.starTime, log.endTime, log.duration, log.file);
                setTimeout(loadLogsFromBackend, 12000); //carga logs después de 12s
            })
            .catch(error => console.error("Error ejecutando script:", error));
    }

    //agrega log a la tabla
    function addLog(id, nombre, estado, startTime, endTime, duration, file) {
        const row = document.createElement("tr");// Crear una fila para la tabla
        row.innerHTML = `
            <td>${id}</td>
            <td>${nombre}</td>
            <td class="${estado === "Completado" ? "table-success": "table-danger"}>${estado}</td>
            <td>${startTime}</td>
            <td>${endTime}</td>
            <td>${duration}</td>
            <td>
                <button class="btn btn-primary btn-sm download-btn" data-file="${file}">Descargar</button>
            </td>
        `;
        logTableBody.appendChild(row);

        //agrega evento de descarga
        row.querySelector(".download-btn").addEventListener("click", (event) => {
            event.preventDefault();
            const fileName = event.target.dataset.file;
            window.location.href = `http://127.0.0.1:8000/download-log/${fileName}`;
        });
    }

    //carga logs desde el backend
    function loadLogsFromBackend() {
        fetch("http://127.0.0.1:8000/get-logs")
            .then(response => response.json())
            .then(logs => {
                if (!Array.isArray(logs)) {
                    console.error("La respuesta de /get-logs no es un array:", logs)
                    return;
                }
                logs.forEach(log => {
                    addLog(log.id, log.nombre, log.estado, log.startTime, log.endTime, log.duration, log.file);
                })
            })
        .catch(error => console.error("Error loading logs:", error));
    }

    // Limpiar logs dessde la interfaz
    clearLogsButton.addEventListener("click", () => {
        fetch("http://127.0.0.1:8000/clear-logs", {method: "POST"})
            .then(response => response.json())
            .then(data => {
                console.log(data.message);
                logTableBody.innerHTML = "";
            })
            .catch(error => console.error("Error limpiando logs:", error));
    });

    //carga los logs al iniciar la página
    loadScripts();
    loadLogsFromBackend();
});