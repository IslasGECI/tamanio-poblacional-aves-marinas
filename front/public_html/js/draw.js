/**
 * Funciones encargadas de dibujar sobre el mapa.
 */

/**
 * Función para dibujar los círculos sobre el mapa.
 * @param {*} mapLayer Capa donde se dibujarán los círculos.
 */
function addDrawFunction(mapLayer) {
    d3.json("http://islasgeci.org:8510/api-datos/tamanio", function (censos) {
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
            let censosFiltradas = censos.filter(elemento => elemento.Temporada == temporadaActual);
            censosFiltradas = censosFiltradas.sort(sortByNestCount);

            for (let censo of censosFiltradas) {
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
                $(
                    `#maximo-nidos-especie-${censo.Codigo}-${censo.NombreIsla.replace(
                        " ",
                        ""
                    )}`
                ).text(censo.MaximoNidos.toLocaleString());

                let tablaHistorica = await getHistoric(censo.Codigo, censo.NombreIsla);

                addHoverListener(
                    circulo,
                    censo.NombreEspecie,
                    censo.NombreIsla,
                    temporadaActual,
                    censo.MaximoNidos.toLocaleString(),
                    tablaHistorica
                );
            }
        };
    });
}

function addHoverListener(
    polygon,
    nombreEspecie,
    nombreIsla,
    temporada,
    maximoNidos,
    tablaHistorica
) {
    google.maps.event.addListener(polygon, "mouseover", function (e) {
        $("#nombre-especie").text(nombreEspecie);
        $("#nombre-isla").text(nombreIsla);
        $("#etiqueta-temporada").text(temporada);
        $("#cantidad-temporada").text(maximoNidos);
        drawTimeSerie(tablaHistorica);
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
    let margenes = { superior: 10, derecha: 30, inferior: 30, izquierda: 70 };
    let ancho_grafica = 460 - margenes.izquierda - margenes.derecha;
    let alto_grafica = 350 - margenes.superior - margenes.inferior;

    d3.select("#serie-tiempo").selectAll("*").remove();

    var svg = d3.select("#serie-tiempo")
        .attr("width", ancho_grafica + margenes.izquierda + margenes.derecha)
        .attr("height", alto_grafica + margenes.superior + margenes.inferior)
        .append("g")
        .attr(
            "transform",
            "translate(" + margenes.izquierda + "," + margenes.superior + ")"
        );

    var eje_temporadas = d3.scaleLinear()
        .domain([
            d3.min(tablaHistorica, d => d.Temporada),
            d3.max(tablaHistorica, d => d.Temporada)
        ])
        .range([0, ancho_grafica]);
    svg
        .append("g")
        .attr("transform", "translate(0," + alto_grafica + ")")
        .call(
            d3
                .axisBottom(eje_temporadas)
                .ticks(5)
                .tickFormat(d3.format(".0f"))
        );
    svg
        .append("text")
        .attr(
            "transform",
            `translate(${ancho_grafica / 2},${alto_grafica + margenes.superior + 20})`
        )
        .style("text-anchor", "middle")
        .text("Temporada");

    var eje_cantidad_parejas = d3
        .scaleLinear()
        .domain([
            d3.min(tablaHistorica, d => d.MaximoNidos),
            d3.max(tablaHistorica, d => d.MaximoNidos)
        ])
        .range([alto_grafica, 0]);
    svg.append("g").call(d3.axisLeft(eje_cantidad_parejas));
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margenes.izquierda - 5)
        .attr("x", 0 - alto_grafica / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Cantidad de parejas reproductoras");

    svg.append("path")
        .datum(tablaHistorica)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(d => eje_temporadas(d.Temporada))
            .y(d => eje_cantidad_parejas(d.MaximoNidos))
        );
}
