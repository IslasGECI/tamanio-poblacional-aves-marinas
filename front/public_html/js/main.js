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
