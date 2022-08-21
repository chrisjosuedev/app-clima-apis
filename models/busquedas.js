const fs = require("fs");

const axios = require("axios").default;
require("dotenv").config();

class Busquedas {
    historial = [];
    dbPath = "./db/database.json";

    constructor() {
        // Leer DB si Existe
        this.leerDB();
    }

    get historialCapitalizado() {
        // Capitalizar cada Palabra en un array
        return this.historial.map((ciudad) => {
            let capCiudad = ciudad.split(" ");
            capCiudad = capCiudad
                .map(
                    (indCiudad) =>
                        indCiudad.charAt(0).toUpperCase() +
                        indCiudad.substring(1)
                )
                .join(" ");
            return capCiudad;
        });
    }

    getParamsMapBox() {
        return {
            access_token: process.env.MAPBOX_KEY,
            limit: 5,
            language: "es",
        };
    }

    getParamsOpenWealth(lat, lon) {
        return {
            lat: lat,
            lon: lon,
            appid: process.env.OPEN_WEATHER_KEY,
            lang: "es",
            units: "metric",
        };
    }

    async ciudad(ciudad) {
        try {
            // Peticion Http

            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ciudad}.json`,
                params: this.getParamsMapBox(),
            });

            const resp = await instance.get();

            // ({}) Regresar Objeto Implicitamente
            return resp.data.features.map((ciudad) => ({
                id: ciudad.id,
                nombre: ciudad.place_name,
                lng: ciudad.center[0],
                lat: ciudad.center[1],
            }));
        } catch (err) {
            console.log(err);
            return [];
        }
    }

    async climaLugar(lat, lon) {
        try {
            // Peticion
            const instance = axios.create({
                baseURL: "https://api.openweathermap.org/data/2.5/weather",
                params: this.getParamsOpenWealth(lat, lon),
            });

            const resp = await instance.get();

            const { weather, main } = resp.data;

            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp,
            };
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    agregarHistorial(lugar) {
        // Prevenir Duplicados, Verificar si existe en Array
        if (this.historial.includes(lugar.toLocaleLowerCase())) {
            return;
        }

        this.historial.unshift(lugar.toLocaleLowerCase());

        // Guardar
        this.guardarDB();
    }

    guardarDB() {
        const payload = {
            historial: this.historial,
        };

        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    leerDB() {
        if (!fs.existsSync(this.dbPath)) {
            return null;
        }

        const info = fs.readFileSync(this.dbPath, { encoding: "utf-8" });

        const data = JSON.parse(info);

        this.historial = data.historial;
    }
}

module.exports = Busquedas;
