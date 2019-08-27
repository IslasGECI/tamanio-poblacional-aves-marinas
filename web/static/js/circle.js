const radioTierra_m = 6371000;
function createCircle(radio_m, centro) {
    let circumference = radioTierra_m * Math.PI * 2;
    let grados = radio_m / circumference * 360;
    let circle = d3.geoCircle().center(centro).radius(grados);
    return circle
}
// Referencia: https://stackoverflow.com/questions/45421774/how-to-draw-circles-with-radii-given-in-kilometers-accurately-on-world-map