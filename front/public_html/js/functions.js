function setSeason(bubble, selectedSeason) {
    bubble.innerHTML = `<p id='temporada'>${selectedSeason}</p>`;
}

function returnTrue(){
    return true;
}

module.exports = {
    setSeason,
    returnTrue
}
