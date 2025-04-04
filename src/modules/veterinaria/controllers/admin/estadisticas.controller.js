import { Op } from "sequelize";
import Veterinaria from "../../veterinaria.model.js";
import HorarioAtencion from "../../../horario/horario.model.js";
import Servicio from "../../../servicio/servicio.model.js";
import Cita from "../../../cita/cita.model.js";
import Paciente from "../../../paciente/paciente.model.js";

export const adminVeterinariaController = {
    // Actualizar información de la veterinaria
    actualizarVeterinaria: async (req, res) => {
        try {
            const { id } = req.params;
            const {
                nombre,
                direccion,
                telefono,
                email,
                horarios,
                servicios
            } = req.body;

            const veterinaria = await Veterinaria.findByPk(id);
            if (!veterinaria) {
                return res.status(404).json({ error: "Veterinaria no encontrada" });
            }

            // Verificar que el admin pertenece a esta veterinaria
            if (veterinaria.administrador_id !== req.user.id) {
                return res.status(403).json({
                    error: "No autorizado para modificar esta veterinaria"
                });
            }

            await veterinaria.update({
                nombre,
                direccion,
                telefono,
                email,
                updatedBy: req.user.id
            });

            res.json({
                message: "Veterinaria actualizada exitosamente",
                veterinaria
            });
        } catch (error) {
            console.error("❌ Error:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    // Obtener estadísticas
    obtenerEstadisticas: async (req, res) => {
        try {
            const { id } = req.params;
            const { fechaInicio, fechaFin } = req.query;

            // Verificar permisos
            const veterinaria = await Veterinaria.findByPk(id);
            if (veterinaria.administrador_id !== req.user.id) {
                return res.status(403).json({
                    error: "No autorizado para ver estas estadísticas"
                });
            }

            // Aquí implementarías la lógica para obtener estadísticas
            const estadisticas = {
                // ... estadísticas
            };

            res.json(estadisticas);
        } catch (error) {
            console.error("❌ Error:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
};

export const estadisticasController = {
    // Obtener estadísticas generales
    obtenerEstadisticasGenerales: async (req, res) => {
        try {
            const { id } = req.params;
            const { fechaInicio, fechaFin } = req.query;

            // Verificar permisos
            const veterinaria = await Veterinaria.findByPk(id);
            if (veterinaria.administrador_id !== req.user.id) {
                return res.status(403).json({
                    error: "No autorizado para ver estas estadísticas"
                });
            }

            const fechaQuery = {};
            if (fechaInicio && fechaFin) {
                fechaQuery.createdAt = {
                    [Op.between]: [new Date(fechaInicio), new Date(fechaFin)]
                };
            }

            // Estadísticas de citas
            const citasStats = await Cita.findAll({
                where: {
                    veterinaria_id: id,
                    ...fechaQuery
                },
                attributes: [
                    'estado',
                    [sequelize.fn('COUNT', '*'), 'total']
                ],
                group: ['estado']
            });

            // Servicios más solicitados
            const serviciosPopulares = await Servicio.findAll({
                include: [{
                    model: Cita,
                    where: {
                        veterinaria_id: id,
                        ...fechaQuery
                    }
                }],
                attributes: [
                    'id', 'nombre',
                    [sequelize.fn('COUNT', sequelize.col('Citas.id')), 'total']
                ],
                group: ['Servicio.id'],
                order: [[sequelize.fn('COUNT', sequelize.col('Citas.id')), 'DESC']],
                limit: 5
            });

            // Pacientes nuevos
            const pacientesNuevos = await Paciente.count({
                where: {
                    veterinaria_id: id,
                    ...fechaQuery
                }
            });

            // Ingresos totales
            const ingresos = await Cita.sum('precio', {
                where: {
                    veterinaria_id: id,
                    estado: 'completada',
                    ...fechaQuery
                }
            });

            res.json({
                citasStats,
                serviciosPopulares,
                pacientesNuevos,
                ingresos
            });
        } catch (error) {
            console.error("❌ Error:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    // Obtener estadísticas mensuales
    obtenerEstadisticasMensuales: async (req, res) => {
        try {
            const { id } = req.params;
            const { año, mes } = req.query;

            const veterinaria = await Veterinaria.findByPk(id);
            if (veterinaria.administrador_id !== req.user.id) {
                return res.status(403).json({
                    error: "No autorizado"
                });
            }

            const inicioMes = new Date(año, mes - 1, 1);
            const finMes = new Date(año, mes, 0);

            const estadisticasMensuales = await Cita.findAll({
                where: {
                    veterinaria_id: id,
                    fecha: {
                        [Op.between]: [inicioMes, finMes]
                    }
                },
                attributes: [
                    [sequelize.fn('DATE', sequelize.col('fecha')), 'dia'],
                    [sequelize.fn('COUNT', '*'), 'total_citas'],
                    [sequelize.fn('SUM', sequelize.col('precio')), 'ingresos']
                ],
                group: [sequelize.fn('DATE', sequelize.col('fecha'))]
            });

            res.json(estadisticasMensuales);
        } catch (error) {
            console.error("❌ Error:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    // Obtener KPIs
    obtenerKPIs: async (req, res) => {
        try {
            const { id } = req.params;

            const veterinaria = await Veterinaria.findByPk(id);
            if (veterinaria.administrador_id !== req.user.id) {
                return res.status(403).json({ error: "No autorizado" });
            }

            // Últimos 30 días
            const fechaInicio = new Date();
            fechaInicio.setDate(fechaInicio.getDate() - 30);

            const kpis = {
                totalCitas: await Cita.count({
                    where: {
                        veterinaria_id: id,
                        createdAt: { [Op.gte]: fechaInicio }
                    }
                }),
                tasaAsistencia: await calcularTasaAsistencia(id, fechaInicio),
                satisfaccionCliente: await calcularSatisfaccionCliente(id, fechaInicio),
                ingresosPromedio: await calcularIngresosPromedio(id, fechaInicio)
            };

            res.json(kpis);
        } catch (error) {
            console.error("❌ Error:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
};

// Funciones auxiliares para cálculos
const calcularTasaAsistencia = async (veterinariaId, fechaInicio) => {
    const totalCitas = await Cita.count({
        where: {
            veterinaria_id: veterinariaId,
            fecha: { [Op.gte]: fechaInicio }
        }
    });

    const citasAsistidas = await Cita.count({
        where: {
            veterinaria_id: veterinariaId,
            fecha: { [Op.gte]: fechaInicio },
            estado: 'completada'
        }
    });

    return totalCitas > 0 ? (citasAsistidas / totalCitas) * 100 : 0;
};

const calcularSatisfaccionCliente = async (veterinariaId, fechaInicio) => {
    const valoraciones = await Cita.findAll({
        where: {
            veterinaria_id: veterinariaId,
            fecha: { [Op.gte]: fechaInicio },
            valoracion: { [Op.not]: null }
        },
        attributes: [[sequelize.fn('AVG', sequelize.col('valoracion')), 'promedio']]
    });

    return valoraciones[0].dataValues.promedio || 0;
};

const calcularIngresosPromedio = async (veterinariaId, fechaInicio) => {
    const ingresos = await Cita.findAll({
        where: {
            veterinaria_id: veterinariaId,
            fecha: { [Op.gte]: fechaInicio },
            estado: 'completada'
        },
        attributes: [[sequelize.fn('AVG', sequelize.col('precio')), 'promedio']]
    });

    return ingresos[0].dataValues.promedio || 0;
};

export default estadisticasController;