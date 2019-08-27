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
	app.HandleFunc("/aves", app.SpeciesListHandler)
	app.HandleFunc("/islas", app.IslandListHandler)
	app.HandleFunc("/temporadas", app.SeasonListHandler)
	app.HandleFunc("/{ave}/{isla}/{temporada}", app.CountPerSpeciesPerIslandHandler)
	app.HandleFunc("/tamanio", app.CountTableHandler)
	// Sirve los archivos estáticos
	fs := http.FileServer(http.Dir("web/static"))
	app.PathPrefix("/").Handler(fs)
	log.Println("Escuchando en el puerto 4000")
	http.ListenAndServe(":4000", app)
}
