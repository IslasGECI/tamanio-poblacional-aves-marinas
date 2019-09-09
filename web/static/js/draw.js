/**
 * Funciones encargadas de dibujar sobre el mapa.
 */

/**
 * Función para dibujar los círculos sobre el mapa.
 * @param {*} mapLayer Capa donde se dibujarán los círculos.
 */
function addDrawFunction(mapLayer) {
    d3.json("/tamanio", function (censos) {
        if (capa == null) {
            capa = d3
                .select(mapLayer.getPanes().overlayLayer)
                .append("div")
                .attr("id", "capa-circulos");
        } else {
            capa = d3.select("#capa-circulos");
        }
        mapLayer.draw = function () {
            for (let circulo of circulos) {
                circulo.setMap(null);
            }
            circulos = new Array();
            $("#bird-list").empty();

            let censosFiltrados = censos.filter(elemento => {
                return elemento.Temporada == temporadaActual;
            });

            censosFiltrados = censosFiltrados.sort(compareNestCount);

            for (let censo of censosFiltrados) {
                let circulo = new google.maps.Polygon({
                    paths: createCircleForGoogleMaps(Math.log(censo.MaximoNidos) * 10000, [
                        censo.Longitud,
                        censo.Latitud
                    ]),
                    strokeWeight: 0,
                    fillColor: getRGBStringFromCode(censo.Codigo),
                    fillOpacity: 0.35
                });
                circulo.setMap(mapaGoogle);
                circulos.push(circulo);

                $("#bird-list").append(`
                <tr style="background-color: ${getRGBStringFromCode(
                    censo.Codigo
                )}">
                    <th>${censo.NombreIsla}</th>
                    <th>${censo.NombreEspecie}</th>
                    <th>${censo.MaximoNidos}</th>
                </tr>
              `);
            }
        };
    });
}

/**
 * Función para ordenar lista de mayor a menor cantidad de nidos
 * @param {*} element1 primer elemento a comparar
 * @param {*} element2 segundo elemento a comparar
 */
function compareNestCount(element1, element2) {
    if (element1.MaximoNidos < element2.MaximoNidos) {
        return 1;
    }
    if (element1.MaximoNidos > element2.MaximoNidos) {
        return -1;
    }
    return 0;
}
