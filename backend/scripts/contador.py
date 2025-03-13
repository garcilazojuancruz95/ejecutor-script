import time
import os
from datetime import datetime

def run_script(logs):
    start_time = datetime.now()
    log_dir = "logs"

    if not os.path.exists(log_dir):
        os.makedirs(log_dir)

    log_id = len(logs) + 1
    
    timestamp = start_time.strftime("%d-%m-%y_%H-%M")
    filename = f"{log_dir}/log_{log_id}_{timestamp}.txt"

    log_data = {
        "id": log_id,
        "nombre": "contador-script",
        "estado": "Completado",
        "startTime": start_time.strftime("%H:%M:%S"),
        "endTime": None,
        "duration": None,
        "file": filename
    }

    with open(filename, "w") as file:
        file.write("Iniciando script...\n")
        print("Iniciando script...")

        #Simular el contador de 10 seg
        for i in range(1, 11):
            output = f"Contador: {i}\n"
            print(output.strip())   #muestra en consola
            file.write(output) #guarda en el archivo
            time.sleep(1)

        end_time = datetime.now()
        duration = (end_time - start_time).total_seconds()

        log_data["endTime"] = end_time.strftime("%H:%M:%S")
        log_data["duration"] = f"{duration:.2f} segundos"


        file.write(f"Finalizando script...\n")
        file.write(f"Hora de inicio: {log_data['startTime']}\n")
        file.write(f"Hora de finalización: {log_data['endTime']}\n")
        file.write(f"Duración: {log_data['duration']}\n")

    return log_data