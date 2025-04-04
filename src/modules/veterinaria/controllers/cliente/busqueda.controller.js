import Veterinaria from "../../veterinaria.model.js";
import { Op } from "sequelize";
import HorarioAtencion from "../../../horario/horario.model.js";
import Servicio from "../../../servicio/servicio.model.js";
import Usuario from "../../../usuario/usuario.model.js";

// Buscar veterinarias
export const buscarVeterinarias = async (req, res) => {
    try {
        const {
            nombre,
            direccion,
            servicio,
            page = 1,
            limit = 10
        } = req.query;

        const where = { estado: 'Activo' };
        if (nombre) where.nombre = { [Op.like]: `%${nombre}%` };
        if (direccion) where.direccion = { [Op.like]: `%${direccion}%` };

        const { count, rows: veterinarias } = await Veterinaria.findAndCountAll({
            where,
            include: [
                {
                    model: HorarioAtencion,
                    as: 'horarios'
                },
                {
                    model: Servicio,
                    as: 'servicios',
                    where: servicio ? { id: servicio } : undefined
                }
            ],
            limit,
            offset: (page - 1) * limit
        });

        res.json({
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page),
            veterinarias
        });
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Ver detalle de veterinaria
export const obtenerDetalleVeterinaria = async (req, res) => {
    try {
        const { id } = req.params;

        const veterinaria = await Veterinaria.findOne({
            where: {
                id,
                estado: 'Activo'
            },
            include: [
                {
                    model: HorarioAtencion,
                    as: 'horarios'
                },
                {
                    model: Servicio,
                    as: 'servicios'
                }
            ]
        });

        if (!veterinaria) {
            return res.status(404).json({ error: "Veterinaria no encontrada" });
        }

        res.json(veterinaria);
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Listar servicios
export const listarServicios = async (req, res) => {
    try {
        const { id } = req.params;

        const servicios = await Servicio.findAll({
            where: { veterinaria_id: id },
            include: [{ model: Veterinaria, as: 'veterinaria' }]
        });

        res.json({ servicios });
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Consultar horarios
export const consultarHorarios = async (req, res) => {
    try {
        const { id } = req.params;

        const horarios = await HorarioAtencion.findAll({
            where: { veterinaria_id: id },
            include: [{ model: Veterinaria, as: 'veterinaria' }]
        });

        res.json({ horarios });
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Valorar veterinaria
export const valorarVeterinaria = async (req, res) => {
    try {
        const { id } = req.params;
        const { valoracion, comentario } = req.body;

        const veterinaria = await Veterinaria.findByPk(id);
        if (!veterinaria) {
            return res.status(404).json({ error: "Veterinaria no encontrada" });
        }

        // Aquí iría la lógica para guardar la valoración
        // Esto es solo un ejemplo
        res.json({ message: "Valoración guardada exitosamente" });
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Obtener veterinarias visitadas
export const obtenerVeterinariasVisitadas = async (req, res) => {
    try {
        const { id } = req.user;

        // Aquí iría la lógica para obtener las veterinarias visitadas
        // Esto es solo un ejemplo
        res.json({ message: "Veterinarias visitadas" });
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};