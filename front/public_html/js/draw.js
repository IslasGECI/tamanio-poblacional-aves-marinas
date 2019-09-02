/**
 * Funciones encargadas de dibujar sobre el mapa.
 */

/**
 * Función para dibujar los círculos sobre el mapa.
 * @param {*} mapLayer Capa donde se dibujarán los círculos.
 */
function addDrawFunction(mapLayer) {
    d3.json("http://localhost:851/api-datos/tamanio", function (islas) {
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

            islasFiltradas = islasFiltradas.sort(sortByNestCount);
            $("#bird-list").append(`
                <tr style="background-color: black; color: white; font-weight: bold">
                    <th>Isla</th>
                    <th>Ave</th>
                    <th>Cantidad de Parejas</th>
                    <th>λ</th>
                </tr>
                `);
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
                    <th id="lambda-especie-${isla.Codigo}-${isla.NombreIsla.replace(" ", "")}" style="background-color:white;color:orange">0.00</th>
                </tr>
                `);
                (async (isla)=>{
                    let tablaHistorica = await getHistoric(isla.Codigo, isla.NombreIsla)
                    let arregloTemporada = tablaHistorica.map(function(value,index) {return value.Temporada;});
                    let arregloMaximoNidos = tablaHistorica.map(function(value,index) {return value.MaximoNidos;});
                    let lambda = await getLambda(arregloTemporada, arregloMaximoNidos);
                    let colorTexto = "orange";
                    if (parseFloat(lambda.lambda) >= 1) {
                        colorTexto = "green";
                    }
                    if (parseFloat(lambda.lambda) > 0 && parseFloat(lambda.lambda) < 1) {
                        colorTexto = "yellow";
                    }
                    if (parseFloat(lambda.lambda) < 0) {
                        colorTexto = "red";
                    }
                    $(`#lambda-especie-${isla.Codigo}-${isla.NombreIsla.replace(" ", "")}`).text(lambda.lambda.toFixed(2));
                    $(`#lambda-especie-${isla.Codigo}-${isla.NombreIsla.replace(" ", "")}`).css("color", colorTexto);
                })(isla)
            }
        };
    });
}

/**
 * Función para ordenar lista de mayor a menor cantidad de nidos
 * @param {*} element1 primer elemento a comparar
 * @param {*} element2 segundo elemento a comparar
 */
function sortByNestCount(element1, element2) {
    if (element1.MaximoNidos < element2.MaximoNidos) {
        return 1;
    }
    if (element1.MaximoNidos > element2.MaximoNidos) {
        return -1;
    }
    return 0;
}
