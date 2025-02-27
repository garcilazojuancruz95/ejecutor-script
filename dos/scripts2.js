document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.getElementById("sidebar");
    const toggleButton = document.getElementById("toggleSidebar");
    const scriptsLink = document.getElementById("scriptsLink");
    const scriptsContent = document.getElementById("scriptsContent");
    
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
    
    // Toggle sidebar al hacer clic en el botón
    toggleButton.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");

        if (sidebar.classList.contains("collapsed")) {
            toggleButton.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
            localStorage.setItem("sidebarState", "expanded"); //Guarda estado
        } else {
            toggleButton.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
            localStorage.setItem("sidebarState", "collapsed"); //Guarda estado contraído
        }
    });
    
    // Mostrar contenido de Script al hacer clic
    scriptsLink.addEventListener("click", (event) => {
        event.preventDefault(); //Evita recargar la página
        
        if(scriptsContent.style.display === "none" || scriptsContent.style.display === "") {
            scriptsContent.style.display = "block" // Muestra los scripts
        } else {
            scriptsContent.style.display = "none" // Oculta los scripts si ya están visibles
        }
        
    });
});
    