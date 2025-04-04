import Servicio from "../../servicio/servicio.model.js";
import PrecioServicio from "../../servicio/PrecioServicio.js";

// Obtener servicios asignados
export const misServicios = async (req, res) => {
    try {
        const veterinario_id = req.user.id;

        const servicios = await Servicio.findAll({
            where: { veterinario_id },
            include: [{
                model: PrecioServicio,
                where: { estado: 'Activo' },
                required: false
            }]
        });

        res.json({ servicios });
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Actualizar disponibilidad
export const actualizarDisponibilidad = async (req, res) => {
    try {
        const { id } = req.params;
        const { disponible } = req.body;
        const veterinario_id = req.user.id;

        const servicio = await Servicio.findByPk(id);
        if (!servicio) {
            return res.status(404).json({ error: "Servicio no encontrado" });
        }

        if (servicio.veterinario_id !== veterinario_id) {
            return res.status(403).json({ error: "No autorizado para modificar este servicio" });
        }

        servicio.disponible = disponible;
        await servicio.save();

        res.json({ message: "Disponibilidad actualizada exitosamente", servicio });
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Obtener servicio por ID
export const obtenerServicio = async (req, res) => {
    try {
        const { id } = req.params;
        const veterinario_id = req.user.id;

        const servicio = await Servicio.findByPk(id, {
            include: [{
                model: PrecioServicio,
                where: { estado: 'Activo' },
                required: false
            }]
        });

        if (!servicio) {
            return res.status(404).json({ error: "Servicio no encontrado" });
        }

        if (servicio.veterinario_id !== veterinario_id) {
            return res.status(403).json({ error: "No autorizado para ver este servicio" });
        }

        res.json({ servicio });
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export default {
    misServicios,
    actualizarDisponibilidad,
    obtenerServicio
};