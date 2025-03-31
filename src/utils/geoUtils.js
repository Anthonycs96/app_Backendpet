// src/utils/geoUtils.js

import axios from 'axios';

/**
 * Calcula la distancia entre dos puntos geográficos usando la fórmula de Haversine.
 * @param {number} lat1 - Latitud del primer punto.
 * @param {number} lon1 - Longitud del primer punto.
 * @param {number} lat2 - Latitud del segundo punto.
 * @param {number} lon2 - Longitud del segundo punto.
 * @returns {number} Distancia en kilómetros.
 */
export function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distancia en km
}

/**
 * Convierte una dirección en coordenadas geográficas (latitud y longitud).
 * Usa la API de OpenStreetMap (Nominatim) o Google Maps.
 * @param {string} direccion - Dirección a geolocalizar.
 * @returns {Promise<{lat: number, lon: number}>} Coordenadas geográficas.
 */
export async function obtenerCoordenadas(direccion) {
    try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
            params: { q: direccion, format: 'json' }
        });
        if (response.data.length > 0) {
            return {
                lat: parseFloat(response.data[0].lat),
                lon: parseFloat(response.data[0].lon)
            };
        } else {
            throw new Error('No se encontraron coordenadas para la dirección dada.');
        }
    } catch (error) {
        console.error('Error obteniendo coordenadas:', error);
        throw error;
    }
}

/**
 * Valida si las coordenadas geográficas son correctas.
 * @param {number} lat - Latitud.
 * @param {number} lon - Longitud.
 * @returns {boolean} True si son válidas, false en caso contrario.
 */
export function validarCoordenadas(lat, lon) {
    return (
        typeof lat === 'number' && typeof lon === 'number' &&
        lat >= -90 && lat <= 90 &&
        lon >= -180 && lon <= 180
    );
}
