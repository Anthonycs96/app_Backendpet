import bcrypt from "bcryptjs";
import Usuario from "../models/Usuario.js";
import { Op } from "sequelize";
import UsuarioVeterinaria from "../models/UsuarioVeterinaria.js";
import sequelize from '../config/database.js';


export const registrarUsuarioCliente = async (req, res) => {
    try {
        const {
            nombre,
            email,
            telefono,
            password,
            fechaNacimiento,
            documentoIdentidad,
            preguntaSecreta,
            respuestaSecreta,
            direccion,
        } = req.body;

        console.log("🔹 Datos del usuario:", {
            nombre,
            email,
            telefono,
            fechaNacimiento,
            documentoIdentidad,
            preguntaSecreta,
            respuestaSecreta,
            direccion,
        });

        // Verificar duplicados
        const existe = await Usuario.findOne({
            where: { [Op.or]: [{ email }, { telefono }] },
        });
        if (existe) {
            return res.status(400).json({ mensaje: "El usuario ya está registrado." });
        }

        // Hash de password + respuesta secreta
        const hashedPassword = await bcrypt.hash(password, 12);
        const hashedRespuesta = respuestaSecreta
            ? await bcrypt.hash(respuestaSecreta, 12)
            : null;

        // Crear usuario
        const nuevoUsuario = await Usuario.create({
            nombre,
            email,
            fechaNacimiento,
            documentoIdentidad,
            telefono,
            password: hashedPassword,
            preguntaSecreta,
            respuestaSecreta: hashedRespuesta,
            rol: "Cliente",
            direccion,
            estado: "activo",
            estadoRegistro: "aprobado",
        });

        return res.status(201).json({
            mensaje: "Usuario registrado con éxito",
            usuario: { id: nuevoUsuario.id, nombre, email, telefono },
        });
    } catch (error) {
        console.error("❌ Error al registrar usuario:", error);
        return res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};


export const registrarUsuarioClienteEnVeterinaria = async (req, res) => {
    try {
        const { nombre, email, telefono, password, rol, direccion, veterinariaId, preguntaSecreta, respuestaSecreta } = req.body;
        console.log("🔹 Datos del usuario:", { nombre, email, telefono, rol, direccion, veterinariaId, preguntaSecreta, respuestaSecreta });

        // 1️⃣ Si no hay rol, asignamos "Cliente" por defecto
        const rolAsignado = rol || "Cliente";

        // 2️⃣ Validamos que el rol sea válido
        const rolesPermitidos = [
            "Superadmin",
            "Administrador",
            "Veterinario",
            "Recepcionista",
            "Asistente Veterinario",
            "Personal de Servicios",
            "Encargado de Inventario",
            "Cliente",
        ];
        if (!rolesPermitidos.includes(rolAsignado)) {
            return res.status(400).json({ error: "Rol no permitido." });
        }

        // 3️⃣ Verificar si ya existe el usuario por email o teléfono
        let usuario = await Usuario.findOne({
            where: { [Op.or]: [{ email }, { telefono }] },
        });

        if (!usuario) {
            // 4️⃣ Si el usuario no existe, lo creamos
            const hashedPassword = bcrypt.hashSync(password, 12);
            // 4️⃣ Hashear la respuesta secreta (si se proporcionó)
            const hashedRespuestaSecreta = respuestaSecreta
                ? await bcrypt.hash(respuestaSecreta, 12)
                : null;

            usuario = await Usuario.create({
                nombre,
                email,
                telefono,
                password: hashedPassword,
                preguntaSecreta,
                respuestaSecreta: hashedRespuestaSecreta,
                rol: rolAsignado,
                direccion,
                estado: "activo",
                estadoRegistro: rolAsignado === "Cliente" ? "aprobado" : "pendiente"
            });

            console.log("✅ Usuario creado con éxito:", usuario.id);
        } else {
            console.log("⚠️ Usuario ya registrado, se procederá a asignarlo a la veterinaria.");
        }

        // 5️⃣ Verificar si ya está asignado en `usuarioveterinaria`
        const asignacionExistente = await UsuarioVeterinaria.findOne({
            where: {
                usuarioId: usuario.id,
                veterinariaId
            }
        });

        if (!asignacionExistente) {
            // 6️⃣ Si no está asignado, lo agregamos a la veterinaria
            await UsuarioVeterinaria.create({
                usuarioId: usuario.id,
                veterinariaId
            });

            console.log("✅ Usuario asignado a la veterinaria correctamente.");
        } else {
            console.log("⚠️ El usuario ya está registrado en esta veterinaria.");
        }

        res.status(201).json({
            message: "Usuario registrado y asignado a la veterinaria con éxito",
            usuario: {
                ...usuario.toJSON(),
                password: undefined
            }
        });
    } catch (error) {
        console.error("❌ Error al registrar usuario:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
// 🚀 Aprobar un usuario
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

// 🚀 Rechazar un usuario
export const rechazarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { aprobadoPor } = req.body;

        // Verificar que el aprobador sea un administrador o superadmin
        const aprobador = await Usuario.findByPk(aprobadoPor);
        if (!aprobador || !['Administrador', 'superadmin'].includes(aprobador.rol)) {
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

// 🚀 Obtener usuarios pendientes de aprobación
export const obtenerUsuariosPendientes = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            where: { estadoRegistro: 'pendiente' },
            attributes: { exclude: ['password'] }
        });
        res.json({ usuarios });
    } catch (error) {
        console.error("❌ Error al obtener usuarios pendientes:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// 🚀 Obtener todos los usuarios
export const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({ attributes: { exclude: ["password"] } });
        res.json({ usuarios });
    } catch (error) {
        console.error("❌ Error al obtener usuarios:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// 🚀 Obtener un usuario por ID
export const obtenerUsuarioPorId = async (req, res) => {
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
// 🚀 Actualizar usuario
export const actualizarUsuario = async (req, res) => {
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

// 🚀 Eliminar un usuario (Solo administradores)
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
// // 🚀 Eliminar un usuario (Solo administradores)
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

// 🚀 Filtrar usuarios por rol
export const obtenerUsuariosPorRol = async (req, res) => {
    try {
        const { rol } = req.params;

        const usuarios = await Usuario.findAll({
            where: { rol },
            attributes: { exclude: ["password"] },
        });

        res.json({ usuarios });
    } catch (error) {
        console.error("❌ Error al obtener usuarios por rol:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
// 🚀 Aprobar un cliente
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

// 🚀 Actualizar especialidad
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

// 🚀 Actualizar especialidad
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

// 🚀 Obtener estadísticas de usuarios por estado de registro
export const obtenerEstadisticasUsuariosPorEstado = async (req, res) => {
    try {
        const estadisticas = await Usuario.findAll({
            attributes: [
                'estadoRegistro',
                'rol',
                'especialidad',
                [sequelize.fn('COUNT', sequelize.col('id')), 'cantidad']
            ],
            group: ['estadoRegistro', 'rol', 'especialidad']
        });

        res.json({ estadisticas });
    } catch (error) {
        console.error("❌ Error al obtener estadísticas de usuarios:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const obtenerEstadisticasGenerales = async (req, res) => {
    try {
        // 🔢 Contar usuarios por estadoRegistro
        const usuariosPorEstado = await Usuario.findAll({
            attributes: [
                "estadoRegistro",
                [sequelize.fn("COUNT", sequelize.col("id")), "cantidad"]
            ],
            group: ["estadoRegistro"]
        });

        // 🔢 Contar usuarios por especialidad (opcional pero útil)
        const usuariosPorEspecialidad = await Usuario.findAll({
            attributes: [
                "especialidad",
                [sequelize.fn("COUNT", sequelize.col("id")), "cantidad"]
            ],
            group: ["especialidad"]
        });

        // 🔢 Contar usuarios por rol (opcional pero útil)
        const usuariosPorRol = await Usuario.findAll({
            attributes: [
                "rol",
                [sequelize.fn("COUNT", sequelize.col("id")), "cantidad"]
            ],
            group: ["rol"]
        });

        // 🏥 Contar veterinarias totales
        // const totalVeterinarias = await Veterinaria.count();

        res.json({
            usuariosPorEstado,
            usuariosPorRol,
            usuariosPorEspecialidad,
            // totalVeterinarias
        });

    } catch (error) {
        console.error("❌ Error al obtener estadísticas generales:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};