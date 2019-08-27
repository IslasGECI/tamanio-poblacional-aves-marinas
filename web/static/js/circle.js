/**
 * Funciones que ayudan a crear círculos en coordenadas geográficas para
 * dibujarlos en el mapa.
 */

/**
 * Crea un círculo alrededor de una coordenada especificada.
 * @param {number} radio_m Radio (m) del circulo que se va a crear.
 * @param {[number, number]} centro Coordenadas [lon, lat] del centro del círculo.
 * Referencia: https://stackoverflow.com/questions/45421774/how-to-draw-circles-with-radii-given-in-kilometers-accurately-on-world-map
 */
function createCircle(radio_m, centro) {
    const radioTierra_m = 6371000;
    let circunferencia = radioTierra_m * Math.PI * 2;
    let grados = (radio_m / circunferencia) * 360;
    let circulo = d3.geoCircle()
        .center(centro)
        .radius(grados);
    return circulo;
}

/**
 * Crea un círculo con las coordenadas en el formato que las espera google maps.
 * @param {*} radio_m Radio (m) del circulo que se va a crear.
 * @param {*} centro Coordenadas [lon, lat] del centro del círculo.
 */
function createCircleForGoogleMaps(radio_m, centro) {
    let coordenadas = createCircle(radio_m, centro)().coordinates[0];
    let coordenadasConFormato = new Array();
    for (let coordenada of coordenadas) {
        coordenadasConFormato.push({ "lat": coordenada[1], "lng": coordenada[0] });
    }
    return coordenadasConFormato;
}
