from scipy.optimize import curve_fit
import numpy as np


def power_law(time, lambdas, n_o):
    return n_o * np.power(lambdas, time)


def get_lambdas(temporadas, maximo_nidos):
    temporadas = np.array(temporadas)
    numero_agno = temporadas - temporadas[0]
    maximo_nidos = np.array(maximo_nidos)
    popt, _ = curve_fit(power_law, numero_agno.astype("float64"), maximo_nidos.astype("float64"))
    return popt
