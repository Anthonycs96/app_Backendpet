import bcrypt from "bcryptjs";
import Usuario from "../usuario.model.js";
import { Op } from "sequelize";
import UsuarioVeterinaria from "../../usuarioVeterinaria/usuarioVeterinaria.model.js";
import sequelize from '../../../config/database.js';

// 1️⃣ 🚀 Obtener todos los usuarios
export const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({ attributes: { exclude: ["password"] } });
        res.json({ usuarios });
    } catch (error) {
        console.error("❌ Error al obtener usuarios:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
// 2️⃣ 🚀 Obtener usuarios pendientes
export const obtenerUsuariosPendientes = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            where: { estadoRegistro: 'pendiente' },
            attributes: { exclude: ['password'] }
        });
        res.json({ usuarios });
    } catch (error) {
        console.error("❌ Error al obtener usuarios pendientes:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// 3️⃣ 🚀 Obtener usuarios por rol
export const obtenerUsuariosPorRol = async (req, res) => {
    try {
        const { rol } = req.params;

        const usuarios = await Usuario.findAll({
            where: { rol },
            attributes: { exclude: ["password"] },
        });

        res.json({ usuarios });
    } catch (error) {
        console.error("❌ Error al obtener usuarios por rol:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// 4️⃣ 🚀 Obtener estadísticas de usuarios por estado
export const obtenerEstadisticasUsuariosPorEstado = async (req, res) => {
    try {
        const estadisticas = await Usuario.findAll({
            attributes: [
                'estadoRegistro',
                'rol',
                'especialidad',
                [sequelize.fn('COUNT', sequelize.col('id')), 'cantidad']
            ],
            group: ['estadoRegistro', 'rol', 'especialidad']
        });

        res.json({ estadisticas });
    } catch (error) {
        console.error("❌ Error al obtener estadísticas de usuarios:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// 5️⃣ 🚀 Obtener estadísticas generales
export const obtenerEstadisticasGenerales = async (req, res) => {
    try {
        // 🔢 Contar usuarios por estadoRegistro
        const usuariosPorEstado = await Usuario.findAll({
            attributes: [
                "estadoRegistro",
                [sequelize.fn("COUNT", sequelize.col("id")), "cantidad"]
            ],
            group: ["estadoRegistro"]
        });

        // 🔢 Contar usuarios por especialidad (opcional pero útil)
        const usuariosPorEspecialidad = await Usuario.findAll({
            attributes: [
                "especialidad",
                [sequelize.fn("COUNT", sequelize.col("id")), "cantidad"]
            ],
            group: ["especialidad"]
        });

        // 🔢 Contar usuarios por rol (opcional pero útil)
        const usuariosPorRol = await Usuario.findAll({
            attributes: [
                "rol",
                [sequelize.fn("COUNT", sequelize.col("id")), "cantidad"]
            ],
            group: ["rol"]
        });

        // 🏥 Contar veterinarias totales
        // const totalVeterinarias = await Veterinaria.count();

        res.json({
            usuariosPorEstado,
            usuariosPorRol,
            usuariosPorEspecialidad,
            // totalVeterinarias
        });

    } catch (error) {
        console.error("❌ Error al obtener estadísticas generales:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};