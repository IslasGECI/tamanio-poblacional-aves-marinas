/**
 * Funciones que obtienen los datos desde el servidor
 */


/**
 * Obtiene una lista con las islas de las que se tienen datos
 */
function getIslands() {
    return new Promise(function (resolve, reject) {
        $.getJSON(`http://localhost:851/api-datos/islas`, islas => {
            resolve(islas);
        });
    });
}

/**
 * Obtiene una lista con las temporadas en las que se tienen datos
 */
function getSeasons() {
    return new Promise((resolve, reject) => {
        $.getJSON(`http://localhost:851/api-datos/temporadas`, islas => {
            resolve(islas);
        });
    });
}

/**
 * Obtiene una lista con las aves de las que se tienen datos
 */
function getBirds() {
    return new Promise((resolve, reject) => {
        $.getJSON(`http://localhost:851/api-datos/aves`, islas => {
            resolve(islas);
        });
    });
}