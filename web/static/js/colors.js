/**
 * Regresa un valor entre 0 y 255 para cada letra del abecedario en mayúscula
 * @param {char} letter Letra del abecedario en mayúscula.
 * @param {[number, number]} out_range Valor mínimo y máximo de la escala de color.
 */
function scaleToColor(letter, out_range = [0, 255]) {
    let dominio = ["A".charCodeAt(0), "Z".charCodeAt(0)];
    let parcial = (letter - (dominio[1] + dominio[0]) / 2) / (dominio[1] - dominio[0]);
    return parcial * (out_range[1] - out_range[0]) + (out_range[1] + out_range[0]) / 2;
}

/**
 * Regresa una cadena que representa un color rgb a partir del código de cuatro
 * letras.
 * @param {string} code Código de cuatro letras del ave.
 */
function getRGBStringFromCode(code) {
    let valoresRGB = new Array;
    for (let letra of code) {
        valoresRGB.push(Math.abs(scaleToColor(letra.charCodeAt(0))));
    }
    return `rgb(${valoresRGB[0]}, ${valoresRGB[1]}, ${valoresRGB[2]})`;
}
