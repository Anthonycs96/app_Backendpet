import Veterinaria from "../../veterinaria.model.js";
import Servicio from "../../../servicio/servicio.model.js";
import HorarioAtencion from "../../../horario/horario.model.js";
import Cita from "../../../cita/cita.model.js";
import { Op } from "sequelize";

export const veterinarioVeterinariaController = {
    // Consultar horario del veterinario
    consultarMiHorario: async (req, res) => {
        try {
            const veterinario_id = req.user.id;

            const horarios = await HorarioAtencion.findAll({
                include: [{
                    model: Veterinaria,
                    attributes: ['nombre']
                }],
                where: { veterinario_id }
            });

            res.json({ horarios });
        } catch (error) {
            console.error("❌ Error:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    // Actualizar horario personal
    actualizarMiHorario: async (req, res) => {
        try {
            const veterinario_id = req.user.id;
            const { horarios } = req.body;

            // Validar formato de horarios
            if (!Array.isArray(horarios)) {
                return res.status(400).json({
                    error: "Formato de horarios inválido"
                });
            }

            // Actualizar horarios
            const actualizaciones = await Promise.all(
                horarios.map(async (horario) => {
                    const { dia_semana, hora_inicio, hora_fin } = horario;
                    return await HorarioAtencion.upsert({
                        veterinario_id,
                        dia_semana,
                        hora_inicio,
                        hora_fin,
                        updatedBy: veterinario_id
                    });
                })
            );

            res.json({
                message: "Horario actualizado exitosamente",
                actualizaciones
            });
        } catch (error) {
            console.error("❌ Error:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    // Listar servicios asignados
    listarMisServicios: async (req, res) => {
        try {
            const veterinario_id = req.user.id;

            const servicios = await Servicio.findAll({
                where: { veterinario_id },
                attributes: ['id', 'nombre', 'descripcion', 'duracion']
            });

            res.json({ servicios });
        } catch (error) {
            console.error("❌ Error:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    // Actualizar disponibilidad de servicios
    actualizarDisponibilidad: async (req, res) => {
        try {
            const veterinario_id = req.user.id;
            const { servicio_id, disponible } = req.body;

            const servicio = await Servicio.findOne({
                where: {
                    id: servicio_id,
                    veterinario_id
                }
            });

            if (!servicio) {
                return res.status(404).json({
                    error: "Servicio no encontrado o no autorizado"
                });
            }

            await servicio.update({
                disponible,
                updatedBy: veterinario_id
            });

            res.json({
                message: "Disponibilidad actualizada exitosamente",
                servicio
            });
        } catch (error) {
            console.error("❌ Error:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    // Obtener estadísticas personales
    obtenerEstadisticasPersonales: async (req, res) => {
        try {
            const veterinario_id = req.user.id;
            const { fechaInicio, fechaFin } = req.query;

            const where = {
                veterinario_id,
                fecha: {}
            };

            if (fechaInicio && fechaFin) {
                where.fecha = {
                    [Op.between]: [new Date(fechaInicio), new Date(fechaFin)]
                };
            }

            const estadisticas = {
                // Total de citas
                totalCitas: await Cita.count({ where }),

                // Citas por estado
                citasPorEstado: await Cita.findAll({
                    where,
                    attributes: [
                        'estado',
                        [sequelize.fn('COUNT', '*'), 'total']
                    ],
                    group: ['estado']
                }),

                // Servicios más realizados
                serviciosPopulares: await Servicio.findAll({
                    include: [{
                        model: Cita,
                        where,
                        attributes: []
                    }],
                    attributes: [
                        'nombre',
                        [sequelize.fn('COUNT', '*'), 'total']
                    ],
                    group: ['Servicio.id'],
                    limit: 5
                })
            };

            res.json({ estadisticas });
        } catch (error) {
            console.error("❌ Error:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
};

export default veterinarioVeterinariaController;