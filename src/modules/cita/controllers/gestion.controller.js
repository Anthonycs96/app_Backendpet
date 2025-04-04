import Cita from "../../cita/cita.model.js";
import Paciente from "../../paciente/paciente.model.js";
import Usuario from "../../usuario/usuario.model.js";
import Servicio from "../../servicio/servicio.model.js";

// 1 🚀 Crear una nueva cita
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

// 2 🚀 Confirmar una cita
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

// 3 🚀 Marcar una cita como completada
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

// 4 🚀 Cancelar una cita con razón de cancelación
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

// 5 🚀 Reprogramar una cita
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

// 6 🚀 Marcar una cita como "No Asistió"
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
