import Servicio from "../models/Servicio.js";
import Veterinaria from "../models/Veterinaria.js";

// ✅ Crear un nuevo servicio
export const crearServicio = async (req, res) => {
    try {
        const { veterinaria_id, nombre, descripcion } = req.body;

        // Verificar si la veterinaria existe
        const veterinaria = await Veterinaria.findByPk(veterinaria_id);
        if (!veterinaria) {
            return res.status(404).json({ error: "La veterinaria no existe." });
        }

        // Crear el servicio
        const nuevoServicio = await Servicio.create({ veterinaria_id, nombre, descripcion });

        res.status(201).json({ mensaje: "Servicio creado exitosamente", servicio: nuevoServicio });
    } catch (error) {
        console.error("❌ Error al crear servicio:", error);
        res.status(500).json({ error: "Error interno del servidor", error: error.message });
    }
};

// ✅ Obtener todos los servicios
export const obtenerServicios = async (req, res) => {
    try {
        const servicios = await Servicio.findAll({
            include: { model: Veterinaria, as: "veterinaria" }
        });
        res.json(servicios);
    } catch (error) {
        console.error("❌ Error al obtener servicios:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// ✅ Obtener un servicio por ID
export const obtenerServicioPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const servicio = await Servicio.findByPk(id, {
            include: { model: Veterinaria, as: "veterinaria" }
        });

        if (!servicio) {
            return res.status(404).json({ error: "Servicio no encontrado." });
        }

        res.json(servicio);
    } catch (error) {
        console.error("❌ Error al obtener servicio:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// ✅ Actualizar un servicio
export const actualizarServicio = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;

        const servicio = await Servicio.findByPk(id);
        if (!servicio) {
            return res.status(404).json({ error: "Servicio no encontrado." });
        }

        await servicio.update({ nombre, descripcion });

        res.json({ mensaje: "Servicio actualizado exitosamente", servicio });
    } catch (error) {
        console.error("❌ Error al actualizar servicio:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// ✅ Eliminar un servicio
export const eliminarServicio = async (req, res) => {
    try {
        const { id } = req.params;
        const servicio = await Servicio.findByPk(id);

        if (!servicio) {
            return res.status(404).json({ error: "Servicio no encontrado." });
        }

        await servicio.destroy();

        res.json({ mensaje: "Servicio eliminado exitosamente" });
    } catch (error) {
        console.error("❌ Error al eliminar servicio:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
