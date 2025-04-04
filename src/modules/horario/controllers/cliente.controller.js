import HorarioAtencion from "../../horario/horario.model.js";
import Veterinaria from "../../veterinaria/veterinaria.model.js";
import { Op } from "sequelize";

// 1 🚀 Verificar disponibilidad
export const verificarDisponibilidad = async (req, res) => {
    try {
        const { veterinaria_id } = req.params;
        const { dia_semana, hora, fecha } = req.query;

        // Validar que la veterinaria existe
        const veterinaria = await Veterinaria.findByPk(veterinaria_id);
        if (!veterinaria) {
            return res.status(404).json({ error: "Veterinaria no encontrada" });
        }

        // Verificar si es un día festivo
        const esFestivo = await verificarDiaFestivo(fecha);

        const horario = await HorarioAtencion.findOne({
            where: {
                veterinaria_id,
                dia_semana,
                es_feriado: esFestivo,
                hora_inicio: { [Op.lte]: hora },
                hora_fin: { [Op.gte]: hora }
            }
        });

        // Verificar citas existentes
        const hayDisponibilidad = await verificarCitasExistentes(veterinaria_id, fecha, hora);

        const respuesta = {
            disponible: Boolean(horario && hayDisponibilidad),
            horario: horario ? {
                inicio: horario.hora_inicio,
                fin: horario.hora_fin
            } : null,
            esFestivo,
            mensaje: obtenerMensajeDisponibilidad(horario, hayDisponibilidad, esFestivo)
        };

        res.json(respuesta);

    } catch (error) {
        console.error("❌ Error al verificar disponibilidad:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// 2 🚀 Obtener horarios de la semana
export const obtenerHorariosSemana = async (req, res) => {
    try {
        const { veterinaria_id } = req.params;

        const horarios = await HorarioAtencion.findAll({
            where: { veterinaria_id },
            order: [
                ['dia_semana', 'ASC'],
                ['hora_inicio', 'ASC']
            ]
        });

        const horariosPorDia = horarios.reduce((acc, horario) => {
            if (!acc[horario.dia_semana]) {
                acc[horario.dia_semana] = [];
            }
            acc[horario.dia_semana].push({
                id: horario.id,
                inicio: horario.hora_inicio,
                fin: horario.hora_fin,
                esFeriado: horario.es_feriado
            });
            return acc;
        }, {});

        res.json(horariosPorDia);

    } catch (error) {
        console.error("❌ Error al obtener horarios de la semana:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};