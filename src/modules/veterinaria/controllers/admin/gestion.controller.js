import Veterinaria from "../../veterinaria.model.js";
import HorarioAtencion from "../../../horario/horario.model.js";
import Servicio from "../../../servicio/servicio.model.js";
import Usuario from "../../../usuario/usuario.model.js";

// Registrar una nueva veterinaria
export const registrarVeterinaria = async (req, res) => {
    try {
        const { nombre, direccion, telefono, email, administrador_id } = req.body;

        const administrador = await Usuario.findByPk(administrador_id);
        if (!administrador || administrador.rol !== "Administrador" && administrador.rol !== "superadmin") {
            return res.status(400).json({ error: "El administrador no existe o no tiene permisos." });
        }

        const nuevaVeterinaria = await Veterinaria.create({
            nombre,
            direccion,
            telefono,
            email,
            administrador_id,
            estado: "Activo",
        });

        res.status(201).json({ message: "Veterinaria registrada con éxito", veterinaria: nuevaVeterinaria });
    } catch (error) {
        console.error("❌ Error al registrar veterinaria:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Obtener mi veterinaria
export const obtenerMiVeterinaria = async (req, res) => {
    try {
        const { id } = req.user;
        const veterinaria = await Veterinaria.findOne({
            where: { administrador_id: id },
            include: [
                { model: Usuario, as: "Administrador" },
                { model: Servicio, as: "servicios" },
                { model: HorarioAtencion, as: "horarios" }
            ]
        });

        if (!veterinaria) {
            return res.status(404).json({ error: "Veterinaria no encontrada" });
        }

        res.json({ veterinaria });
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Actualizar veterinaria
export const actualizarVeterinaria = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, direccion, telefono, email } = req.body;

        const veterinaria = await Veterinaria.findByPk(id);
        if (!veterinaria) {
            return res.status(404).json({ error: "Veterinaria no encontrada" });
        }

        if (veterinaria.administrador_id !== req.user.id) {
            return res.status(403).json({ error: "No autorizado" });
        }

        await veterinaria.update({
            nombre,
            direccion,
            telefono,
            email,
            updatedBy: req.user.id
        });

        res.json({ message: "Veterinaria actualizada exitosamente", veterinaria });
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Agregar servicio
export const agregarServicio = async (req, res) => {
    try {
        const { nombre, descripcion, duracion, precio } = req.body;
        const { id } = req.user;

        const veterinaria = await Veterinaria.findOne({
            where: { administrador_id: id }
        });

        if (!veterinaria) {
            return res.status(404).json({ error: "Veterinaria no encontrada" });
        }

        const nuevoServicio = await Servicio.create({
            nombre,
            descripcion,
            duracion,
            precio,
            veterinaria_id: veterinaria.id,
            creadoPor: id
        });

        res.status(201).json({ message: "Servicio agregado exitosamente", servicio: nuevoServicio });
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Eliminar servicio
export const eliminarServicio = async (req, res) => {
    try {
        const { id: servicioId } = req.params;
        const { id: userId } = req.user;

        const servicio = await Servicio.findByPk(servicioId);
        if (!servicio) {
            return res.status(404).json({ error: "Servicio no encontrado" });
        }

        const veterinaria = await Veterinaria.findByPk(servicio.veterinaria_id);
        if (veterinaria.administrador_id !== userId) {
            return res.status(403).json({ error: "No autorizado" });
        }

        await servicio.destroy();
        res.json({ message: "Servicio eliminado exitosamente" });
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Actualizar horarios
export const actualizarHorarios = async (req, res) => {
    try {
        const { horarios } = req.body;
        const { id } = req.user;

        const veterinaria = await Veterinaria.findOne({
            where: { administrador_id: id }
        });

        if (!veterinaria) {
            return res.status(404).json({ error: "Veterinaria no encontrada" });
        }

        // Eliminar horarios existentes
        await HorarioAtencion.destroy({
            where: { veterinaria_id: veterinaria.id }
        });

        // Crear nuevos horarios
        const nuevosHorarios = await Promise.all(
            horarios.map(horario =>
                HorarioAtencion.create({
                    ...horario,
                    veterinaria_id: veterinaria.id,
                    creadoPor: id
                })
            )
        );

        res.json({ message: "Horarios actualizados exitosamente", horarios: nuevosHorarios });
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Listar personal
export const listarPersonal = async (req, res) => {
    try {
        const { id } = req.user;
        const veterinaria = await Veterinaria.findOne({
            where: { administrador_id: id },
            include: [
                {
                    model: Usuario,
                    as: "Personal",
                    where: { rol: "Veterinario" }
                }
            ]
        });

        if (!veterinaria) {
            return res.status(404).json({ error: "Veterinaria no encontrada" });
        }

        res.json({ personal: veterinaria.Personal });
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Agregar personal
export const agregarPersonal = async (req, res) => {
    try {
        const { email, nombre, telefono } = req.body;
        const { id } = req.user;

        const veterinaria = await Veterinaria.findOne({
            where: { administrador_id: id }
        });

        if (!veterinaria) {
            return res.status(404).json({ error: "Veterinaria no encontrada" });
        }

        // Verificar si el email ya existe
        const usuarioExistente = await Usuario.findOne({ where: { email } });
        if (usuarioExistente) {
            return res.status(400).json({ error: "El email ya está registrado" });
        }

        const nuevoUsuario = await Usuario.create({
            email,
            nombre,
            telefono,
            rol: "Veterinario",
            veterinaria_id: veterinaria.id,
            creadoPor: id
        });

        res.status(201).json({ message: "Personal agregado exitosamente", usuario: nuevoUsuario });
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Eliminar personal
export const eliminarPersonal = async (req, res) => {
    try {
        const { id: personalId } = req.params;
        const { id: userId } = req.user;

        const usuario = await Usuario.findByPk(personalId);
        if (!usuario) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        const veterinaria = await Veterinaria.findByPk(usuario.veterinaria_id);
        if (veterinaria.administrador_id !== userId) {
            return res.status(403).json({ error: "No autorizado" });
        }

        await usuario.destroy();
        res.json({ message: "Personal eliminado exitosamente" });
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
