import HorarioAtencion from "../models/HorarioAtencion.js";
import Veterinaria from "../models/Veterinaria.js";
import { Op } from "sequelize";

// 🚀 Agregar un horario de atención a una veterinaria
export const agregarHorario = async (req, res) => {
    try {
        const { veterinaria_id, dia_semana, hora_inicio, hora_fin, es_feriado } = req.body;

        const veterinaria = await Veterinaria.findByPk(veterinaria_id);
        if (!veterinaria) return res.status(404).json({ error: "Veterinaria no encontrada." });

        // Crear horario
        const nuevoHorario = await HorarioAtencion.create({
            veterinaria_id,
            dia_semana,
            hora_inicio,
            hora_fin,
            es_feriado: es_feriado || false,
        });

        res.status(201).json({ message: "Horario agregado con éxito", horario: nuevoHorario });
    } catch (error) {
        console.error("❌ Error al agregar horario:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// 🚀 Obtener los horarios de una veterinaria
export const obtenerHorarios = async (req, res) => {
    try {
        const { veterinaria_id } = req.params;

        const horarios = await HorarioAtencion.findAll({
            where: { veterinaria_id },
            order: [["dia_semana", "ASC"]],
        });

        res.json({ horarios });
    } catch (error) {
        console.error("❌ Error al obtener horarios:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// 🚀 Eliminar un horario de una veterinaria
export const eliminarHorario = async (req, res) => {
    try {
        const { id } = req.params;

        const horario = await HorarioAtencion.findByPk(id);
        if (!horario) return res.status(404).json({ error: "Horario no encontrado." });

        await horario.destroy();
        res.json({ message: "Horario eliminado con éxito" });
    } catch (error) {
        console.error("❌ Error al eliminar horario:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// 🚀 Verificar disponibilidad de un horario
export const verificarDisponibilidad = async (req, res) => {
    try {
        const { veterinaria_id } = req.params;
        const { dia_semana, hora } = req.query;

        const horario = await HorarioAtencion.findOne({
            where: {
                veterinaria_id,
                dia_semana,
                es_feriado: false, // Solo buscamos días laborables
                hora_inicio: { [Op.lte]: hora },
                hora_fin: { [Op.gte]: hora },
            },
        });

        if (!horario) {
            return res.json({ disponible: false, message: "No hay disponibilidad en ese horario." });
        }

        res.json({ disponible: true, message: "La veterinaria está disponible en este horario." });
    } catch (error) {
        console.error("❌ Error al verificar disponibilidad:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
