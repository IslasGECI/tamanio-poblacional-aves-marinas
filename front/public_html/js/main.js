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
    for (let especie of especies) {
        for (let isla of islas) {
            $("#bird-list").append(`
                <tr style="background-color: ${getRGBStringFromCode(
                    especie.Codigo
                )}">
                    <th>${isla.Nombre}</th>
                    <th>${especie.Nombre}</th>
                    <th id="maximo-nidos-especie-${especie.Codigo}-${isla.Nombre.replace(" ", "")}"> - </th>
                    <th id="lambda-especie-${especie.Codigo}-${isla.Nombre.replace(" ", "")}" style="background-color:black;color:orange">0.00</th>
                </tr>
            `);
            (async (isla)=>{
                let tablaHistorica = await getHistoric(especie.Codigo, isla.Nombre)
                let arregloTemporada = tablaHistorica.map(function(value,index) {return value.Temporada;});
                let arregloMaximoNidos = tablaHistorica.map(function(value,index) {return value.MaximoNidos;});
                let lambda = await getLambda(arregloTemporada, arregloMaximoNidos);
                let colorTexto = "orange";
                if (lambda.lambda != "nan") {
                    if (parseFloat(lambda.lambda) >= 1) {
                        colorTexto = "green";
                    }
                    if (parseFloat(lambda.lambda) > 0 && parseFloat(lambda.lambda) < 1) {
                        colorTexto = "yellow";
                    }
                    if (parseFloat(lambda.lambda) < 0) {
                        colorTexto = "red";
                    }
                    $(`#lambda-especie-${especie.Codigo}-${isla.Nombre.replace(" ", "")}`).text(lambda.lambda.toFixed(2));
                } else {
                    colorTexto = "white";
                    $(`#lambda-especie-${especie.Codigo}-${isla.Nombre.replace(" ", "")}`).text(lambda.lambda);
                }
                $(`#lambda-especie-${especie.Codigo}-${isla.Nombre.replace(" ", "")}`).css("color", colorTexto);
            })(isla)
        }
    }
    temporadaActual = temporadas[indiceTemporada];
    let centroMapa = {"lat": 27.577622, "lng":-111.454526};

    $("#temporada").text(temporadaActual);
    $("#scroll-temporada").attr("min", 1);
    $("#scroll-temporada").attr("max", temporadas.length);

    mapaGoogle = new google.maps.Map($("#map")[0], {
        zoom: 6,
        center: new google.maps.LatLng(centroMapa),
        mapTypeControl: false,
        streetViewControl: false,
        scaleControl: true,
        fullscreenControl: false,
        styles: estiloMapa
    });

    let overlay = new google.maps.OverlayView();
    overlay.onAdd = () => {
        addDrawFunction(overlay);
    };
    overlay.onRemove = () => { };
    overlay.setMap(mapaGoogle);

    $("#scroll-temporada").on("input", function () {
        indiceTemporada = this.value - 1;
        temporadaActual = temporadas[indiceTemporada];
        overlay.draw();
        $("#temporada").text(temporadaActual);
    });
});
