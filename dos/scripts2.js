document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.getElementById("sidebar");
    const toggleButton = document.getElementById("toggleSidebar");
    const scriptsLink = document.getElementById("scriptsLink");
    const logsLink = document.getElementById("logsLink");
    const scriptsContent = document.getElementById("scriptsContent");
    const logsContent = document.getElementById("logsContent");
    const logList = document.getElementById("logList");

    let intervalId = null; //Para evitar múltiples ejecuciones

    // Alternar Sidebar
    toggleButton.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");
        toggleButton.innerHTML = sidebar.classList.contains("collapsed")
            ? '<i class="fa-solid fa-chevron-right"></i>'
            : '<i class="fa-solid fa-chevron-left"></i>';
    });
    
    // Mostrar contenido de Script al hacer clic
    scriptsLink.addEventListener("click", (event) => {
        event.preventDefault(); //Evita recargar la página
        // Si está oculto, lo muestra y oculta Logs
        if(scriptsContent.style.display === "none" || scriptsContent.style.display === "") {
            scriptsContent.style.display = "block" // Muestra los scripts
            logsContent.style.display = "none"; // Ocultar Logs
        } else {
            scriptsContent.style.display = "none" // Oculta los scripts si ya están visibles
        }
    });

    // Verifica en el localStorage si la sidebar estaba contraída
    let isExpanded = localStorage.getItem("sidebarState") === "expanded";

    // Aplica la clase segun el estado
    if (!isExpanded) {
        sidebar.classList.add("collapsed");
        toggleButton.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
    } else {
        sidebar.classList.remove("collapsed");
        toggleButton.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
    }

    //Alterna visibilidad Logs
    logsLink.addEventListener("click", (event) => {
        event.preventDefault();

        //Si está oculto, lo muestra y oculta Scripts
        if (logsContent.style.display === "none" || logsContent.style.display === "") {
            logsContent.style.display = "block";
            scriptsContent.style.display = "none"; // Ocultar Scripts
        } else {
            logsContent.style.display = "none";
        }
    });

    const firstRunButton = document.querySelector(".script-item .run-btn");

    firstRunButton.addEventListener("click", () => {
        if (intervalId !== null) {
            console.warn("El script ya está ejecutándose...")
            return;
        }

        const startTime = new Date();
        console.log("Iniciando controlador...");
        addLog(`Script iniciando a las ${startTime.toLocaleTimeString()}`)

        let count = 1;
        intervalId = setInterval(() => {
            console.log(`Contador: ${count}`);
            addLog(`Contador: ${count}`)

            if (count === 10) {
                const endTime = new Date();
                const duration = ((endTime - startTime) / 1000).toFixed(2);

                addLog(`Script finalizado a las ${endTime.toLocaleTimeString()}`);
                addLog(`Duración total: ${duration} segundos`);

                clearInterval(intervalId); // Detiene el script
                intervalId = null;
            }
            count++;
        }, 1000) //Ejecuta cada 1 segundo
    });

    function addLog(message) {
        const logItem = document.createElement("li");
        logItem.classList.add("list-group-item");
        logItem.textContent = message;
        logList.appendChild(logItem);
    }
});
    