import Servicio from "../../servicio/servicio.model.js";
import PrecioServicio from "../../servicio/PrecioServicio.js";

// Crear servicio
const crearServicio = async (req, res) => {
    try {
        const {
            nombre,
            descripcion,
            duracion,
            veterinaria_id,
            precio
        } = req.body;

        const servicio = await Servicio.create({
            nombre,
            descripcion,
            duracion,
            veterinaria_id,
            createdBy: req.user.id
        });

        if (precio) {
            await PrecioServicio.create({
                servicio_id: servicio.id,
                veterinaria_id,
                precio,
                createdBy: req.user.id
            });
        }

        res.status(201).json({
            message: "Servicio creado exitosamente",
            servicio
        });
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Actualizar servicio
const actualizarServicio = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, duracion, precio } = req.body;

        const servicio = await Servicio.findByPk(id);
        if (!servicio) {
            return res.status(404).json({ error: "Servicio no encontrado" });
        }

        await servicio.update({
            nombre,
            descripcion,
            duracion,
            updatedBy: req.user.id
        });

        if (precio) {
            await PrecioServicio.update(
                { fecha_fin: new Date() },
                {
                    where: {
                        servicio_id: id,
                        estado: 'activo'
                    }
                }
            );

            await PrecioServicio.create({
                servicio_id: id,
                veterinaria_id: servicio.veterinaria_id,
                precio,
                createdBy: req.user.id
            });
        }

        res.json({
            message: "Servicio actualizado exitosamente",
            servicio
        });
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export default {
    crearServicio,
    actualizarServicio
};