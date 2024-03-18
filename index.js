const config = require("./config.json");
const moment = require("moment");
const managerMongo = require('./src/common/managerMongo');

const openPhishProvider = require("./src/providers/openPhishProvider");
const phishTankProvider = require("./src/providers/phishTankProvider");
const urlScanProvider = require("./src/providers/urlScanProvider");

console.log(`ARRANCAR LANZADORES => ${moment().format("DD/MM/YYYY HH:mm:ss")}`);
managerMongo.connectBBDD();

let pendienteLanzar = [];
let inicial = {
  lanzando: undefined,
};

function ejecutarFuncion(item) {
  console.log("Lanzando => ", item);

  switch (item.source) {
    case "openphish":
      openPhishProvider().then(
        (result) => (observadorLanzando.lanzando = result)
      );
      break;
    case "phishtank":
      phishTankProvider().then(
        (result) => (observadorLanzando.lanzando = result)
      );
      break;
    case "urlscan":
      urlScanProvider(item.terminos).then(
        (result) => (observadorLanzando.lanzando = result)
      );
      break;
  }
}

// Función que se ejecutará cuando la variable cambie
function onChange(newValue) {
  console.log("La variable ha cambiado:", newValue);

  if (newValue) {
    ejecutarFuncion(newValue);
  } else {
    if (pendienteLanzar.length) {
      observadorLanzando.lanzando = pendienteLanzar.shift();
    }
  }
}

// Crear un Proxy para la variable
let observadorLanzando = new Proxy(inicial, {
  set: function (target, prop, value) {
    // Actualizar la variable
    target[prop] = value;
    // Llamar a la función de cambio cuando la variable cambie
    onChange(value);
    return true;
  },
});

config.providers.forEach((provider) => {
  if (provider.busquedas) {
    provider.busquedas.forEach((item) => {
      configurarIntervalos(provider, item);
    });
  } else {
    configurarIntervalos(provider, { delay: provider.delay });
  }
});

// Función para configurar los intervalos de tiempo para agregar elementos al array
function configurarIntervalos(provider, item) {
  setInterval(() => {
    let elemento = { source: provider.source };
    if (item.terminos) {
      elemento.terminos = item.terminos;
    }

    if (!pendienteLanzar.length && !observadorLanzando.lanzando) {
      observadorLanzando.lanzando = elemento;
    } else {
      pendienteLanzar.push(elemento);
    }
  }, item.delay);
}
