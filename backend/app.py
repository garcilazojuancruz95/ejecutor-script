from flask import Flask, jsonify, request
from datetime import datetime
import time

app = Flask(__name__)

#Almacenamiento en memoria (puedes usar una base de datos en un proyecto real)
logs = []

@app.route("/run-script", methods=["POST"])
def run_script():
    start_time = datetime.now()
    time.sleep(10)
    end_time = datetime.now()
    duration = (end_time - start_time).total_seconds()
    
    log = {
        "startTime": start_time.strftime("%H:%M:%S"),
        "endTime": end_time.strftime("%H:%M:%S"),
        "duration": f"{duration: .2f} segundos",
    }

    logs.append(log)
    return jsonify(log)

@app.route("/get-logs", methods=["GET"])
def get_logs():
    return jsonify(logs)

@app.route("/clear-logs", methods=["POST"])
def clear_logs():
    logs.clear()
    return jsonify({"message": "Logs cleared"})

if __name__ == "__main__":
    app.run(debug=True)