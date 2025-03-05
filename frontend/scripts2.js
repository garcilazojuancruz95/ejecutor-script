document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.getElementById("sidebar");
    const toggleButton = document.getElementById("toggleSidebar");
    const scriptsLink = document.getElementById("scriptsLink");
    const logsLink = document.getElementById("logsLink");
    const scriptsContent = document.getElementById("scriptsContent");
    const logsContent = document.getElementById("logsContent");

    let intervalId = null; // Para evitar múltiples ejecuciones

    // Alternar Sidebar
    toggleButton.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");
        toggleButton.innerHTML = sidebar.classList.contains("collapsed")
            ? '<i class="fa-solid fa-chevron-right"></i>'
            : '<i class="fa-solid fa-chevron-left"></i>';
    });

    // Mostrar contenido de Script al hacer clic
    scriptsLink.addEventListener("click", (event) => {
        event.preventDefault(); // Evita recargar la página
        // Si está oculto, lo muestra y oculta Logs
        if (scriptsContent.style.display === "none" || scriptsContent.style.display === "") {
            scriptsContent.style.display = "block"; // Muestra los scripts
            logsContent.style.display = "none"; // Ocultar Logs
        } else {
            scriptsContent.style.display = "none"; // Oculta los scripts si ya están visibles
        }
    });

    // Verifica en el localStorage si la sidebar estaba contraída
    let isExpanded = localStorage.getItem("sidebarState") === "expanded";

    // Aplica la clase según el estado
    if (!isExpanded) {
        sidebar.classList.add("collapsed");
        toggleButton.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
    } else {
        sidebar.classList.remove("collapsed");
        toggleButton.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
    }

    // Alterna visibilidad Logs
    logsLink.addEventListener("click", (event) => {
        event.preventDefault();

        // Si está oculto, lo muestra y oculta Scripts
        if (logsContent.style.display === "none" || logsContent.style.display === "") {
            logsContent.style.display = "block";
            scriptsContent.style.display = "none"; // Ocultar Scripts
        } else {
            logsContent.style.display = "none";
        }
    });

    // Botón para limpiar logs
    const clearLogsButton = document.getElementById("clearLogs");
    clearLogsButton.addEventListener("click", () => {
        // Limpiar la tabla
        const logTableBody = document.getElementById("logTableBody");
        logTableBody.innerHTML = "";

        // Limpiar localStorage
        localStorage.removeItem("logs");
    });


    //Boton para ejecutar el script
    const firstRunButton = document.querySelector(".script-item .run-btn");
    firstRunButton.addEventListener("click", () => {
        fetch("http://127.0.0.1:5000/run-script", {method: "POST"})
            .then(response => response.json())
            .then(log => {
                addLog(log.startTime, log.endTime, log.duration);
            })
            .catch(error => console.error("Error running script:", error));
    });

    // Función para agregar un log a la tabla y guardarlo en localStorage
    function addLog(id, nombre, estado, startTime, endTime, duration) {
        
        const logTableBody = document.getElementById("logTableBody");
        const row = document.createElement("tr");// Crear una fila para la tabla

        // Crear celdas para cada valor
        const idCell = document.createElement("td");
        idCell.textContent = id;
        
        const nombreCell = document.createElement("td");
        nombreCell.textContent = nombre;
        
        const estadoCell = document.createElement("td");
        estadoCell.textContent = estado;

        const startCell = document.createElement("td");
        startCell.textContent = startTime;

        const endCell = document.createElement("td");
        endCell.textContent = endTime;

        const durationCell = document.createElement("td");
        durationCell.textContent = `${duration} segundos`;

        // Agregar celdas a la fila
        row.appendChild(idCell);
        row.appendChild(nombreCell);
        row.appendChild(estadoCell);
        row.appendChild(startCell);
        row.appendChild(endCell);
        row.appendChild(durationCell);

        // Agregar fila a la tabla
        logTableBody.appendChild(row);

        // Guardar el log en localStorage
        // saveLogToLocalStorage({ startTime, endTime, duration });
    }

    // Función para guardar un log en localStorage
    // function saveLogToLocalStorage(log) {
    //     // Obtener los logs existentes (si hay)
    //     const logs = JSON.parse(localStorage.getItem("logs")) || [];

    //     // Verificar si el log ya existe para evitar duplicados
    //     const logExists = logs.some(
    //         (existingLog) =>
    //             existingLog.startTime === log.startTime &&
    //             existingLog.endTime === log.endTime &&
    //             existingLog.duration === log.duration
    //     );

    //     // Si el log no existe, agregarlo
    //     if (!logExists) {
    //         logs.push(log);
    //         localStorage.setItem("logs", JSON.stringify(logs));
    //     }
    // }

    // Función para cargar los logs desde localStorage al cargar la página
    // function loadLogsFromLocalStorage() {
    //     const logs = JSON.parse(localStorage.getItem("logs")) || [];

    //     // Limpiar la tabla antes de cargar los logs
    //     const logTableBody = document.getElementById("logTableBody");
    //     logTableBody.innerHTML = "";

    //     // Recorrer los logs y agregarlos a la tabla
    //     logs.forEach(log => {
    //         addLog(log.startTime, log.endTime, log.duration);
    //     });
    // }

    // // Cargar los logs al iniciar la página
    // loadLogsFromLocalStorage();

    function loadLogsFromBackend() {
        fetch("http://127.0.0.1:5000/get-logs")
            .then(response => response.json())
            .then(logs => {
                const logTableBody = document.getElementById("logTableBody");
                logTableBody.innerHTML = ""; //limpia la tabla
                logs.forEach(log => {
                    addLog(log.id, log.nombre, log.estado, log.startTime, log.endTime, log.duration);
                });
            })
        .catch(error => console.error("Error loading logs:", error));
    }

    //carga los logs al iniciar la página
    loadLogsFromBackend();
});