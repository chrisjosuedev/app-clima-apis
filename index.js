colors = require("colors");
const {
    inquirerMenu,
    pause,
    leerInput,
    listarCiudades,
} = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

const main = async () => {
    console.clear();

    const busquedas = new Busquedas();
    let opt;

    do {
        opt = await inquirerMenu();
        switch (opt) {
            case 1:
                const lugar = await leerInput("Ciudad: ");
                const ciudades = await busquedas.ciudad(lugar);

                // Listar Ciudades
                const id = await listarCiudades(ciudades);

                if (id === 0) continue;

                const { nombre, lat, lng } = ciudades.find(
                    (item) => item.id === id
                );

                // Guardar en DB
                busquedas.agregarHistorial(nombre)

                // Clima
                const { desc, min, max, temp } = await busquedas.climaLugar(
                    lat,
                    lng
                );

                // Resultados
                console.clear();
                console.log("\nInformacion de la ciudad\n".green);
                console.log("Ciudad:", nombre.green);
                console.log("Lat:", lat);
                console.log("Lng:", lng);
                console.log("Temperatura:", temp, "°C");
                console.log("Minima", min);
                console.log("Maxima", max);
                console.log("Como esta el clima:", desc);

                break;
            case 2:
                busquedas.historialCapitalizado.forEach((item, index) => {
                    const idx = `${index + 1}.`.green
                    console.log(`${idx} ${item} `)
                })
                break;
        }

        if (opt !== 0) await pause();
    } while (opt !== 0);
};

main();
