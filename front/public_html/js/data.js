/**
 * Funciones que obtienen los datos desde el servidor
 */

var apiDatosUrl = "http://islasgeci.org:8510/api-datos/";
var apiLambdasUrl = "http://islasgeci.org:8520/api-lambdas/";


/**
 * Obtiene una lista con las islas de las que se tienen datos
 */
function getIslands() {
    return new Promise(function (resolve, reject) {
        getDataFromEntryPoint(`${apiDatosUrl}islas`, resolve);
    });
}

/**
 * Obtiene una lista con las temporadas en las que se tienen datos
 */
function getSeasons() {
    return new Promise((resolve, reject) => {
        getDataFromEntryPoint(`${apiDatosUrl}temporadas`, resolve);
    });
}

/**
 * Obtiene una lista con las aves de las que se tienen datos
 */
function getBirds() {
    return new Promise((resolve, reject) => {
        getDataFromEntryPoint(`${apiDatosUrl}aves`, resolve);
    });
}

/**
 * Obtiene una lista con las aves de las que se tienen datos
 */
function getHistoric(idAve, idIsla) {
    return new Promise((resolve, reject) => {
        getDataFromEntryPoint(`${apiDatosUrl}historicos/${idAve}/${idIsla}`, resolve);
    });
}

function getLambda(temporadas, maximoNidos) {
    return new Promise((resolve, reject) => {
        getDataFromEntryPoint(`${apiLambdasUrl}lambda?temporadas=[${temporadas}]&maximo_nidos=[${maximoNidos}]`, resolve);
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
