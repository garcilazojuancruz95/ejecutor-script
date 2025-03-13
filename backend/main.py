from fastapi import FastAPI 
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware #para habilitar CORS
import os
import subprocess

app = FastAPI()

#Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],#permite todas las conexiones
    allow_credentials = True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SCRIPTS_FOLDER = os.path.join(BASE_DIR, "scripts")

def get_scripts():
    """Devuelve una lista de scripts disponibles en la carpeta scripts"""
    if not os.path.exists(SCRIPTS_FOLDER):
        os.makedirs(SCRIPTS_FOLDER)
        return []
    
    return [
        f.replace(".py", "") for f in os.listdir(SCRIPTS_FOLDER)
        if f.endswith(".py") and f != "__init__.py"
    ]

@app.get("/get-scripts")
def list_scripts():
    """API para obtener los scripts disponibles"""
    scripts = get_scripts()
    return {"scripts": scripts}

@app.post("/run-script/{script_name}")
def execute_script(script_name: str):
    """Ejecuta un script en la carpeta scripts/"""
    script_path = os.path.join(SCRIPTS_FOLDER, f"{script_name}.py")

    if not os.path.exists(script_path):
        return {"error": "Script no encontrado"}
    
    try:
        #ejecutar el script en un subproceso
        result = subprocess.run(["python", script_path], capture_output=True, text=True)
        output = result.stdout
        error_output = result.stderr

        if result.returncode == 0:
            return {"message": f"Script {script_name} ejecutando correctamente", "output": output}
        else:
            return {"message": f"Error ejecutando {script_name}", "error": error_output}
        
    except Exception as e:
        return {"error": str(e)}
    


#almacenamiento en memoria
logs = []

@app.get("/get-logs")
def get_logs():
    """Devuelve los logs almacenados en memoria"""
    return logs

@app.post("/clear-logs")
def clear_logs():
    logs.clear()
    return {"message": "Logs cleared"}

# Ruta para descargar logs en .txt
@app.get("/download-log/{log_filename}")
def download_log(log_filename: str):
    """Descarga un archivo de logs"""
    filename = f"backend/logs/{log_filename}"

    if os.path.exists(filename):
        return FileResponse(filename, media_type='text/plain', filename=log_filename)
    return {"error": "Archivo no encontrado"}

if __name__== "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=5000)