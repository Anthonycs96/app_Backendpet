import HorarioAtencion from '../../models/HorarioAtencion.js';

export const adminHorarioController = {
    crearHorario: async (req, res) => {
        try {
            // Lógica para crear horario
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Error interno" });
        }
    },
    // ...otros métodos
};