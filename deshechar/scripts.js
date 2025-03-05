document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll('.card');

    if (cards.length === 0) {
        console.error("No se encontraron tarjetas en el DOM.");
        return;
    }

    // Scripts predefinidos para cada tarjeta
    const predefinedScripts = [
        `setInterval(() => { console.log("Ejecutando Script 1"); }, 1000);`,
        `let count = 0; setInterval(() => { console.log("Contador:", count++); }, 1000);`,
        `setTimeout(() => { alert("¡Hola! Este es el Script 3 ejecutado después de 3 segundos."); }, 3000);`
    ];

    cards.forEach((card, index) => {
        card.dataset.timeoutIds = JSON.stringify([]); // Almacena los IDs de setTimeout como un array vacío
        card.dataset.intervalIds = JSON.stringify([]); // Almacena los IDs de setInterval como un array vacío

        const runButton = card.querySelector('.run-btn');
        const stopButton = card.querySelector('.stop-btn');
        const output = card.querySelector('.output');

        // Verificar si todos los elementos existen en la tarjeta
        if (!runButton || !stopButton || !output) {
            console.error("No se encontraron todos los elementos en la tarjeta:", card);
            return;
        }

        // Obtener el script predefinido correspondiente
        const scriptCode = predefinedScripts[index] || `console.log("No hay script definido para esta tarjeta.");`;

        // Función segura para ejecutar scripts
        const safeExecute = (code, card) => {
            try {
                let timeoutIds = [];
                let intervalIds = [];

                // Redefinir setTimeout y setInterval para capturar sus IDs y poder detenerlos
                const safeSetTimeout = (fn, delay) => {
                    const id = setTimeout(fn, delay);
                    timeoutIds.push(id);
                    return id;
                };

                const safeSetInterval = (fn, interval) => {
                    const id = setInterval(fn, interval);
                    intervalIds.push(id);
                    return id;
                };

                // Crear un nuevo contexto de ejecución seguro
                const scriptFunction = new Function('setTimeout', 'setInterval', code);

                // Ejecutar el código dentro de un contexto controlado
                scriptFunction(safeSetTimeout, safeSetInterval);

                // Guardar los IDs en el dataset de la tarjeta
                card.dataset.timeoutIds = JSON.stringify(timeoutIds);
                card.dataset.intervalIds = JSON.stringify(intervalIds);

                output.textContent = "Script ejecutado correctamente.";
            } catch (error) {
                output.textContent = `Error: ${error.message}`;
            }
        };

        // Ejecutar el script al hacer clic en "Ejecutar"
        runButton.addEventListener('click', () => {
            output.textContent = "Ejecutando...";
            safeExecute(scriptCode, card);
        });

        // Detener la ejecución del script
        stopButton.addEventListener('click', () => {
            let timeoutIds = JSON.parse(card.dataset.timeoutIds);
            let intervalIds = JSON.parse(card.dataset.intervalIds);

            // Cancelar todos los setTimeout y setInterval en ejecución
            timeoutIds.forEach(clearTimeout);
            intervalIds.forEach(clearInterval);

            // Limpiar los arrays en el dataset
            card.dataset.timeoutIds = JSON.stringify([]);
            card.dataset.intervalIds = JSON.stringify([]);

            output.textContent = "Ejecución detenida.";
        });
    });
});