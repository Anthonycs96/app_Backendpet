import HorarioAtencion from '../horario.model.js';


export const consultarMisHorarios = async (req, res) => {
    try {
        const veterinario_id = req.user.id;
        const horarios = await HorarioAtencion.findAll({
            where: { veterinario_id }
        });
        res.json({ horarios });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Error interno" });
    }
}

export const actualizarDisponibilidad = async (req, res) => {
    try {
        const { dia_semana, hora_inicio, hora_fin } = req.body;
        const veterinario_id = req.user.id;
        await HorarioAtencion.upsert({
            veterinario_id,
            dia_semana,
            hora_inicio,
            hora_fin
        });
        res.json({ message: "Horario actualizado exitosamente" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Error interno" });
    }
}

export const obtenerMiHorario = async (req, res) => {
    try {
        const veterinario_id = req.user.id;
        const horarios = await HorarioAtencion.findAll({
            where: { veterinario_id }
        });
        res.json({ horarios });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Error interno" });
    }
}

export const verificarDisponibilidad = async (req, res) => {
    try {
        const { dia_semana, hora_inicio, hora_fin } = req.body;
        const veterinario_id = req.user.id;
        const horario = await HorarioAtencion.findOne({
            where: { veterinario_id, dia_semana }
        });
        if (horario) {
            res.json({ disponible: false });
        } else {
            res.json({ disponible: true });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Error interno" });
    }
}

export const obtenerHorariosSemana = async (req, res) => {
    try {
        const veterinario_id = req.user.id;
        const horarios = await HorarioAtencion.findAll({
            where: { veterinario_id }
        });
        res.json({ horarios });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Error interno" });
    }
}
