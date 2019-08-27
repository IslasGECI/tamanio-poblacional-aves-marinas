# Compila el servidor
FROM golang:1.12.9
WORKDIR /workdir/cmd
COPY ./cmd /workdir/cmd
RUN go build -o ../bin/tablacruce ./tablacruce

# Genera la base de datos
FROM nouchka/sqlite3
WORKDIR /workdir/data
COPY ./scripts /workdir/scripts
RUN sqlite3 aves_marinas.db < /workdir/scripts/database/sql/createTables.sql
RUN sqlite3 aves_marinas.db < /workdir/scripts/database/sql/seedDataBase.sql

# Rellena la base de datos
FROM python:3
RUN pip install numpy pandas xlrd
WORKDIR /workdir/data
COPY --from=1 /workdir/data .
COPY ./data/base_datos_parejas_aves_marinas_islas.xlsx /workdir/data
COPY ./scripts /workdir/scripts
RUN python /workdir/scripts/database/python/fillDataBase.py

# Corre la aplicación
FROM debian:bullseye-slim
WORKDIR /workdir
COPY --from=0 /workdir/bin ./bin
COPY --from=2 /workdir/data ./data
COPY ./web /workdir/web
CMD ["./bin/tablacruce"]
