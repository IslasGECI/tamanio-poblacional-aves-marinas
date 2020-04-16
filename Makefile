run: build
	docker-compose up

# Archivo con los datos de la cantidad de nidos en las islas del Pacífico
archivoDatos = api-datos/data/base_datos_parejas_aves_marinas_islas.xlsx
versionDatos = 1b981ee4293a

${archivoDatos}:
	mkdir --parents ${@D}
	curl --output ${@} --user $${BITBUCKET_USERNAME}:$${BITBUCKET_PASSWORD} https://bitbucket.org/IslasGECI/datos-binarios/raw/${versionDatos}/${@F}

.PHONY: build data run

build: ${archivoDatos}
	docker-compose build

data: ${archivoDatos}
