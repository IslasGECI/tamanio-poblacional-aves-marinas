run: build
	docker-compose up

# Archivo con los datos de la cantidad de nidos en las islas del Pacífico
archivoDatos = api-datos/data/parejas_aves_marinas_islas_del_pacifico.xlsx
versionDatos = c4903d6cce4da1d946cd65ece0feda86d4707661

${archivoDatos}:
	mkdir --parents ${@D}
	curl --output ${@} --user $${BITBUCKET_USERNAME}:$${BITBUCKET_PASSWORD} https://bitbucket.org/IslasGECI/archivos_binarios/raw/${versionDatos}/excel/mapa_web/${@F}

.PHONY: build data run

build: ${archivoDatos}
	docker-compose build

data: ${archivoDatos}
