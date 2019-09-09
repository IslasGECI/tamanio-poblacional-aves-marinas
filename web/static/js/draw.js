/**
 * Funciones encargadas de dibujar sobre el mapa.
 */

/**
 * Función para dibujar los círculos sobre el mapa.
 * @param {*} mapLayer Capa donde se dibujarán los círculos.
 */
function addDrawFunction(mapLayer) {
    d3.json("/tamanio", function (islas) {
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

            islasFiltradas = islas.filter(elemento => {
                return elemento.Temporada == temporadaActual;
            });

            islasFiltradas = islasFiltradas.sort(compareNestCount);

            for (let isla of islasFiltradas) {
                let circulo = new google.maps.Polygon({
                    paths: createCircleForGoogleMaps(Math.log(isla.MaximoNidos) * 10000, [
                        isla.Longitud,
                        isla.Latitud
                    ]),
                    strokeWeight: 0,
                    fillColor: getRGBStringFromCode(isla.Codigo),
                    fillOpacity: 0.35
                });
                circulo.setMap(mapaGoogle);
                circulos.push(circulo);

                $("#bird-list").append(`
                <tr style="background-color: ${getRGBStringFromCode(
                    isla.Codigo
                )}">
                    <th>${isla.NombreIsla}</th>
                    <th>${isla.NombreEspecie}</th>
                    <th>${isla.MaximoNidos}</th>
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
