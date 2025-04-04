import bcrypt from "bcryptjs";
import Usuario from "../usuario.model.js";
import { Op } from "sequelize";
import UsuarioVeterinaria from "../../usuarioVeterinaria/usuarioVeterinaria.model.js";
import sequelize from './../../../config/database.js';

// 🚀 1️⃣ Aprobar un usuario
export const aprobarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { aprobadoPor } = req.body;

        // Verificar que el aprobador sea un administrador o superadmin
        const aprobador = await Usuario.findByPk(aprobadoPor);
        if (!aprobador || !['Administrador', 'superadmin'].includes(aprobador.rol)) {
            return res.status(403).json({ error: "No tienes permisos para aprobar usuarios" });
        }

        const usuario = await Usuario.findByPk(id);
        if (!usuario) return res.status(404).json({ error: "Usuario no encontrado." });

        // Solo se puede aprobar si está en estado pendiente
        if (usuario.estadoRegistro !== 'pendiente') {
            return res.status(400).json({ error: "El usuario ya ha sido procesado" });
        }

        await usuario.update({
            estadoRegistro: 'aprobado',
            aprobadoPor: aprobadoPor
        });

        res.json({ message: "Usuario aprobado con éxito", usuario });
    } catch (error) {
        console.error("❌ Error al aprobar usuario:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// 🚀 2️⃣ Rechazar un usuario
export const rechazarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { rechazadoPor } = req.body;

        // Verificar que el rechazador sea un administrador o superadmin
        const rechazador = await Usuario.findByPk(rechazadoPor);
        if (!rechazador || !['Administrador', 'superadmin'].includes(rechazador.rol)) {
            return res.status(403).json({ error: "No tienes permisos para rechazar usuarios" });
        }

        const usuario = await Usuario.findByPk(id);
        if (!usuario) return res.status(404).json({ error: "Usuario no encontrado." });

        // Solo se puede rechazar si está en estado pendiente
        if (usuario.estadoRegistro !== 'pendiente') {
            return res.status(400).json({ error: "El usuario ya ha sido procesado" });
        }

        await usuario.update({
            estadoRegistro: 'rechazado',
            aprobadoPor: aprobadoPor
        });

        res.json({ message: "Usuario rechazado con éxito", usuario });
    } catch (error) {
        console.error("❌ Error al rechazar usuario:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// 🚀 3️⃣ Eliminar un usuario
export const eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const usuarioAutenticado = req.usuario; // viene del verifyToken

        // 🔒 Validar que solo el usuario autenticado pueda editarse a sí mismo
        if (String(id) !== String(usuarioAutenticado.id)) {
            return res.status(403).json({ error: "Solo puedes editar tu propia cuenta." });
        }

        const usuario = await Usuario.findByPk(id);
        if (!usuario) return res.status(404).json({ error: "Usuario no encontrado." });

        await usuario.update({
            notificaciones: "0",
            rol: "NULL",
            estado: "inactivo",
        });
        res.json({ message: "Usuario eliminado con éxito" });
    } catch (error) {
        console.error("❌ Error al eliminar usuario:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// 🚀 4️⃣ Eliminar un usuario por administrador
export const eliminarUsuarioAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        const usuario = await Usuario.findByPk(id);
        if (!usuario) return res.status(404).json({ error: "Usuario no encontrado." });

        await usuario.destroy();
        res.json({ message: "Usuario eliminado con éxito" });
    } catch (error) {
        console.error("❌ Error al eliminar usuario:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// 🚀 5️⃣ Aprobar un administrador
export const aprobarAdministrador = async (req, res) => {
    try {
        const { id } = req.params; // ID del usuario a modificar
        const usuarioAutenticado = req.usuario; // Usuario logueado que hace la solicitud

        // 🔒 Validar que solo un SUPERADMIN pueda aprobar administradores
        if (usuarioAutenticado.rol !== "Superadmin") {
            return res.status(403).json({ error: "Solo un superadmin puede aprobar administradores." });
        }

        // 📌 Buscar el usuario que se quiere modificar
        const usuario = await Usuario.findByPk(id);
        if (!usuario) return res.status(404).json({ error: "Usuario no encontrado." });

        // 🚫 No permitir cambios en superadmin
        if (usuario.rol === "Superadmin") {
            return res.status(403).json({ error: "No puedes modificar a un Superadmin." });
        }

        // ✅ Actualizar el usuario a "Administrador"
        await usuario.update({ rol: "Administrador" });

        res.json({ message: "Administrador aprobado con éxito", usuario });
    } catch (error) {
        console.error("❌ Error al aprobar usuario:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// 🚀 6️⃣ Actualizar sueldo y rol
export const actualizarsueldorol = async (req, res) => {
    try {
        const { id } = req.params;
        const { sueldo, rol
        } = req.body;

        const usuario = await Usuario.findByPk(id);
        if (!usuario) return res.status(404).json({ error: "Usuario no encontrado." });

        await usuario.update({
            sueldo: sueldo || usuario.sueldo,
            rol: rol || usuario.rol,
        });

        res.json({ message: "Usuario actualizado con éxito", usuario });
    } catch (error) {
        console.error("❌ Error al actualizar usuario:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// 🚀 7️⃣ Actualizar especialidad
export const actualizarEspecialidad = async (req, res) => {
    try {
        const { id } = req.params;
        const { especialidad
        } = req.body;

        const usuario = await Usuario.findByPk(id);
        if (!usuario) return res.status(404).json({ error: "Usuario no encontrado." });

        await usuario.update({
            especialidad: especialidad || usuario.especialidad,
        });

        res.json({ message: "Usuario actualizado con éxito", usuario });
    } catch (error) {
        console.error("❌ Error al actualizar usuario:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};