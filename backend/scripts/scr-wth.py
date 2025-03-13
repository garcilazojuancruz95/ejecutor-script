import requests
import gspread
from google.oauth2.service_account import Credentials
from datetime import datetime
import os

#configuración
API_KEY = "8f596bb85fea1713d67980957de1b612"
BASE_URL = "http://api.openweathermap.org/data/2.5/weather"
CITY = "Rosario"



#parametros
params = {
    "q": CITY,
    "appid": API_KEY,
    "units": "metric",
    "lang": "es"
}

#conf de google sheets
CREDS_FILE = "backend/config/credenciales.json"
SCOPE = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]
SHEET_NAME = "Clima Datos"

def authenticate_google_sheets():
    try:
        creds = Credentials.from_service_account_file(CREDS_FILE, scopes=SCOPE)
        client = gspread.authorize(creds)
        print("Autenticación axitosa con Google Sheets.")
        return client
    except Exception as e:
        print(f"Error de autenticación: {e}")
        return None

def get_weather():
    try:
        print("Solicitando datos del clima")
        response = requests.get(BASE_URL, params=params)
        response.raise_for_status()

        data = response.json()
        temperatura = data["main"]["temp"]
        humedad = data["main"]["humidity"]
        descripcion = data["weather"][0]["description"]
        latitud = data["coord"]["lat"]
        longitud = data["coord"]["lon"]
        fecha_hora = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        print("Datos obtenidos correctamente.")
        return fecha_hora, CITY, latitud, longitud, temperatura, humedad, descripcion
    
    except requests.exceptions.RequestException as e:
        print(f"Error al obtener el clima: {e}")
        return None

def save_to_google_sheets(data):
    "Guarda los datos en Google Sheets"
    client = authenticate_google_sheets()
    if not client:
        print("No se pudo autenticar con Google Sheets. Verificar las credenciales.")
        return

    try:
        print(f"Abriendo hoja: {SHEET_NAME}")
        sheet = client.open(SHEET_NAME).sheet1
        
        print("Guardando datos en Google Sheets...")
        sheet.append_row(data)

        print("Datos guardados correctamente en Google Sheets.")

    except Exception as e:
        print(f"Error al guardar en Google Sheets: {e}")
        return

def main():
    "Función principal para obtener y guardar datos"
    weather_data = get_weather()
    if weather_data:
        save_to_google_sheets(weather_data)

if __name__ == "__main__":
    main()