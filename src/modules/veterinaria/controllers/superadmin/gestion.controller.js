import Veterinaria from "../../veterinaria.model.js";
import Usuario from "../../../usuario/usuario.model.js";
import Cita from "../../../cita/cita.model.js";
import sequelize from "../../../../config/database.js";

export const crearVeterinaria = async (req, res) => {
    try {
        const {
            nombre,
            direccion,
            telefono,
            email,
            administrador_id,
            horarioAtencion,
            servicios
        } = req.body;

        // Validar administrador
        if (administrador_id) {
            const adminExists = await Usuario.findOne({
                where: {
                    id: administrador_id,
                    rol: 'Administrador'
                }
            });

            if (!adminExists) {
                return res.status(400).json({
                    error: "El administrador especificado no existe o no tiene el rol correcto"
                });
            }
        }

        const veterinaria = await Veterinaria.create({
            nombre,
            direccion,
            telefono,
            email,
            administrador_id,
            estado: 'Activo',
            createdBy: req.user.id
        });

        res.status(201).json({
            message: "Veterinaria creada exitosamente",
            veterinaria
        });
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const cambiarEstadoVeterinaria = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        const veterinaria = await Veterinaria.findByPk(id);
        if (!veterinaria) {
            return res.status(404).json({ error: "Veterinaria no encontrada" });
        }

        await veterinaria.update({
            estado,
            updatedBy: req.user.id
        });

        res.json({
            message: `Veterinaria ${estado === 'Activo' ? 'reactivada' : 'suspendida'} exitosamente`,
            veterinaria
        });
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

// 🚀 Obtener todas las veterinarias
export const obtenerVeterinarias = async (req, res) => {
    try {
        const veterinarias = await Veterinaria.findAll({
            include: { model: Usuario, as: "Administrador", attributes: ["id", "nombre", "email"] },
        });

        res.json({ veterinarias });
    } catch (error) {
        console.error("❌ Error al obtener veterinarias:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// 🚀 Obtener una veterinaria por ID
export const obtenerVeterinariaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const veterinaria = await Veterinaria.findByPk(id, {
            include: { model: Usuario, as: "Administrador", attributes: ["id", "nombre", "email"] },
        });

        if (!veterinaria) return res.status(404).json({ error: "Veterinaria no encontrada." });

        res.json({ veterinaria });
    } catch (error) {
        console.error("❌ Error al obtener veterinaria:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// 🚀 Actualizar datos de una veterinaria
export const actualizarVeterinaria = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, direccion, telefono, email, estado, latitud, longitud } = req.body;

        const veterinaria = await Veterinaria.findByPk(id);
        if (!veterinaria) return res.status(404).json({ error: "Veterinaria no encontrada." });

        await veterinaria.update({
            nombre: nombre || veterinaria.nombre,
            direccion: direccion || veterinaria.direccion,
            telefono: telefono || veterinaria.telefono,
            email: email || veterinaria.email,
            estado: estado || veterinaria.estado,
            latitud: latitud || veterinaria.latitud,
            longitud: longitud || veterinaria.longitud,
        });

        res.json({ message: "Veterinaria actualizada con éxito", veterinaria });
    } catch (error) {
        console.error("❌ Error al actualizar veterinaria:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// 🚀 Eliminar una veterinaria (Solo administradores)
export const eliminarVeterinaria = async (req, res) => {
    try {
        const { id } = req.params;

        const veterinaria = await Veterinaria.findByPk(id);
        if (!veterinaria) return res.status(404).json({ error: "Veterinaria no encontrada." });

        await veterinaria.destroy();
        res.json({ message: "Veterinaria eliminada con éxito" });
    } catch (error) {
        console.error("❌ Error al eliminar veterinaria:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// 🚀 Obtener reportes globales
export const obtenerReportesGlobales = async (req, res) => {
    try {
        // Obtener estadísticas generales
        const totalVeterinarias = await Veterinaria.count();
        const totalAdministradores = await Usuario.count({ where: { rol: 'Administrador' } });
        const totalVeterinarios = await Usuario.count({ where: { rol: 'Veterinario' } });

        // Obtener distribución por estado
        const distribucionEstados = await Veterinaria.findAll({
            attributes: [
                'estado',
                [sequelize.fn('COUNT', sequelize.col('id')), 'total']
            ],
            group: ['estado']
        });

        // Obtener veterinarias con más actividad
        const veterinariasActivas = await Veterinaria.findAll({
            include: [
                {
                    model: Cita,
                    attributes: [],
                    required: true
                }
            ],
            attributes: [
                'id',
                'nombre',
                [sequelize.fn('COUNT', sequelize.col('Citas.id')), 'total_citas']
            ],
            group: ['Veterinaria.id'],
            order: [[sequelize.fn('COUNT', sequelize.col('Citas.id')), 'DESC']],
            limit: 5
        });

        res.json({
            estadisticas: {
                totalVeterinarias,
                totalAdministradores,
                totalVeterinarios,
                distribucionEstados,
                veterinariasActivas
            }
        });
    } catch (error) {
        console.error("❌ Error al obtener reportes:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
