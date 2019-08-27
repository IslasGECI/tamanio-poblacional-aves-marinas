$(window).on('load', function () {

    // Se obtienen las temporadas y se dibuja la tabla para la primer temporada con datos
    $.getJSON("/temporadas", function (temporadas) {
        createTable(temporadas[0]);
        for (temporada of temporadas) {
            $("#dia").append(`<option value="${temporada}">${temporada}</option>`);
        }
        $("#dia").on("input", function () {
            let temporadaActual = this.value;
            createTable(temporadaActual);
        });
    });

    // Función encargada de crear la tabla para la temporada especificada
    async function createTable(temporada) {
        $("#tabla-cruce").empty();
        $("#tabla-cruce").append(`
            <tr id="encabezado-tabla">  
                <th></th>          
            </tr>`);
        $.getJSON("/aves", function (aves) {
            for (ave of aves) {
                $("#encabezado-tabla").append(`<th>${ave.Nombre}</th>`);
            }
        })
            .done(function (aves) {
                $.getJSON("/islas", async function (islas) {
                    for (isla of islas) {
                        await createRow(aves, isla, temporada).then(function (data) {
                            $("#tabla-cruce").append(data);
                        });
                    }
                });
            });
    }

    // Función encargada de crear cada renglón de la tabla
    async function createRow(aves, isla, temporada) {
        renglon = `<tr>
                    <td>${isla.Nombre}</td>`
        for (ave of aves) {
            var nAvesTemporada = 0;
            var nAvesTemporadaAnterior = 0;
            await new Promise(done => $.getJSON(encodeURI(`/${ave.Nombre}/${isla.Nombre}/${temporada}`), async function (n) {
                nAvesTemporada = n;
                await new Promise(done => $.getJSON(encodeURI(`/${ave.Nombre}/${isla.Nombre}/${parseInt(temporada) - 1}`), function (n) {
                    nAvesTemporadaAnterior = n;
                    done();
                }));
                done();
            }));
            if (nAvesTemporada == 0) {
                renglon += `<td class="sin-dato">-</td>`;
            } else {
                if (nAvesTemporada > nAvesTemporadaAnterior) {
                    renglon += `<td class="mayor">${nAvesTemporada.toLocaleString()}</td>`;
                } else {
                    renglon += `<td class="menor">${nAvesTemporada.toLocaleString()}</td>`;
                }
            }
        }
        return renglon + "</tr>";
    }
});
