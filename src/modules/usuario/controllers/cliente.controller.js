import bcrypt from 'bcryptjs';
import Usuario from '../usuario.model.js';
import { generarJWT } from '../../../helpers/generar-jwt.js';

export const registrarCliente = async (req, res) => {
    try {
        const { email, password, ...resto } = req.body;

        // Verificar si el email ya existe
        const usuarioExiste = await Usuario.findOne({ where: { email } });
        if (usuarioExiste) {
            return res.status(400).json({
                status: 'error',
                message: 'Ya existe un usuario con ese email'
            });
        }

        // Encriptar la contraseña
        const salt = bcrypt.genSaltSync();
        const hashedPassword = bcrypt.hashSync(password, salt);

        // Crear el usuario
        const usuario = await Usuario.create({
            ...resto,
            email,
            password: hashedPassword,
            rol: 'cliente',
            estado: 'activo'
        });

        // Generar el JWT
        const token = await generarJWT(usuario.id);

        // Eliminar password del objeto de respuesta
        const { password: _, ...usuarioSinPassword } = usuario.toJSON();

        res.status(201).json({
            status: 'success',
            message: 'Cliente registrado exitosamente',
            data: {
                usuario: usuarioSinPassword,
                token
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Error al registrar el cliente'
        });
    }
};