/*
    Agrega algunas islas y especies a la base de datos
*/

-- Agrega algunas islas del pacífico norte
INSERT INTO isla (nombre, longitud, latitud)
    VALUES
        ("Coronado", -117.2619072, 32.4172896),
        ("Todos Santos", -116.8048861, 31.8111613),
        ("San Martín", -116.1152624, 30.4908504),
        ("San Jerónimo", -115.7922802, 29.7913725),
        ("Natividad", -115.180023, 27.86582),
        ("San Roque", -114.3751549, 27.1431125),
        ("Asunción", -114.2966509, 27.1045667),
        ("San Benito", -115.6012184, 28.3049262),
        ("Guadalupe", -118.4330882, 29.0185055),
        ("Morro Prieto and Zapato", -118.27, 29.04);

-- Agrega algunas especies de aves marinas que se encuentran en las islas del pacífico norte
INSERT INTO especie (nombre, codigo, es_madriguera)
    VALUES
        ("Brown Pelican",            "BRPE", 0),
        ("Double-crested Cormorant", "DCCO", 0),
        ("Brandt's Cormorant",       "BRAC", 0),
        ("Pelagic Cormorant",        "PECO", 0),
        ("Western Gull",             "WEGU", 0),
        ("Brown Booby",              "BRBO", 0),
        ("Cassin's Auklet",          "CAAU", 1),
        ("Ainley's Storm Petrel",    "ASPE", 1),
        ("Ashy Storm-Petrel",        "ASSP", 1),
        ("Black Storm-Petrel",       "BLSP", 1),
        ("Scripps's Murrelet",       "SCMU", 1),
        ("Caspian Tern",             "CATE", 0),
        ("Royal Tern",               "ROYT", 0),
        ("Elegant Tern",             "ELTE", 0),
        ("Blue-footed Booby",        "BFBO", 0),
        ("Craveri's Murrelet",       "CRMU", 1),
        ("Black-vented Shearwater",  "BVSH", 1),
        ("Heermann's Gull",          "HERG", 0),
        ("Guadalupe's Murrelet",     "GUMU", 1),
        ("Townsend's Storm Petrel",  "TSPE", 1),
        ("Laysan Albatross",         "LAAL", 0);
