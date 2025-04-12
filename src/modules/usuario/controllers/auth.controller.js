import bcrypt from "bcryptjs";
import Usuario from "../usuario.model.js";
import { Op } from "sequelize";
import UsuarioVeterinaria from "../../usuarioVeterinaria/usuarioVeterinaria.model.js";
import sequelize from './../../../config/database.js';

import jwt from "jsonwebtoken";
import { rateLimit } from "express-rate-limit";

// Función para generar un código aleatorio de 6 dígitos
const generarCodigo = () => Math.floor(100000 + Math.random() * 900000).toString();

export const loginLimter = rateLimit({
    windowMs: 3 * 60 * 1000,
    max: 5,
    message: "Demasiados intentos fallidos, intenta nuevamente mas tarde.",
    standardHeaders: true,
    legacyHeaders: false,
});

const generarToken = (usuario) => {
    return jwt.sign(
        { id: usuario.id, rol: usuario.rol },
        process.env.JWT_SECRET,
        {
            algorithm: "HS256",
            expiresIn: process.env.JWT_EXPIRES_IN || "1h",
        }
    );
};

// 1 🚀 Login
export const login = async (req, res) => {
    try {
        const { email, telefono, password } = req.body;
        console.log("req.body", req.body);
        // 1️⃣ Validar que los datos no estén vacíos
        if (!email && !telefono || !password) {
            return res.status(400).json({ error: "Todos los campos son obligatorios." })
        }

        // 🔍 2️⃣ Buscar usuario por email o teléfono solo si existe uno de ellos
        const whereClause = {};
        if (email) whereClause.email = email;
        if (telefono) whereClause.telefono = telefono;

        const usuario = await Usuario.findOne({ where: whereClause });

        if (!usuario) {
            return res.status(401).json({ error: "Credenciales invaalidas" })
        }

        // 3️⃣ Verificar si el usuario está activo
        if (usuario.estado !== "activo") {
            return res.status(403).json({ error: "Su cuenta no está activa. Contacte con soporte." });
        }

        // 4️⃣ Comparar la contraseña con bcrypt
        const validPass = await bcrypt.compare(password, usuario.password)
        if (!validPass) {
            return res.status(401).json({ error: "Credenciales invalidas." })
        }

        // 5️⃣ Generar token seguro con JWT
        const token = generarToken(usuario)

        // 6️⃣ Enviar token en headers y cookies
        res.setHeader("Authorization", `Bearer ${token}`)
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax"
        })

        res.json({
            message: "Inicio de sesion exitoso",
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                telefono: usuario.telefono,
                rol: usuario.rol,
                estado: usuario.estado,
            }
        })

    } catch (error) {
        console.error("❌ Error en login:", error);
        res.status(500).json({ error: "Error interno del servidor" })
    }
}

// 2️⃣ 🚀 Registro de Superadmin
export const registersuperadmin = async (req, res) => {
    try {
        const { nombre, email, telefono, password, rol, direccion, estado, documentoIdentidad, especialidad, horarioDisponibilidad, fotoPerfil, direccionClinica, notificaciones, fechaNacimiento } = req.body;

        // 1️⃣ Validación de nombre
        if (!nombre || nombre.length < 3) {
            return res.status(400).json({ error: "El nombre debe tener al menos 3 caracteres." });
        }

        // 2️⃣ Validación de email o teléfono (uno de los dos es obligatorio)
        if (!email && !telefono) {
            return res.status(400).json({ error: "Debe proporcionar un email o número de teléfono." });
        }

        // 3️⃣ Validación de email (si se proporciona)
        if (email) {
            if (!email.includes("@")) {
                return res.status(400).json({ error: "Correo electrónico no válido." });
            }
            // Verificar si el email ya está registrado
            const emailExists = await Usuario.findOne({ where: { email } });
            if (emailExists) {
                return res.status(400).json({ error: "El correo ya está registrado." });
            }
        }

        // 4️⃣ Validación de teléfono (si se proporciona)
        if (telefono) {
            const telefonoRegex = /^\+?[0-9]{9,15}$/; // Debe tener entre 9 y 15 dígitos
            if (!telefonoRegex.test(telefono)) {
                return res.status(400).json({ error: "Número de teléfono no válido." });
            }
            // Verificar si el teléfono ya está registrado
            const telefonoExists = await Usuario.findOne({ where: { telefono } });
            if (telefonoExists) {
                return res.status(400).json({ error: "El número de teléfono ya está registrado." });
            }
        }

        // 5️⃣ Validación de contraseña (mínimo 8 caracteres, mayúscula, minúscula y número)
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                error: "La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas y números.",
            });
        }

        // 6️⃣ Verificar que el rol sea válido
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
        if (!rolesPermitidos.includes(rol)) {
            return res.status(400).json({ error: "Rol no permitido." });
        }

        // 7️⃣ Hashear la contraseña con bcrypt
        const salt = bcrypt.genSaltSync(12);
        const hashedPassword = bcrypt.hashSync(password, salt);

        // 8️⃣ Crear usuario en la base de datos
        const nuevoUsuario = await Usuario.create({
            nombre,
            email: email || null, // Guarda null si no se proporciona email
            telefono: telefono || null, // Guarda null si no se proporciona teléfono
            direccion: direccion || null, // Asegurarse de que se maneje correctamente
            estado: estado || null, // Asegurarse de que se maneje correctamente
            documentoIdentidad: documentoIdentidad || null, // Asegurarse de que se maneje correctamente
            estadoRegistro: "aprobado",
            rol: "Superadmin",
            password: hashedPassword,
            especialidad: especialidad || null, // Asegurarse de que se maneje correctamente
            horarioDisponibilidad: horarioDisponibilidad || null, // Asegurarse de que se maneje correctamente
            fotoPerfil: fotoPerfil || null, // Asegurarse de que se maneje correctamente
            direccionClinica: direccionClinica || null, // Asegurarse de que se maneje correctamente
            notificaciones: notificaciones || null, // Asegurarse de que se maneje correctamente
            fechaNacimiento: fechaNacimiento || null, // Asegurarse de que se maneje correctamente
        });

        // 9️⃣ Generar token JWT
        const token = generarToken(nuevoUsuario);

        // 🔟 Enviar token en el header
        res.setHeader("Authorization", `Bearer ${token}`);

        res.status(201).json({
            message: "Usuario registrado con éxito",
            usuario: {
                id: nuevoUsuario.id,
                nombre: nuevoUsuario.nombre,
                email: nuevoUsuario.email,
                telefono: nuevoUsuario.telefono,
                direccion: nuevoUsuario.direccion,
                documentoIdentidad: nuevoUsuario.documentoIdentidad,
                rol: "superadmin",
                estado: nuevoUsuario.estado,
                especialidad: nuevoUsuario.especialidad,
                horarioDisponibilidad: nuevoUsuario.horarioDisponibilidad,
                fotoPerfil: nuevoUsuario.fotoPerfil,
                direccionClinica: nuevoUsuario.direccionClinica,
                notificaciones: nuevoUsuario.notificaciones,
                fechaNacimiento: nuevoUsuario.fechaNacimiento
            },
        });
    } catch (error) {
        console.error("❌ Error en registro:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// 3️⃣ 🚀 Solicitar Código de Recuperación
export const solicitarCodigo = async (req, res) => {
    try {
        const { email, telefono } = req.body;

        // Validar que al menos uno de los campos esté presente
        if (!email && !telefono) {
            return res.status(400).json({ message: "Debe proporcionar un email o teléfono." });
        }

        // Construir la cláusula where dinámicamente
        const whereClause = {};
        if (email) whereClause.email = email;
        if (telefono) whereClause.telefono = telefono;

        // Verificar si el usuario existe
        const usuario = await Usuario.findOne({
            where: whereClause,
        });

        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Generar código y definir expiración en 15 minutos
        const codigoRecuperacion = generarCodigo();
        const expiracion = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

        // Guardar en la base de datos
        usuario.resetToken = codigoRecuperacion;
        usuario.resetTokenExpires = expiracion;
        await usuario.save();

        // ⚠️ Mostrar el código en la respuesta (en producción, podrías enviarlo por otro medio)
        return res.json({ message: "Código generado", codigo: codigoRecuperacion });
    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
};

// 4️⃣ 🚀 Verificar Código de Recuperación
export const verificarCodigo = async (req, res) => {
    try {
        const { email, telefono, codigo, respuestaSecreta } = req.body;

        // Validar que al menos uno de los campos esté presente
        if (!email && !telefono) {
            return res.status(400).json({ message: "Debe proporcionar un email o teléfono." });
        }

        // Construir la cláusula where dinámicamente
        const whereClause = {
            resetToken: codigo,
            resetTokenExpires: { [Op.gt]: new Date() }
        };
        if (email) whereClause.email = email;
        if (telefono) whereClause.telefono = telefono;
        if (respuestaSecreta) whereClause.respuestaSecreta = respuestaSecreta;

        // Verificar si el usuario existe y el código es válido
        const usuario = await Usuario.findOne({
            where: whereClause,
        });

        if (!usuario) {
            return res.status(400).json({ message: "Código inválido o expirado" });
        }

        return res.json({ message: "Código válido, ahora puedes cambiar la contraseña" });
    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
};

// 5️⃣ 🚀 Cambiar Contraseña
export const cambiarPassword = async (req, res) => {
    try {
        const { paisCode, telefono, codigo, nuevaPassword, respuestaSecreta } = req.body;

        // Validación básica (opcional, mejora seguridad)
        if (!paisCode || !telefono || !codigo || !nuevaPassword || !respuestaSecreta) {
            return res.status(400).json({ message: "Faltan datos obligatorios." });
        }

        // Buscar al usuario con coincidencia total
        const usuario = await Usuario.findOne({
            where: {
                paisCode,
                telefono,
                respuestaSecreta,
                resetToken: codigo,
                resetTokenExpires: { [Op.gt]: new Date() }
            }
        });

        // Si no encuentra coincidencia exacta
        if (!usuario) {
            return res.status(400).json({
                message: "Datos incorrectos: código, teléfono o respuesta secreta inválidos o expirados."
            });
        }

        // Encriptar nueva contraseña
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(nuevaPassword, salt);

        // Limpiar datos de recuperación
        usuario.resetToken = null;
        usuario.resetTokenExpires = null;

        await usuario.save();

        return res.json({ message: "Contraseña actualizada con éxito" });

    } catch (error) {
        console.error("Error en cambiarPassword:", error);
        return res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
};


// 6️⃣ 🚀 Resetear Contraseña
export const resetearPassword = async (req, res) => {
    try {
        const { userId, nuevaPassword } = req.body;

        console.log("🔹 Datos para resetear contraseña:", { userId, nuevaPassword });

        // 1️⃣ Buscar al usuario por su ID
        const usuario = await Usuario.findOne({
            where: {
                id: userId, // Buscar por ID en vez de por el token
            }
        });

        if (!usuario) {
            return res.status(400).json({ error: "Usuario no encontrado." });
        }

        // 2️⃣ Hashear la nueva contraseña
        const hashedPassword = await bcrypt.hash(nuevaPassword, 10);

        // 3️⃣ Actualizar la contraseña
        usuario.password = hashedPassword;
        await usuario.save();

        res.status(200).json({ message: "Contraseña actualizada con éxito." });

    } catch (error) {
        console.error("Error en resetear contraseña:", error);
        res.status(500).json({ error: "Error interno del servidor.", error: error.message });
    }
};


// 7️⃣ 🚀 Registrar un usuario cliente
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
            return res.status(400).json({ message: "El usuario ya está registrado." });
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
            message: "Usuario registrado con éxito",
            usuario: { id: nuevoUsuario.id, nombre, email, telefono },
        });
    } catch (error) {
        console.error("❌ Error al registrar usuario:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};

// 8️⃣ 🚀 Registrar un usuario cliente en una veterinaria
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

// 9️⃣ 🚀 Verificar Contraseña Actual
export const verificarContrasenaActual = async (req, res) => {
    try {
        const { usuarioId, contrasenaActual } = req.body;

        // Validar que los datos no estén vacíos
        if (!usuarioId || !contrasenaActual) {
            return res.status(400).json({ message: "Faltan datos obligatorios." });
        }

        // Buscar al usuario en la base de datos
        const usuario = await Usuario.findOne({
            where: { id: usuarioId }
        });

        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        // Comparar la contraseña proporcionada con la almacenada en la base de datos
        const contrasenaValida = await bcrypt.compare(contrasenaActual, usuario.password);

        if (!contrasenaValida) {
            return res.status(401).json({ message: "Contraseña actual incorrecta." });
        }

        // Si la contraseña es válida
        return res.json({ message: "Contraseña actual válida." });

    } catch (error) {
        console.error("Error al verificar contraseña actual:", error);
        return res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
};
