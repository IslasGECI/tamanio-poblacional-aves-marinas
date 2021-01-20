/**
 * TODO: Refactorizar para quitar variables globales
 * 
 * Variables globales utilizadas por la aplicación
 */
var capa = null;
var indiceTemporada = 0;
var temporadaActual = null;
var mapaGoogle = null;
var circulos = new Array();

/**
 * Agrega handlers y obtiene valores iniciales de la aplicación
 */
d3.select(window).on("load", async () => {
    let temporadas = await getSeasons();
    let especies = await getBirds();
    let islas = await getIslands();
    temporadaActual = temporadas[indiceTemporada];
    const centroMapa = { "lat": 27.577622, "lng": -111.454526 };

    $("#temporada").text(temporadaActual);
    $("#scroll-temporada").attr("min", 1);
    $("#scroll-temporada").attr("max", temporadas.length);

    const rangerWrap = document.querySelector(".range-wrap");
    const bubble = rangerWrap.querySelector(".bubble");

    setSeason(bubble, temporadaActual)

    mapaGoogle = new google.maps.Map($("#map")[0], {
        zoom: 6,
        center: new google.maps.LatLng(centroMapa),
        mapTypeControl: false,
        streetViewControl: false,
        scaleControl: true,
        fullscreenControl: false,
        styles: estiloMapa,
        zoomControlOptions: {
            position: google.maps.ControlPosition.LEFT_TOP
        },
    });

    let overlay = new google.maps.OverlayView();
    overlay.onAdd = () => {
        addDrawFunction(overlay);
    };
    overlay.onRemove = () => { };
    overlay.setMap(mapaGoogle);

    drawTable(especies, islas, overlay);

    $("#scroll-temporada").on("input", function () {
        indiceTemporada = this.value - 1;
        temporadaActual = temporadas[indiceTemporada];
        cleanTable(especies, islas);
        overlay.draw();
        $("#temporada").text(temporadaActual);
        setSeason(bubble, temporadaActual)
    });
});

function setSeason(bubble, selectedSeason) {
    bubble.innerHTML = `<p id='temporada'>${selectedSeason}</p>`;
}

function cleanTable(especies, islas) {
    for (let especie of especies) {
        for (let isla of islas) {
            $(`#maximo-nidos-especie-${especie.Codigo}-${isla.Nombre.replace(" ", "")}`).text(" - ");
        }
    }
}

async function drawTable(especies, islas, overlay) {
    for (let especie of especies) {
        for (let isla of islas) {
            let tablaHistorica = await getHistoric(especie.Codigo, isla.Nombre);
            let existeAveEnIsla = tablaHistorica !== null;
            if (existeAveEnIsla) {
                let arregloTemporada = tablaHistorica.map(function (value, index) { return value.Temporada; });
                let arregloMaximoNidos = tablaHistorica.map(function (value, index) { return value.MaximoNidos; });
                let lambda = await getLambda(arregloTemporada, arregloMaximoNidos);
                lambda = lambda["lambda"];
                $("#bird-list").append(`
                    <tr style="background-color: ${getRGBStringFromCode(
                        especie.Codigo
                    )}">
                        <th>${isla.Nombre}</th>
                        <th>${especie.Nombre}</th>
                        <th id="maximo-nidos-especie-${especie.Codigo}-${isla.Nombre.replace(" ", "")}" style="text-align: right;"> - </th>
                        <th style="background-color:black;color:${getLambdaColor(lambda)}">${lambda === "nan" ? lambda : lambda.toFixed(2)}</th>
                    </tr>
                `);
            }
        }
    }
    overlay.draw();
}

function getLambdaColor(lambda) {
    if (lambda === "nan") {
        return "white";
        }
    if (parseFloat(lambda) > 1.2) {
        return "green";
    }
    if (0.8 <= parseFloat(lambda) && parseFloat(lambda) <= 1.2) {
        return "yellow";
    }
    if (parseFloat(lambda) < 0.8) {
        return "red";
    }
}
