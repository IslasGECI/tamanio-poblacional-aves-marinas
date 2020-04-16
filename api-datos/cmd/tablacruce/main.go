// Este archivo contiene la función main
package main // import "bitbucket.org/IslasGECI/tablacruce"

import (
	"database/sql"
	"github.com/gorilla/mux"
	"log"
	"net/http"
)

type App struct {
	*sql.DB
	*mux.Router
}

func RequestLogger(targetMux http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		targetMux.ServeHTTP(w, r)
		requesterIP := r.RemoteAddr
		log.Printf(
			"%s - - \"%s %s\"",
			requesterIP,
			r.Method,
			r.RequestURI
		)
	})
}

func main() {
	db, err := InitSQLiteDataBaseConnection()
	if err != nil {
		panic(err)
	}

	app := App{db, mux.NewRouter()}
	app.HandleFunc("/api-datos/aves", app.SpeciesListHandler)
	app.HandleFunc("/api-datos/islas", app.IslandListHandler)
	app.HandleFunc("/api-datos/historicos/{ave}/{isla}", app.HistoricHandler)
	app.HandleFunc("/api-datos/temporadas", app.SeasonListHandler)
	app.HandleFunc("/api-datos/{ave}/{isla}/{temporada}", app.CountPerSpeciesPerIslandHandler)
	app.HandleFunc("/api-datos/tamanio", app.CountTableHandler)
	log.Println("Escuchando en el puerto 4000")
	http.ListenAndServe(":4000", RequestLogger(app))
}
