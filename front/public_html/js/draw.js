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
            capa = d3.select(mapLayer.getPanes().overlayLayer)
                .append("div")
                .attr("id", "capa-circulos");
        } else {
            capa = d3.select("#capa-circulos");
        }
        mapLayer.draw = async function () {
            for (let circulo of circulos) {
                circulo.setMap(null);
            }
            circulos = new Array();
            islasFiltradas = islas.filter(elemento => {
                return elemento.Temporada == temporadaActual;
            });
            islasFiltradas = islasFiltradas.sort(sortByNestCount);

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
                $(`#maximo-nidos-especie-${isla.Codigo}-${isla.NombreIsla.replace(" ", "")}`).text(isla.MaximoNidos.toLocaleString());

                let tablaHistorica = await getHistoric(isla.Codigo, isla.NombreIsla);

                attachPolygonInfoWindow(circulo, `
                <div>
                    <p>Especie: ${isla.NombreEspecie}</p>
                    <p>Isla: ${isla.NombreIsla}</p>
                    <p>Cantidad de nidos en el ${temporadaActual}: ${isla.MaximoNidos.toLocaleString()}</p>
                </div>`, tablaHistorica);
            }
        };
    });
}

function attachPolygonInfoWindow(polygon, html, tablaHistorica) {
    polygon.infoWindow = new google.maps.InfoWindow({
        content: html,
    });
    google.maps.event.addListener(polygon, 'mouseover', function (e) {
        var latLng = e.latLng;
        polygon.infoWindow.setPosition(latLng);
        polygon.infoWindow.open(mapaGoogle);
    });
    google.maps.event.addListener(polygon, 'mouseout', function () {
        polygon.infoWindow.close();
    });
    google.maps.event.addListener(polygon, 'click', function () {
        timeSerie(tablaHistorica)
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

function timeSerie(tablaHistorica) {
    var margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("body")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    

    // Add X axis --> it is a date format
    var x = d3.scaleTime()
        .domain(d3.extent(tablaHistorica, function(d) { return d.Temporada; }))
        .range([ 0, width ]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, d3.max(tablaHistorica, function(d) { return d.MaximoNidos; })])
        .range([ height, 0 ]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Add the line
    svg.append("path")
        .datum(tablaHistorica)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
        .x(function(d) { return x(d.Temporada) })
        .y(function(d) { return y(d.MaximoNidos) })
        )
}
