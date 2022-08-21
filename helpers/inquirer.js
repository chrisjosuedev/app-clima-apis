const colors = require("colors");
const inquirer = require("inquirer");

const preguntas = [
    {
        type: "list",
        name: "opcion",
        message: "¿Que desea hacer?",
        choices: [
            {
                value: 1,
                name: `${"1.".green} Buscar ciudad.`,
            },
            {
                value: 2,
                name: `${"2.".green} Historial.`,
            },
            {
                value: 0,
                name: `${"0.".red} Salir.`,
            },
        ],
    },
];

const inquirerMenu = async () => {
    console.clear();
    console.log("============================".green);
    console.log("  Seleccione una opcion".white);
    console.log("============================\n".green);

    const { opcion } = await inquirer.prompt(preguntas);

    return opcion;
};

const pause = async () => {
    const question = [
        {
            type: "input",
            name: "enter",
            message: `Presione ${"enter".green} para continuar.`,
        },
    ];

    console.log("\n");
    await inquirer.prompt(question);
};

const leerInput = async (message) => {
    const question = [
        {
            type: "input",
            name: "desc",
            message,
            validate(value) {
                if (value.length === 0) {
                    return "Por favor, ingrese un valor.";
                }
                return true;
            },
        },
    ];

    const { desc } = await inquirer.prompt(question);

    return desc;
};

const listarCiudades = async (ciudades = []) => {
    const choices = ciudades.map((ciudad, index) => {
        const idx = `${index + 1}.`.green
        return {
            value: ciudad.id,
            name: `${idx} ${ciudad.nombre}`
        };
    });

    choices.unshift({
        value: 0,
        name: "0.".green + " Cancelar.",
    });

    const preguntas = [
        {
            type: "list",
            name: "id",
            message: "Seleccione lugar: ",
            choices,
        },
    ];

    const { id } = await inquirer.prompt(preguntas);

    return id;
};

const confirmar = async (message) => {
    const pregunta = [
        {
            type: "confirm",
            name: "ok",
            message,
        },
    ];

    const { ok } = await inquirer.prompt(pregunta);

    return ok;
};

const mostrarListadoCheckList = async (tareas = []) => {
    const choices = tareas.map((tarea, index) => {
        return {
            value: tarea.id,
            name: `${colors.green(index + 1)}. ${tarea.desc}`,
            checked: (tarea.completadoEn) ? true:false,
        };
    });

    const pregunta = [
        {
            type: "checkbox",
            name: "ids",
            message: "Seleccione",
            choices,
        },
    ];

    const { ids } = await inquirer.prompt(pregunta);

    return ids;
};

module.exports = {
    inquirerMenu,
    pause,
    leerInput,
    listarCiudades,
    confirmar,
    mostrarListadoCheckList,
};
