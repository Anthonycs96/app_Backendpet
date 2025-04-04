import HorarioAtencion from "../../horario/horario.model.js";
import Veterinaria from "../../veterinaria/veterinaria.model.js";
import { Op } from "sequelize";

export const obtenerTodosLosHorarios = async (req, res) => {
    try {
        const { page = 1, limit = 10, veterinaria_id } = req.query;
        const offset = (page - 1) * limit;

        const where = {};
        if (veterinaria_id) {
            where.veterinaria_id = veterinaria_id;
        }

        const { count, rows: horarios } = await HorarioAtencion.findAndCountAll({
            where,
            include: [{
                model: Veterinaria,
                attributes: ['nombre', 'direccion']
            }],
            limit,
            offset,
            order: [
                ['veterinaria_id', 'ASC'],
                ['dia_semana', 'ASC'],
                ['hora_inicio', 'ASC']
            ]
        });

        res.json({
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            horarios
        });

    } catch (error) {
        console.error("❌ Error al obtener horarios:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const configurarDiasFestivos = async (req, res) => {
    try {
        const { dias_festivos } = req.body;

        // Validar formato de días festivos
        if (!Array.isArray(dias_festivos)) {
            return res.status(400).json({
                error: "El formato de días festivos es inválido"
            });
        }

        // Actualizar días festivos para todas las veterinarias
        const actualizaciones = await Promise.all(
            dias_festivos.map(async (dia) => {
                const { fecha, descripcion, aplica_todas_veterinarias } = dia;

                if (aplica_todas_veterinarias) {
                    // Actualizar todas las veterinarias
                    await HorarioAtencion.update(
                        {
                            es_feriado: true,
                            descripcion,
                            updatedBy: req.user.id
                        },
                        {
                            where: {
                                dia_semana: new Date(fecha).getDay()
                            }
                        }
                    );
                } else if (dia.veterinaria_id) {
                    // Actualizar solo una veterinaria específica
                    await HorarioAtencion.update(
                        {
                            es_feriado: true,
                            descripcion,
                            updatedBy: req.user.id
                        },
                        {
                            where: {
                                veterinaria_id: dia.veterinaria_id,
                                dia_semana: new Date(fecha).getDay()
                            }
                        }
                    );
                }

                return dia;
            })
        );

        res.json({
            message: "Días festivos configurados exitosamente",
            actualizaciones
        });

    } catch (error) {
        console.error("❌ Error al configurar días festivos:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const gestionarHorariosGlobales = async (req, res) => {
    try {
        const { configuracion } = req.body;
        const {
            hora_inicio_global,
            hora_fin_global,
            dias_laborables,
            excepciones
        } = configuracion;

        // Validar configuración
        if (!hora_inicio_global || !hora_fin_global || !dias_laborables) {
            return res.status(400).json({
                error: "Configuración incompleta"
            });
        }

        // Aplicar configuración global a todas las veterinarias
        const veterinarias = await Veterinaria.findAll({
            where: { estado: 'activo' }
        });

        await Promise.all(
            veterinarias.map(async (veterinaria) => {
                // Eliminar horarios existentes
                await HorarioAtencion.destroy({
                    where: { veterinaria_id: veterinaria.id }
                });

                // Crear nuevos horarios según configuración global
                await Promise.all(
                    dias_laborables.map(async (dia) => {
                        await HorarioAtencion.create({
                            veterinaria_id: veterinaria.id,
                            dia_semana: dia,
                            hora_inicio: hora_inicio_global,
                            hora_fin: hora_fin_global,
                            es_feriado: false,
                            createdBy: req.user.id
                        });
                    })
                );

                // Aplicar excepciones si existen
                if (excepciones && excepciones[veterinaria.id]) {
                    const excepcionVeterinaria = excepciones[veterinaria.id];
                    await HorarioAtencion.update(
                        {
                            hora_inicio: excepcionVeterinaria.hora_inicio,
                            hora_fin: excepcionVeterinaria.hora_fin,
                            updatedBy: req.user.id
                        },
                        {
                            where: {
                                veterinaria_id: veterinaria.id,
                                dia_semana: excepcionVeterinaria.dias
                            }
                        }
                    );
                }
            })
        );

        res.json({
            message: "Configuración global aplicada exitosamente",
            veterinarias_actualizadas: veterinarias.length
        });

    } catch (error) {
        console.error("❌ Error al gestionar horarios globales:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export default {
    obtenerTodosLosHorarios,
    configurarDiasFestivos,
    gestionarHorariosGlobales
};