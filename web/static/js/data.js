function getIslands() {
    return new Promise(function (resolve, reject) {
        $.getJSON(`/islas`, islas => {
            resolve(islas);
        });
    });
}

function getSeasons() {
    return new Promise((resolve, reject) => {
        $.getJSON(`/temporadas`, islas => {
            resolve(islas);
        });
    });
}

function getBirds() {
    return new Promise((resolve, reject) => {
        $.getJSON(`/aves`, islas => {
            resolve(islas);
        });
    });
}
