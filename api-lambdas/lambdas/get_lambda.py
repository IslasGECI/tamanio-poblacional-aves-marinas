from scipy.optimize import curve_fit
import numpy as np


def power_law(T, Lambda, No):
    return No * np.power(Lambda, T)

def get_lambdas(temporadas, maximo_nidos):
    temporadas = np.array(temporadas)
    numero_agno = temporadas - temporadas[0]
    maximo_nidos = np.array(maximo_nidos)
    popt, pcov = curve_fit(power_law, numero_agno.astype('float64'), maximo_nidos.astype('float64'))
    return popt
