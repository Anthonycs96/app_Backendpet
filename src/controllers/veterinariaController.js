import Veterinaria from "../models/Veterinaria.js";
import Usuario from "../models/Usuario.js";
import { Op } from "sequelize";
import { calcularDistancia } from "../utils/geoUtils.js";

// 🚀 Registrar una nueva veterinaria
export const registrarVeterinaria = async (req, res) => {
    try {
        const { nombre, direccion, telefono, email, administrador_id } = req.body;

        const administrador = await Usuario.findByPk(administrador_id);
        if (!administrador || administrador.rol !== "Administrador" && administrador.rol !== "superadmin") {
            return res.status(400).json({ error: "El administrador no existe o no tiene permisos." });
        }

        const nuevaVeterinaria = await Veterinaria.create({
            nombre,
            direccion,
            telefono,
            email,
            administrador_id,
            estado: "Activo",
        });

        res.status(201).json({ message: "Veterinaria registrada con éxito", veterinaria: nuevaVeterinaria });
    } catch (error) {
        console.error("❌ Error al registrar veterinaria:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// 🚀 Obtener todas las veterinarias
export const obtenerVeterinarias = async (req, res) => {
    try {
        const veterinarias = await Veterinaria.findAll({
            include: { model: Usuario, as: "Administrador", attributes: ["id", "nombre", "email"] },
        });

        res.json({ veterinarias });
    } catch (error) {
        console.error("❌ Error al obtener veterinarias:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// 🚀 Obtener una veterinaria por ID
export const obtenerVeterinariaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const veterinaria = await Veterinaria.findByPk(id, {
            include: { model: Usuario, as: "Administrador", attributes: ["id", "nombre", "email"] },
        });

        if (!veterinaria) return res.status(404).json({ error: "Veterinaria no encontrada." });

        res.json({ veterinaria });
    } catch (error) {
        console.error("❌ Error al obtener veterinaria:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// 🚀 Actualizar datos de una veterinaria
export const actualizarVeterinaria = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, direccion, telefono, email, estado, latitud, longitud } = req.body;

        const veterinaria = await Veterinaria.findByPk(id);
        if (!veterinaria) return res.status(404).json({ error: "Veterinaria no encontrada." });

        await veterinaria.update({
            nombre: nombre || veterinaria.nombre,
            direccion: direccion || veterinaria.direccion,
            telefono: telefono || veterinaria.telefono,
            email: email || veterinaria.email,
            estado: estado || veterinaria.estado,
            latitud: latitud || veterinaria.latitud,
            longitud: longitud || veterinaria.longitud,
        });

        res.json({ message: "Veterinaria actualizada con éxito", veterinaria });
    } catch (error) {
        console.error("❌ Error al actualizar veterinaria:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// 🚀 Eliminar una veterinaria (Solo administradores)
export const eliminarVeterinaria = async (req, res) => {
    try {
        const { id } = req.params;

        const veterinaria = await Veterinaria.findByPk(id);
        if (!veterinaria) return res.status(404).json({ error: "Veterinaria no encontrada." });

        await veterinaria.destroy();
        res.json({ message: "Veterinaria eliminada con éxito" });
    } catch (error) {
        console.error("❌ Error al eliminar veterinaria:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// 🚀 Obtener veterinarias cercanas por ubicación
export const obtenerVeterinariasCercanas = async (req, res) => {
    try {
        const { lat, lon, radio } = req.query;

        if (!lat || !lon || !radio) {
            return res.status(400).json({ error: "Debe proporcionar latitud, longitud y radio." });
        }

        const todasLasVeterinarias = await Veterinaria.findAll();

        const veterinariasCercanas = todasLasVeterinarias.filter((vet) => {
            if (!vet.latitud || !vet.longitud) return false;
            const distancia = calcularDistancia(lat, lon, vet.latitud, vet.longitud);
            return distancia <= radio;
        });

        res.json({ veterinarias: veterinariasCercanas });
    } catch (error) {
        console.error("❌ Error al obtener veterinarias cercanas:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
