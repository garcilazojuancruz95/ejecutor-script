import time
from datetime import datetime

def run_script(logs):
    start_time = datetime.now()
    print("Iniciando script...")

    #Simular el contador de 10 seg
    for i in range(1, 11):
        print(f"Contador: {i}")
        time.sleep(1)

    end_time = datetime.now()
    duration = (end_time - start_time).total_seconds()

    #Devolver los datos del log
    return{
        "id": len(logs) + 1, #ID autoincremental
        "nombre": "contador-script",
        "estado": "Completado",
        "startTime": start_time.strftime("%H:%M:%S"),
        "endTime": end_time.strftime("%H:%M:%S"),
        "duration": f"{duration: .2f} segundos",
    }