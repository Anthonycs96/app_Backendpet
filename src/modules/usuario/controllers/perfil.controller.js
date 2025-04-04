import bcrypt from "bcryptjs";
import Usuario from "../usuario.model.js";
import { Op } from "sequelize";
import UsuarioVeterinaria from "../../usuarioVeterinaria/usuarioVeterinaria.model.js";
import sequelize from './../../../config/database.js';

// 🚀 1️⃣  Obtener un perfil por ID
export const perfilPorId = async (req, res) => {
    try {
        const { id } = req.params; // ID del usuario en la URL
        const usuarioAutenticado = req.usuario; // Usuario autenticado que hace la petición

        // 🔐 Verificar que `req.usuario` está definido
        if (!usuarioAutenticado) {
            console.log("❌ Error: Usuario no autenticado.");
            return res.status(401).json({ error: "Usuario no autenticado. Verifica tu token." });
        }

        const idToken = String(usuarioAutenticado.id); // ID del usuario autenticado como string
        const rolUsuario = usuarioAutenticado.rol ? usuarioAutenticado.rol.toLowerCase() : ""; // Normalizamos el rol

        console.log(`🔍 Usuario autenticado ID: ${idToken}, Rol: ${rolUsuario}`);

        // 🔒 Validar permisos: Puede acceder si es el mismo usuario o si es admin/superadmin
        if (idToken !== String(id) && rolUsuario !== "administrador" && rolUsuario !== "superadmin") {
            console.log(`❌ Acceso denegado. El usuario con ID ${idToken} y rol ${rolUsuario} intentó acceder al usuario ${id}.`);
            return res.status(403).json({ error: "No tienes permiso para ver esta información." });
        }

        // 🔍 Buscar el usuario en la base de datos (excluyendo la contraseña)
        const usuario = await Usuario.findByPk(id, { attributes: { exclude: ["password"] } });

        if (!usuario) {
            console.log(`❌ Usuario con ID ${id} no encontrado.`);
            return res.status(404).json({ error: "Usuario no encontrado." });
        }

        console.log(`✅ Usuario encontrado: ${usuario.id}`);
        res.json({ usuario });

    } catch (error) {
        console.error("❌ Error al obtener usuario:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// 🚀 2️⃣ Actualizar perfil por ID
export const actualizarPerfilId = async (req, res) => {
    try {
        const { id } = req.params;
        const usuarioAutenticado = req.usuario; // viene del verifyToken

        // 🔒 Validar que solo el usuario autenticado pueda editarse a sí mismo
        if (String(id) !== String(usuarioAutenticado.id)) {
            return res.status(403).json({ error: "Solo puedes editar tu propia cuenta." });
        }

        const usuario = await Usuario.findByPk(id);
        if (!usuario) return res.status(404).json({ error: "Usuario no encontrado." });


        const { nombre, email, telefono, rol, estado, direccion,
            documentoIdentidad, especialidad, horarioDisponibilidad, fotoPerfil, direccionClinica, notificaciones, fechaNacimiento
        } = req.body;


        await usuario.update({
            nombre: nombre || usuario.nombre,
            email: email || usuario.email,
            telefono: telefono || usuario.telefono,
            direccion: direccion || usuario.direccion,
            documentoIdentidad: documentoIdentidad || usuario.documentoIdentidad,
            horarioDisponibilidad: horarioDisponibilidad || usuario.horarioDisponibilidad,
            fotoPerfil: fotoPerfil || usuario.fotoPerfil,
            notificaciones: notificaciones || usuario.notificaciones,
            fechaNacimiento: fechaNacimiento || usuario.fechaNacimiento
        });

        res.json({ message: "Usuario actualizado con éxito", usuario });
    } catch (error) {
        console.error("❌ Error al actualizar usuario:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};