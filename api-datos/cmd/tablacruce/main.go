// Este archivo contiene la función main
package main // import "bitbucket.org/IslasGECI/tablacruce"

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

type App struct {
	*sql.DB
	*mux.Router
}

func main() {
	db, err := InitSQLiteDataBaseConnection()
	if err != nil {
		panic(err)
	}

	app := App{db, mux.NewRouter()}
	app.HandleFunc("/api-datos/aves", app.SpeciesListHandler)
	app.HandleFunc("/api-datos/islas", app.IslandListHandler)
	app.HandleFunc("/api-datos/temporadas", app.SeasonListHandler)
	app.HandleFunc("/api-datos/{ave}/{isla}/{temporada}", app.CountPerSpeciesPerIslandHandler)
	app.HandleFunc("/api-datos/tamanio", app.CountTableHandler)
	log.Println("Escuchando en el puerto 4000")
	http.ListenAndServe(":4000", app)
}
