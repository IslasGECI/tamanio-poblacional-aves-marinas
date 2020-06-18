run: build
	docker-compose up

# Archivo con los datos de la cantidad de nidos en las islas del Pacífico
archivoDatos = api-datos/data/parejas_aves_marinas_islas_del_pacifico.xlsx
versionDatos = 6832498d46f49d6aae6469b41d34ccf63fda1e3b

${archivoDatos}:
	mkdir --parents ${@D}
	curl --output ${@} --user $${BITBUCKET_USERNAME}:$${BITBUCKET_PASSWORD} https://bitbucket.org/IslasGECI/archivos_binarios/raw/${versionDatos}/excel/mapa_web/${@F}

.PHONY: build data run

build: ${archivoDatos}
	docker-compose build

data: ${archivoDatos}
