/**
 * Funciones que obtienen los datos desde el servidor
 */


/**
 * Obtiene una lista con las islas de las que se tienen datos
 */
function getIslands() {
    return new Promise(function (resolve, reject) {
        getDataFromEntryPoint("/islas", resolve);
    });
}

/**
 * Obtiene una lista con las temporadas en las que se tienen datos
 */
function getSeasons() {
    return new Promise((resolve, reject) => {
        getDataFromEntryPoint("/temporadas", resolve);
    });
}

/**
 * Obtiene una lista con las aves de las que se tienen datos
 */
function getBirds() {
    return new Promise((resolve, reject) => {
        getDataFromEntryPoint("/aves", resolve);
    });
}

/**
 * Obtiene datos desde una api, esta pensada para usarse dentro de una Promise
 * @param {*} url dirección de donde se van a jalar los datos
 * @param {*} resolve función encargada de regresar un valor de la tarea asíncrona
 */
function getDataFromEntryPoint(url, resolve) {
    $.getJSON(url, datos => {
        resolve(datos);
    });
}
