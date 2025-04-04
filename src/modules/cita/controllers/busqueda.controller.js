import Cita from "../../cita/cita.model.js";
import Paciente from "../../paciente/paciente.model.js";
import Usuario from "../../usuario/usuario.model.js";
import Servicio from "../../servicio/servicio.model.js";

// 1 🚀 Obtener el número total de citas
export const obtenerNumeroCitas = async (req, res) => {
    try {
        const totalCitas = await Cita.count(); // Contar el total de citas
        res.json({ totalCitas });
    } catch (error) {
        console.error("❌ Error al obtener el número de citas:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// 2 🚀 Obtener estadísticas por veterinaria
export const obtenerEstadisticasPorVeterinaria = async (req, res) => {
    try {
        const { veterinariaId } = req.params;

        const totalCitas = await Cita.count({ where: { veterinariaId } });
        const citasAtendidas = await Cita.count({ where: { veterinariaId, estado: 'Atendida' } });
        const citasCanceladas = await Cita.count({ where: { veterinariaId, estado: 'Cancelada' } });
        const ingresosTotales = await Cita.sum('precio', { where: { veterinariaId } });

        return res.status(200).json({
            success: true,
            veterinariaId,
            totalCitas,
            citasAtendidas,
            citasCanceladas,
            ingresosTotales
        });
    } catch (error) {
        console.error("❌ Error al obtener estadísticas por veterinaria:", error);
        return res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
};

// 3 🚀 Obtener citas por veterinaria
export const obtenerCitasPorVeterinaria = async (req, res) => {
    try {
        const { veterinariaId } = req.params;

        const citas = await Cita.findAll({
            where: { veterinariaId },
            include: [
                { model: Paciente, attributes: ["id", "nombre"] },
                { model: Usuario, as: "Veterinario", attributes: ["id", "nombre"] },
                { model: Servicio, attributes: ["id", "nombre"] },
            ],
            limit: 100, // Paginación, limita a 100 resultados
        });

        res.json({ citas });
    } catch (error) {
        console.error("❌ Error al obtener citas por veterinaria:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// 4 🚀 Obtener citas por estado
export const obtenerCitasPorEstado = async (req, res) => {
    try {
        const { estado } = req.params;

        const citas = await Cita.findAll({
            where: { estado },
            include: [
                { model: Paciente, attributes: ["id", "nombre"] },
                { model: Usuario, as: "Veterinario", attributes: ["id", "nombre"] },
                { model: Servicio, attributes: ["id", "nombre"] },
            ],
            limit: 100, // Paginación, limita a 100 resultados
        });

        res.json({ citas });
    } catch (error) {
        console.error("❌ Error al obtener citas por estado:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// 5 🚀 Obtener citas de un paciente
export const obtenerCitasPorPaciente = async (req, res) => {
    try {
        const { id } = req.params;

        const citas = await Cita.findAll({
            where: { paciente_id: id },
            include: [
                { model: Usuario, as: "Veterinario", attributes: ["id", "nombre"] },
                { model: Servicio, attributes: ["id", "nombre"] },
            ],
            limit: 100, // Paginación, limita a 100 resultados
        });

        res.json({ citas });
    } catch (error) {
        console.error("❌ Error al obtener citas del paciente:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// 6 🚀 Obtener citas de un veterinario
export const obtenerCitasPorVeterinario = async (req, res) => {
    try {
        const { id } = req.params;

        const citas = await Cita.findAll({
            where: { veterinario_id: id },
            include: [
                { model: Paciente, attributes: ["id", "nombre"] },
                { model: Servicio, attributes: ["id", "nombre"] },
            ],
            limit: 100, // Paginación, limita a 100 resultados
        });

        res.json({ citas });
    } catch (error) {
        console.error("❌ Error al obtener citas del veterinario:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};