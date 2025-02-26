document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll('.card');

    if (cards.length === 0) {
        console.error("No se encontraron tarjetas en el DOM.");
        return;
    }

    cards.forEach((card) => {
        card.dataset.timeoutIds = JSON.stringify([]); // Almacena los IDs de setTimeout como un array vacío
        card.dataset.intervalIds = JSON.stringify([]); // Almacena los IDs de setInterval como un array vacío

        const runButton = card.querySelector('.run-btn');
        const stopButton = card.querySelector('.stop-btn');
        const scriptInput = card.querySelector('textarea'); // Selecciona cualquier textarea dentro de la tarjeta
        const output = card.querySelector('.output');

        // Verificar si todos los elementos existen en la tarjeta
        if (!runButton || !stopButton || !scriptInput || !output) {
            console.error("No se encontraron todos los elementos en la tarjeta:", card);
            return;
        }

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
            const scriptCode = scriptInput.value.trim();
            
            if (!scriptCode) {
                output.textContent = "Por favor, ingresa un script válido.";
                return;
            }

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