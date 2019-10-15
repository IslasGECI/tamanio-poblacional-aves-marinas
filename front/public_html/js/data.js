/**
 * Funciones que obtienen los datos desde el servidor
 */


/**
 * Obtiene una lista con las islas de las que se tienen datos
 */
function getIslands() {
    return new Promise(function (resolve, reject) {
        getDataFromEntryPoint("http://islasgeci.org:851/api-datos/islas", resolve);
    });
}

/**
 * Obtiene una lista con las temporadas en las que se tienen datos
 */
function getSeasons() {
    return new Promise((resolve, reject) => {
        getDataFromEntryPoint("http://islasgeci.org:851/api-datos/temporadas", resolve);
    });
}

/**
 * Obtiene una lista con las aves de las que se tienen datos
 */
function getBirds() {
    return new Promise((resolve, reject) => {
        getDataFromEntryPoint("http://islasgeci.org:851/api-datos/aves", resolve);
    });
}

/**
 * Obtiene una lista con las aves de las que se tienen datos
 */
function getHistoric(idAve, idIsla) {
    return new Promise((resolve, reject) => {
        getDataFromEntryPoint(`http://islasgeci.org:851/api-datos/historicos/${idAve}/${idIsla}`, resolve);
    });
}

function getLambda(temporadas, maximoNidos) {
    return new Promise((resolve, reject) => {
        getDataFromEntryPoint(`http://islasgeci.org:852/api-lambdas/lambda?temporadas=[${temporadas}]&maximo_nidos=[${maximoNidos}]`, resolve);
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
