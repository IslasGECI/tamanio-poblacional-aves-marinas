var layer = null;
var indiceTemporada = 0;
var temporadaActual = null;
var map = null;
var circulos = new Array();

function scaleToColor(x, out_range=[0, 255]) {
    domain = ["A".charCodeAt(0), "Z".charCodeAt(0)]
    y = (x - (domain[1] + domain[0]) / 2) / (domain[1] - domain[0]);
    return y * (out_range[1] - out_range[0]) + (out_range[1] + out_range[0]) / 2
}

function formatCoordinates(radio_m, centro) {
  let coordenadas = createCircle(radio_m, centro)().coordinates[0];
  let coordenadasConFormato = new Array();
  for (let coordenada of coordenadas) {
    coordenadasConFormato.push({"lat": coordenada[1], "lng": coordenada[0]});
  }
  return coordenadasConFormato;
}

d3.select(window).on("load", () => {
  main();
});

function addDrawFunction(mapLayer) {
  d3.json("/tamanio", function(islas) {
    var radioMaximo = d3.max(islas, function(d) { return d.MaximoNidos;});
      if(layer == null){
          layer = d3.select(mapLayer.getPanes().overlayLayer).append("div")
              .attr("class", "traps").attr("id", "traps");
      } else {
          layer = d3.select("#traps");
      }
      mapLayer.draw = function () {
          for (let circulo of circulos) {
            circulo.setMap(null);
          }
          circulos = new Array();
          $("#bird-list").empty();

          islasFiltradas = islas.filter((elemento)=>{
            return elemento.Temporada == temporadaActual;
          });

          islasFiltradas = islasFiltradas.sort((a, b) => {
            if ( a.MaximoNidos < b.MaximoNidos ){
              return 1;
            }
            if ( a.MaximoNidos > b.MaximoNidos ){
              return -1;
            }
            return 0;
          });

          for (let isla of islasFiltradas) {
            let circulo = new google.maps.Polygon({
              paths: formatCoordinates(Math.log(isla.MaximoNidos)*10000, [isla.Longitud, isla.Latitud]),
              strokeWeight: 0,
              fillColor: `rgb(${scaleToColor(isla.Codigo[0].charCodeAt(0))},${scaleToColor(isla.Codigo[1].charCodeAt(0))},${scaleToColor(isla.Codigo[2].charCodeAt(0))})`,
              fillOpacity: 0.35
            });
            circulo.setMap(map);
            circulos.push(circulo);
            
            $("#bird-list").append(`
              <tr style="background-color: rgb(${scaleToColor(isla.Codigo[0].charCodeAt(0))},${scaleToColor(isla.Codigo[1].charCodeAt(0))},${scaleToColor(isla.Codigo[2].charCodeAt(0))})">
                  <th>${isla.NombreIsla}</th>
                  <th>${isla.NombreEspecie}</th>
                  <th>${isla.MaximoNidos}</th>
              </tr>
            `)
          }
      };
  });
}

async function main() {
  let islas = await getIslands();
  let aves = await getBirds();
  let temporadas = await getSeasons();
  temporadaActual = temporadas[indiceTemporada];
  
  $("#temporada").text(temporadaActual);
  $("#scroll-temporada").attr('min', 1);
  $("#scroll-temporada").attr('max', temporadas.length);

  map = new google.maps.Map($("#map")[0], {
      zoom: 6,
      center: new google.maps.LatLng(27.577622, -111.454526),
      mapTypeControl: false,
      streetViewControl: false,
      scaleControl: true,
      fullscreenControl: false,
      styles: [
          {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
          {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
          {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
          {
            featureType: 'administrative.locality',
            elementType: 'labels.text.fill',
            stylers: [{color: '#d59563'}]
          },
          {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{color: '#d59563'}]
          },
          {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [{color: '#263c3f'}]
          },
          {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [{color: '#6b9a76'}]
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{color: '#38414e'}]
          },
          {
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [{color: '#212a37'}]
          },
          {
            featureType: 'road',
            elementType: 'labels.text.fill',
            stylers: [{color: '#9ca5b3'}]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{color: '#746855'}]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{color: '#1f2835'}]
          },
          {
            featureType: 'road.highway',
            elementType: 'labels.text.fill',
            stylers: [{color: '#f3d19c'}]
          },
          {
            featureType: 'transit',
            elementType: 'geometry',
            stylers: [{color: '#2f3948'}]
          },
          {
            featureType: 'transit.station',
            elementType: 'labels.text.fill',
            stylers: [{color: '#d59563'}]
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{color: '#17263c'}]
          },
          {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{color: '#515c6d'}]
          },
          {
            featureType: 'water',
            elementType: 'labels.text.stroke',
            stylers: [{color: '#17263c'}]
          }
        ]
  });
  let overlay = new google.maps.OverlayView();
  overlay.onAdd = () => {addDrawFunction(overlay)};
  overlay.onRemove = function(){};
  overlay.setMap(map);
  $("#scroll-temporada").on("input", function() {
    indiceTemporada = this.value - 1;
    temporadaActual = temporadas[indiceTemporada];
    overlay.draw();
    $("#temporada").text(temporadaActual);
  });
}

function getIslands() {
    return new Promise(function(resolve, reject) {
        $.getJSON(`/islas`, (islas) => {
            resolve(islas);
        });
    });
}

function getSeasons() {
    return new Promise((resolve, reject) => {
        $.getJSON(`/temporadas`, (islas) => {
            resolve(islas);
        });
    });
}

function getBirds() {
    return new Promise((resolve, reject) => {
        $.getJSON(`/aves`, (islas) => {
            resolve(islas);
        });
    });
}