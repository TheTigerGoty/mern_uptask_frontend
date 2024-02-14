export const formatearFecha = (fecha: string) => {
    const partesFecha = fecha.split('T')[0].split('-').map(Number);
    const nuevaFecha = new Date(partesFecha[0], partesFecha[1] - 1, partesFecha[2]);

    const opciones: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    return nuevaFecha.toLocaleDateString('es-ES', opciones)
}