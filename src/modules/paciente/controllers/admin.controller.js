import Paciente from "../paciente.model.js";
import Usuario from "../../usuario/usuario.model.js";
import { Op } from "sequelize";

// 🔒 Obtener todos los pacientes (con paginación y filtros avanzados)
export const listarTodos = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            order = 'DESC',
            veterinaria_id,
            estado
        } = req.query;

        const offset = (page - 1) * limit;
        const where = {};

        if (veterinaria_id) where.veterinaria_id = veterinaria_id;
        if (estado) where.estado = estado;

        const { count, rows: pacientes } = await Paciente.findAndCountAll({
            where,
            include: [
                {
                    model: Usuario,
                    as: "propietario",
                    attributes: ["id", "nombre", "email"]
                },
                {
                    model: Usuario,
                    as: "veterinarioAsignado",
                    attributes: ["id", "nombre", "especialidad"]
                }
            ],
            order: [[sortBy, order]],
            limit,
            offset,
        });

        res.json({
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page),
            pacientes
        });
    } catch (error) {
        console.error("❌ Error en listarTodos:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// 🔒 Generar reporte de pacientes
export const generarReporte = async (req, res) => {
    try {
        const { fechaInicio, fechaFin, veterinaria_id } = req.query;

        const where = {};
        if (fechaInicio && fechaFin) {
            where.createdAt = {
                [Op.between]: [new Date(fechaInicio), new Date(fechaFin)]
            };
        }
        if (veterinaria_id) where.veterinaria_id = veterinaria_id;

        const estadisticas = await Paciente.findAll({
            where,
            attributes: [
                'especie',
                [sequelize.fn('COUNT', '*'), 'total'],
                [sequelize.fn('AVG', sequelize.col('edad')), 'edadPromedio']
            ],
            group: ['especie']
        });

        res.json({ estadisticas });
    } catch (error) {
        console.error("❌ Error en generarReporte:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// 🔒 Asignar veterinario a paciente
export const asignarVeterinario = async (req, res) => {
    try {
        const { paciente_id, veterinario_id } = req.body;

        const paciente = await Paciente.findByPk(paciente_id);
        if (!paciente) {
            return res.status(404).json({ error: "Paciente no encontrado" });
        }

        const veterinario = await Usuario.findOne({
            where: { id: veterinario_id, rol: 'VETERINARIO' }
        });
        if (!veterinario) {
            return res.status(404).json({ error: "Veterinario no encontrado" });
        }

        await paciente.update({ veterinario_id });

        res.json({
            message: "Veterinario asignado exitosamente",
            paciente
        });
    } catch (error) {
        console.error("❌ Error en asignarVeterinario:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// 🔒 Eliminar paciente
export const eliminarPaciente = async (req, res) => {
    try {
        const { id } = req.params;
        const { veterinaria_id } = req.query;

        const paciente = await Paciente.findByPk(id);
        if (!paciente) {
            return res.status(404).json({ error: "Paciente no encontrado" });
        }

        if (veterinaria_id && paciente.veterinaria_id !== veterinaria_id) {
            return res.status(403).json({ error: "No autorizado para eliminar este paciente" });
        }

        await paciente.update({
            estado: 'Inactivo',
            updatedAt: new Date(),
            updatedBy: req.user.id
        });

        res.json({
            message: "Paciente eliminado exitosamente",
            paciente
        });
    } catch (error) {
        console.error("❌ Error en eliminarPaciente:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// 🔒 Buscar pacientes
export const buscarPacientes = async (req, res) => {
    try {
        const {
            nombre,
            especie,
            raza,
            propietario_id,
            veterinaria_id,
            estado,
            page = 1,
            limit = 10
        } = req.query;

        const offset = (page - 1) * limit;
        const where = {};

        if (nombre) where.nombre = { [Op.like]: `%${nombre}%` };
        if (especie) where.especie = especie;
        if (raza) where.raza = raza;
        if (propietario_id) where.propietario_id = propietario_id;
        if (veterinaria_id) where.veterinaria_id = veterinaria_id;
        if (estado) where.estado = estado;

        const { count, rows: pacientes } = await Paciente.findAndCountAll({
            where,
            include: [
                {
                    model: Usuario,
                    as: "propietario",
                    attributes: ["id", "nombre", "email"]
                },
                {
                    model: Usuario,
                    as: "veterinarioAsignado",
                    attributes: ["id", "nombre", "especialidad"]
                }
            ],
            order: [["createdAt", "DESC"]],
            limit,
            offset
        });

        res.json({
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page),
            pacientes
        });
    } catch (error) {
        console.error("❌ Error en buscarPacientes:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export default {
    listarTodos,
    eliminarPaciente,
    generarReporte,
    asignarVeterinario,
    buscarPacientes
};