function scaleToColor(x, out_range = [0, 255]) {
    domain = ["A".charCodeAt(0), "Z".charCodeAt(0)];
    y = (x - (domain[1] + domain[0]) / 2) / (domain[1] - domain[0]);
    return y * (out_range[1] - out_range[0]) + (out_range[1] + out_range[0]) / 2;
}

function getRGBStringFromCode(code) {
    let valoresRGB = new Array;
    for (let letra of code) {
        valoresRGB.push(Math.abs(scaleToColor(letra.charCodeAt(0))));
    }
    return `rgb(${valoresRGB[0]}, ${valoresRGB[1]}, ${valoresRGB[2]})`;
}
