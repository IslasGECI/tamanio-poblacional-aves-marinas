versionDatos = 1b981ee4293a

# Archivo con los datos de la cantidad de nidos en las islas del Pacífico
archivoDatos = \
	data/base_datos_parejas_aves_marinas_islas.xlsx

.PHONY: build run

build: $(archivoDatos)
	docker build --tag tamanio-poblacional-aves-marinas .

run:
	docker run --publish 850:4000 tamanio-poblacional-aves-marinas:latest

$(archivoDatos):
	if [ ! -d $(@D) ]; then mkdir -p $(@D); fi		
	curl --output $@ --user ${BITBUCKET_USERNAME}:${BITBUCKET_PASSWORD} https://bitbucket.org/IslasGECI/datos-binarios/raw/$(versionDatos)/$(@F)
