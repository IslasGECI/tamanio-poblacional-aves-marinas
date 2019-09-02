// Este archivo contiene las estructuras usadas en el programas

package main

// Species Estructura que representa una especie
type Species struct {
	ID           int
	Nombre       string
	Codigo       string
	EsMadriguera bool
}

// NewSpecies Crea una nueva estructura de tipo Especie
func NewSpecies(id int, nombre, codigo string, esMadriguera bool) Species {
	return Species{id, nombre, codigo, esMadriguera}
}

// Island Estructura que representa una isla
type Island struct {
	ID       int
	Nombre   string
	Longitud float64
	Latitud  float64
}

// NewIsland Crea una nueva estructura de tipo Island
func NewIsland(id int, nombre string, longitud, latitud float64) Island {
	return Island{id, nombre, longitud, latitud}
}

type CountTableRow struct {
	NombreEspecie string
	NombreIsla    string
	MaximoNidos   int
	Temporada     int
	Latitud       float64
	Longitud      float64
	Codigo        string
}

func NewCountTableRow(nombreEspecie string, nombreIsla string, maximoNidos int, temporada int, latitud, longitud float64, codigo string) CountTableRow {
	return CountTableRow{nombreEspecie, nombreIsla, maximoNidos, temporada, latitud, longitud, codigo}
}

type HistoricTableRow struct {
	Temporada   int
	MaximoNidos int
}

func NewHistoricTableRow(temporada, maximoNidos int) HistoricTableRow {
	return HistoricTableRow{temporada, maximoNidos}
}
