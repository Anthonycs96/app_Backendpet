import Cita from "../models/Cita.js";
import Paciente from "../models/Paciente.js";
import Usuario from "../models/Usuario.js";
import Servicio from "../models/Servicio.js";

// 🚀 Crear una nueva cita
export const crearCita = async (req, res) => {
    try {
        const { fecha_hora, paciente_id, veterinario_id, servicio_id, entrega_domicilio, urgente, nota } = req.body;

        // Validar que el paciente, veterinario y servicio existan
        const paciente = await Paciente.findByPk(paciente_id);
        if (!paciente) return res.status(404).json({ error: "Paciente no encontrado." });

        const veterinario = await Usuario.findByPk(veterinario_id);
        if (!veterinario) return res.status(404).json({ error: "Veterinario no encontrado." });

        const servicio = await Servicio.findByPk(servicio_id);
        if (!servicio) return res.status(404).json({ error: "Servicio no encontrado." });

        // Crear la cita
        const nuevaCita = await Cita.create({
            fecha_hora,
            paciente_id,
            veterinario_id,
            servicio_id,
            entrega_domicilio: entrega_domicilio || false,
            urgente: urgente || false,
            nota: nota || null,
        });

        // 🔔 Enviar recordatorio al cliente (WhatsApp o Email) - Enlace para integración futura
        // await enviarRecordatorio(paciente_id, nuevaCita);

        res.status(201).json({ message: "Cita creada con éxito", cita: nuevaCita });
    } catch (error) {
        console.error("❌ Error al crear cita:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// 🚀 Obtener citas por estado
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

// 🚀 Obtener citas de un paciente
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

// 🚀 Obtener citas de un veterinario
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

// 🚀 Confirmar una cita
export const confirmarCita = async (req, res) => {
    try {
        const { id } = req.params;

        const cita = await Cita.findByPk(id);
        if (!cita) return res.status(404).json({ error: "Cita no encontrada." });

        if (cita.estado !== "Pendiente") {
            return res.status(400).json({ error: "Solo se pueden confirmar citas en estado Pendiente." });
        }

        await cita.update({ estado: "Confirmada" });

        res.json({ message: "Cita confirmada con éxito", cita });
    } catch (error) {
        console.error("❌ Error al confirmar cita:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// 🚀 Marcar una cita como completada
export const completarCita = async (req, res) => {
    try {
        const { id } = req.params;
        const { Anotaciones } = req.body;

        const cita = await Cita.findByPk(id);
        if (!cita) return res.status(404).json({ error: "Cita no encontrada." });

        if (cita.estado !== "Confirmada") {
            return res.status(400).json({ error: "Solo se pueden completar citas en estado Confirmada." });
        }

        await cita.update({
            estado: "Completada",
            nota: Anotaciones || "Sin complicaciones",
        });

        res.json({ message: "Cita marcada como completada", cita });
    } catch (error) {
        console.error("❌ Error al completar cita:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// 🚀 Cancelar una cita con razón de cancelación
export const cancelarCita = async (req, res) => {
    try {
        const { id } = req.params;
        const { Anotaciones } = req.body;

        const cita = await Cita.findByPk(id);
        if (!cita) return res.status(404).json({ error: "Cita no encontrada." });

        await cita.update({
            estado: "Cancelada",
            nota: Anotaciones || "Cancelado sin razón especificada",
        });

        res.json({ message: "Cita cancelada con éxito", cita });
    } catch (error) {
        console.error("❌ Error al cancelar cita:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// 🚀 Reprogramar una cita
export const reprogramarCita = async (req, res) => {
    try {
        const { id } = req.params;
        const { nueva_fecha_hora } = req.body;

        const cita = await Cita.findByPk(id);
        if (!cita) return res.status(404).json({ error: "Cita no encontrada." });

        if (cita.estado === "Completada") {
            return res.status(400).json({ error: "No se puede reprogramar una cita ya completada." });
        }

        await cita.update({
            fecha_hora: nueva_fecha_hora,
            estado: "Pendiente",
        });

        res.json({ message: "Cita reprogramada con éxito", cita });
    } catch (error) {
        console.error("❌ Error al reprogramar cita:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// 🚀 Marcar una cita como "No Asistió"
export const marcarNoAsistio = async (req, res) => {
    try {
        const { id } = req.params;
        const { motivo } = req.body; // Se puede registrar un motivo de ausencia

        const cita = await Cita.findByPk(id);
        if (!cita) return res.status(404).json({ error: "Cita no encontrada." });

        if (cita.estado !== "Confirmada") {
            return res.status(400).json({ error: "Solo se pueden marcar citas confirmadas como no asistió." });
        }

        await cita.update({
            estado: "No Asistió",
            nota: motivo || "El paciente no asistió sin dar razón.",
        });

        res.json({ message: "Cita marcada como 'No Asistió'", cita });
    } catch (error) {
        console.error("❌ Error al marcar cita como no asistió:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// 🚀 Obtener el número total de citas
export const obtenerNumeroCitas = async (req, res) => {
    try {
        const totalCitas = await Cita.count(); // Contar el total de citas
        res.json({ totalCitas });
    } catch (error) {
        console.error("❌ Error al obtener el número de citas:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

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

