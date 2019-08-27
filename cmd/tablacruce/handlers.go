// Este archivo contiene los handlers de la api
package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
)

// SpeciesListHandler Función encargada de servir las peticiones a /aves
func (app *App) SpeciesListHandler(w http.ResponseWriter, r *http.Request) {
	jsonString, _ := json.Marshal(app.GetSpeciesList())
	fmt.Fprint(w, string(jsonString[:]))
}

// SeasonListHandler Función encargada de servir las peticiones a /temporadas
func (app *App) SeasonListHandler(w http.ResponseWriter, r *http.Request) {
	jsonString, _ := json.Marshal(app.GetSeasonList())
	fmt.Fprint(w, string(jsonString[:]))
}

// IslandListHandler Función encargada de responder las peticiones a /islas
func (app *App) IslandListHandler(w http.ResponseWriter, r *http.Request) {
	jsonString, _ := json.Marshal(app.GetIslandList())
	fmt.Fprint(w, string(jsonString[:]))
}

// CountPerSpeciesPerIslandHandler Función encargada de responder las peticiones a /{ave}/{isla}/{temporada}
func (app *App) CountPerSpeciesPerIslandHandler(w http.ResponseWriter, r *http.Request) {
	variables := mux.Vars(r)
	ave, isla, temporada := variables["ave"], variables["isla"], variables["temporada"]
	nidos := app.GetCountPerSpeciesPerIsland(ave, isla, temporada)
	jsonString, _ := json.Marshal(nidos)
	fmt.Fprint(w, string(jsonString[:]))
}

// IslandListHandler Función encargada de responder las peticiones a /islas
func (app *App) CountTableHandler(w http.ResponseWriter, r *http.Request) {
	jsonString, _ := json.Marshal(app.GetCountTable())
	fmt.Fprint(w, string(jsonString[:]))
}
