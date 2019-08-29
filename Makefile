versionDatos = 1b981ee4293a

# Archivo con los datos de la cantidad de nidos en las islas del Pacífico
archivoDatos = \
	api-datos/data/base_datos_parejas_aves_marinas_islas.xlsx

run: $(archivoDatos)
	docker-compose up

$(archivoDatos):
	if [ ! -d $(@D) ]; then mkdir -p $(@D); fi		
	curl --output $@ --user ${BITBUCKET_USERNAME}:${BITBUCKET_PASSWORD} https://bitbucket.org/IslasGECI/datos-binarios/raw/$(versionDatos)/$(@F)
