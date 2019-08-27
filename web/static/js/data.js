/**
 * Funciones que obtienen los datos desde el servidor
 */


/**
 * Obtiene una lista con las islas de las que se tienen datos
 */
function getIslands() {
    return new Promise(function (resolve, reject) {
        $.getJSON(`/islas`, islas => {
            resolve(islas);
        });
    });
}

/**
 * Obtiene una lista con las temporadas en las que se tienen datos
 */
function getSeasons() {
    return new Promise((resolve, reject) => {
        $.getJSON(`/temporadas`, islas => {
            resolve(islas);
        });
    });
}

/**
 * Obtiene una lista con las aves de las que se tienen datos
 */
function getBirds() {
    return new Promise((resolve, reject) => {
        $.getJSON(`/aves`, islas => {
            resolve(islas);
        });
    });
}
