// Este archivo contiene las funciones que hacen queries a la base de datos

package main

import (
	"database/sql"
	"fmt"

	_ "github.com/mattn/go-sqlite3"
)

// InitSQLiteDataBaseConnection Crea una conexión con la vase de datos
func InitSQLiteDataBaseConnection() (*sql.DB, error) {
	baseDatos, err := sql.Open("sqlite3", "./data/aves_marinas.db")
	if err != nil {
		return nil, err
	}
	return baseDatos, nil
}

// GetCountPerSpeciesPerIsland Regresa el número de aves de cierta especie en cierta isla
func (app *App) GetCountPerSpeciesPerIsland(specie, island, season string) int {
	renglones, err := app.Query("SELECT r.maximo_nidos FROM tabla_registros as r WHERE especie=$1 AND isla=$2 AND temporada=$3",
		specie, island, season)
	if err != nil {
		panic(err)
	}
	var nidos int
	for renglones.Next() {
		err = renglones.Scan(&nidos)
		if err != nil {
			panic(err)
		}
	}
	return nidos
}

// GetSeasonList Regresa las lista de temporadas en la base de datos ordenada de menor a mayor
func (app *App) GetSeasonList() []int {
	renglones, err := app.Query("SELECT DISTINCT r.temporada FROM registro as r ORDER BY r.temporada")
	if err != nil {
		panic(err)
	}
	var temporadas []int
	for renglones.Next() {
		var temporada int
		err = renglones.Scan(&temporada)
		if err != nil {
			panic(err)
		}

		temporadas = append(temporadas, temporada)
	}
	return temporadas
}

// GetSpeciesList Regresa la lista de especies en la base de datos
func (app *App) GetSpeciesList() []Species {
	renglones := app.GetQueryList("especie")
	var tablaEspecies []Species
	for renglones.Next() {
		var id int
		var nombre, codigo string
		var esMadriguera bool
		err := renglones.Scan(&id, &nombre, &codigo, &esMadriguera)
		if err != nil {
			panic(err)
		}

		tablaEspecies = append(tablaEspecies, NewSpecies(id, nombre, codigo, esMadriguera))
	}
	return tablaEspecies
}

// GetIslandList Regresa una lista con las islas en la base de datos
func (app *App) GetIslandList() []Island {
	renglones := app.GetQueryList("isla")
	var tablaIslas []Island
	for renglones.Next() {
		var id int
		var nombre string
		var latitud float64
		var longitud float64
		err := renglones.Scan(&id, &nombre, &longitud, &latitud)
		if err != nil {
			panic(err)
		}
		tablaIslas = append(tablaIslas, NewIsland(id, nombre, longitud, latitud))
	}
	return tablaIslas
}

// GetQueryList Regresa los renglones de la tabla especificada
func (app *App) GetQueryList(tableName string) *sql.Rows {
	renglones, err := app.Query(fmt.Sprintf("SELECT t.* FROM %s as t", tableName))
	if err != nil {
		panic(err)
	}
	return renglones
}

// GetQueryList Regresa los renglones de la tabla especificada
func (app *App) GetCountTable() []CountTableRow {
	var tablaCantidadParejas []CountTableRow
	renglones, err := app.Query(`
	SELECT sp.nombre, i.nombre, r.maximo_nidos, r.temporada, i.latitud, i.longitud, sp.codigo FROM registro as r
    JOIN especie as sp
    JOIN isla as i
        WHERE r.id_especie = sp.id
        AND r.id_isla = i.id;
	`)
	if err != nil {
		panic(err)
	}
	var nombreEspecie string
	var nombreIsla string
	var maximoNidos int
	var temporada int
	var latitud float64
	var longitud float64
	var codigo string
	for renglones.Next() {
		err = renglones.Scan(&nombreEspecie, &nombreIsla, &maximoNidos, &temporada, &latitud, &longitud, &codigo)
		if err != nil {
			panic(err)
		}
		tablaCantidadParejas = append(tablaCantidadParejas, NewCountTableRow(nombreEspecie, nombreIsla, maximoNidos, temporada, latitud, longitud, codigo))
	}
	return tablaCantidadParejas
}

// GetQueryList Regresa los renglones de la tabla especificada
func (app *App) GetHistoricTable(specieId, islandId string) []HistoricTableRow {
	var tablaCantidadParejas []HistoricTableRow
	renglones, err := app.Query(`SELECT r.temporada, r.maximo_nidos FROM registro as r 
								JOIN especie as sp
								JOIN isla as i
								ON sp.id = r.id_especie AND i.id = r.id_isla
								WHERE sp.codigo=$1 AND i.nombre=$2`, specieId, islandId)
	if err != nil {
		panic(err)
	}
	var temporada int
	var maximoNidos int
	for renglones.Next() {
		err = renglones.Scan(&temporada, &maximoNidos)
		if err != nil {
			panic(err)
		}
		tablaCantidadParejas = append(tablaCantidadParejas, NewHistoricTableRow(temporada, maximoNidos))
	}
	return tablaCantidadParejas
}
