/*
    V0.1 De la base de la parejas de aves marinas
*/

-- isla Representa un cuerpo insular
CREATE TABLE IF NOT EXISTS isla (
    id       INTEGER    PRIMARY KEY     AUTOINCREMENT,
    nombre   CHAR(50)   NOT NULL        UNIQUE,
    longitud FLOAT(3,5) NOT NULL        CHECK(longitud > -180 AND longitud < 180),
    latitud  FLOAT(2,5) NOT NULL        CHECK(latitud > -90 AND latitud < 90)
);

-- especie Representa una especie de ave marina
CREATE TABLE IF NOT EXISTS especie (
    id              INTEGER     PRIMARY KEY     AUTOINCREMENT,
    nombre          CHAR(50)    NOT NULL        UNIQUE,
    codigo          CHAR(4)     NOT NULL        UNIQUE,
    es_madriguera   BOOLEAN     NOT NULL
);

-- registro Representa un evento de monitoreo de la población de aves marinas
CREATE TABLE IF NOT EXISTS registro (
    id           INTEGER    PRIMARY KEY AUTOINCREMENT,
    id_isla      INTEGER    NOT NULL,
    id_especie   INTEGER    NOT NULL,
    temporada    INTEGER    NOT NULL,
    maximo_nidos INTEGER    NOT NULL    CHECK(maximo_nidos >= 0),
    notas        CHAR(200),

    CONSTRAINT fk_isla
        FOREIGN KEY (id_isla)
            REFERENCES isla(id),
    
    CONSTRAINT fk_especie
        FOREIGN KEY (id_especie)
            REFERENCES especie(id)

    CONSTRAINT unico_registro
        UNIQUE (id_isla, id_especie, temporada) ON CONFLICT IGNORE
);

-- Crea tabla que es similar a la hoja original de Excel
CREATE VIEW IF NOT EXISTS tabla_registros AS 
    SELECT i.nombre as isla, e.nombre as especie, r.temporada, r.maximo_nidos, r.notas
        FROM registro as r
        INNER JOIN isla as i
        ON r.id_isla = i.id
            INNER JOIN especie as e
                ON r.id_especie = e.id;