#!/usr/bin/env python
# Script para agregar los datos de Excel a la base de datos

import sqlite3
from sqlite3 import Error

import numpy as np
import pandas as pd


def create_connection(db_file):
    try:
        conexion = sqlite3.connect(db_file)
        return conexion
    except Error as e:
        print(e)
    return None


def select_island_by_name(conexion, nombre):
    cursor = conexion.cursor()
    cursor.execute('SELECT * FROM isla WHERE nombre=?', (nombre,))
    isla = cursor.fetchone()
    return isla


def select_species_by_name(conexion, nombre):
    cursor = conexion.cursor()
    cursor.execute('SELECT * FROM especie WHERE nombre=?', (nombre,))
    especie = cursor.fetchone()
    return especie


def create_registry(conexion, renglon):
    nombre_isla = renglon['Isla']
    nombre_especie = renglon['Nombre_en_ingles']
    maximo_numero_individuos = renglon[
        'Maxima_cantidad_nidos']
    temporada = renglon['Temporada']
    notas = renglon['Notas']
    id_isla = select_island_by_name(conexion, nombre_isla)[0]
    id_especie = select_species_by_name(conexion, nombre_especie)[0]
    comando_SQL = ''' INSERT INTO registro (id_isla, id_especie, temporada, maximo_nidos, notas)
        VALUES(?,?,?,?,?) '''
    isla = (id_isla, id_especie, temporada, maximo_numero_individuos, notas)
    cursor = conexion.cursor()
    cursor.execute(comando_SQL, isla)
    return cursor.lastrowid


if __name__ == '__main__':
    conexion = create_connection('./aves_marinas.db')
    tabla_datos = pd.read_excel(
        './parejas_aves_marinas_islas_del_pacifico.xlsx').dropna(subset=['Isla'])
    with conexion:
        for indice, renglon in tabla_datos.iterrows():
            project_id = create_registry(conexion, renglon)
