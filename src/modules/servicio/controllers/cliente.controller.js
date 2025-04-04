import Servicio from "../../servicio/servicio.model.js";
import PrecioServicio from "../../servicio/PrecioServicio.js";
import { Op } from "sequelize";

// Buscar servicios disponibles
export const buscarServicios = async (req, res) => {
    try {
        const { veterinaria_id, nombre } = req.query;

        const where = {};
        if (veterinaria_id) where.veterinaria_id = veterinaria_id;
        if (nombre) where.nombre = { [Op.like]: `%${nombre}%` };

        const servicios = await Servicio.findAll({
            where,
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

// Obtener detalle de servicio
export const obtenerDetalleServicio = async (req, res) => {
    try {
        const { id } = req.params;

        const servicio = await Servicio.findOne({
            where: { id },
            include: [{
                model: PrecioServicio,
                where: { estado: 'Activo' },
                required: false
            }]
        });

        if (!servicio) {
            return res.status(404).json({ error: "Servicio no encontrado" });
        }

        res.json(servicio);
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};