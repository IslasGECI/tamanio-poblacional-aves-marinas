var layer = null;
var indiceTemporada = 0;
var temporadaActual = null;
var mapaGoogle = null;
var circulos = new Array();

d3.select(window).on("load", () => {
  main();
});

function addDrawFunction(mapLayer) {
  d3.json("/tamanio", function (islas) {
    if (layer == null) {
      layer = d3
        .select(mapLayer.getPanes().overlayLayer)
        .append("div")
        .attr("class", "traps")
        .attr("id", "traps");
    } else {
      layer = d3.select("#traps");
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

      islasFiltradas = islasFiltradas.sort((a, b) => {
        if (a.MaximoNidos < b.MaximoNidos) {
          return 1;
        }
        if (a.MaximoNidos > b.MaximoNidos) {
          return -1;
        }
        return 0;
      });

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
              <tr style="background-color: ${getRGBStringFromCode(isla.Codigo)}">
                  <th>${isla.NombreIsla}</th>
                  <th>${isla.NombreEspecie}</th>
                  <th>${isla.MaximoNidos}</th>
              </tr>
            `);
      }
    };
  });
}

async function main() {
  let temporadas = await getSeasons();
  temporadaActual = temporadas[indiceTemporada];

  $("#temporada").text(temporadaActual);
  $("#scroll-temporada").attr("min", 1);
  $("#scroll-temporada").attr("max", temporadas.length);

  mapaGoogle = new google.maps.Map($("#map")[0], {
    zoom: 6,
    center: new google.maps.LatLng(27.577622, -111.454526),
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
  overlay.onRemove = () => {};
  overlay.setMap(mapaGoogle);
  
  $("#scroll-temporada").on("input", function () {
    indiceTemporada = this.value - 1;
    temporadaActual = temporadas[indiceTemporada];
    overlay.draw();
    $("#temporada").text(temporadaActual);
  });
}
