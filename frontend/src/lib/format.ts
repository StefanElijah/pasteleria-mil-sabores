/**
 * Formatea un número como moneda local (Peso Chileno por defecto).
 * Ej: 1000 -> "1.000"
 */
export const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('es-CL', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
};

// En el futuro, puedes agregar aquí otras funciones relacionadas con formato:
// export const formatDate = (date: Date) => { ... }
// export const formatPercentage = (value: number) => { ... }