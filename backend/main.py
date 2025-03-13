from fastapi import FastAPI 
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware#para habilitar CORS
from scripts.contador import run_script #Importar la función del script
import os

app = FastAPI()

#Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],#permite solicitudes desde el front
    allow_methods=["GET","POST"],
    allow_headers=["*"],#encabezados permitidos
)

#almacenamiento en memoria
logs = []

@app.post("/run-script")
def execute_script():
    log = run_script(logs)  #ejecuta el script y obtiene los datos del log
    logs.append(log)    #guarda el log en la lista
    return log

@app.get("/get-logs")
def get_logs():
    return logs

@app.post("/clear-logs")
def clear_logs():
    logs.clear()    #limpia la lista de logs
    return {"message": "Logs cleared"}

# Ruta para descargar logs en .txt
@app.get("/download-log/{log_filename}")
def download_log(log_filename: str):
    filename = f"logs/{log_filename}"

    if os.path.exists(filename):
        return FileResponse(filename, media_type='text/plain', filename=log_filename)
    return {"error": "Archivo no encontrado"}

if __name__== "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=5000)