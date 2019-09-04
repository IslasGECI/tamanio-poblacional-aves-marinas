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

                addHoverListener(circulo, isla.NombreEspecie, isla.NombreIsla, temporadaActual, isla.MaximoNidos.toLocaleString(), tablaHistorica);
            }
        };
    });
}

function addHoverListener(polygon, nombreEspecie, nombreIsla, temporada, maximoNidos, tablaHistorica) {
    google.maps.event.addListener(polygon, 'mouseover', function (e) {
        $("#nombre-especie").text(nombreEspecie);
        $("#nombre-isla").text(nombreIsla);
        $("#etiqueta-temporada").text(temporada);
        $("#cantidad-temporada").text(maximoNidos);
        drawTimeSerie(tablaHistorica)
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

function drawTimeSerie(tablaHistorica) {
    var margin = { top: 10, right: 30, bottom: 30, left: 70 },
        width = 460 - margin.left - margin.right,
        height = 350 - margin.top - margin.bottom;

    d3.select("#serie-tiempo").selectAll("*").remove();

    var svg = d3.select("#serie-tiempo")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var temporadas = d3.scaleLinear()
        .domain([d3.min(tablaHistorica, function (d) { return d.Temporada; }), d3.max(tablaHistorica, function (d) { return d.Temporada; })])
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(temporadas).ticks(5).tickFormat(d3.format(".0f")));
    svg.append("text")
        .attr("transform",
            "translate(" + (width / 2) + " ," +
            (height + margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .text("Temporada");

    var y = d3.scaleLinear()
        .domain([d3.min(tablaHistorica, function (d) { return d.MaximoNidos; }), d3.max(tablaHistorica, function (d) { return d.MaximoNidos; })])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left-5)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Cantidad de parejas reproductoras");  

    svg.append("path")
        .datum(tablaHistorica)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function (d) { return temporadas(d.Temporada) })
            .y(function (d) { return y(d.MaximoNidos) })
        )
}
