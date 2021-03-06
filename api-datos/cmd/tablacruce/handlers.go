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
	enableCors(&w)
	fmt.Fprint(w, string(jsonString[:]))
}

// SeasonListHandler Función encargada de servir las peticiones a /temporadas
func (app *App) SeasonListHandler(w http.ResponseWriter, r *http.Request) {
	jsonString, _ := json.Marshal(app.GetSeasonList())
	enableCors(&w)
	fmt.Fprint(w, string(jsonString[:]))
}

// IslandListHandler Función encargada de responder las peticiones a /islas
func (app *App) IslandListHandler(w http.ResponseWriter, r *http.Request) {
	jsonString, _ := json.Marshal(app.GetIslandList())
	enableCors(&w)
	fmt.Fprint(w, string(jsonString[:]))
}

// CountPerSpeciesPerIslandHandler Función encargada de responder las peticiones a /{ave}/{isla}/{temporada}
func (app *App) CountPerSpeciesPerIslandHandler(w http.ResponseWriter, r *http.Request) {
	variables := mux.Vars(r)
	ave, isla, temporada := variables["ave"], variables["isla"], variables["temporada"]
	nidos := app.GetCountPerSpeciesPerIsland(ave, isla, temporada)
	jsonString, _ := json.Marshal(nidos)
	enableCors(&w)
	fmt.Fprint(w, string(jsonString[:]))
}

// IslandListHandler Función encargada de responder las peticiones a /islas
func (app *App) CountTableHandler(w http.ResponseWriter, r *http.Request) {
	jsonString, _ := json.Marshal(app.GetCountTable())
	enableCors(&w)
	fmt.Fprint(w, string(jsonString[:]))
}

// HistoricHandler Función encargada de responder las peticiones a /islas
func (app *App) HistoricHandler(w http.ResponseWriter, r *http.Request) {
	variables := mux.Vars(r)
	aveId, islaId := variables["ave"], variables["isla"]
	historicos := app.GetHistoricTable(aveId, islaId)
	jsonString, _ := json.Marshal(historicos)
	enableCors(&w)
	fmt.Fprint(w, string(jsonString[:]))
}

// enableCors Permite que se pueda llamar la api desde cualquier servidor
func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
}
