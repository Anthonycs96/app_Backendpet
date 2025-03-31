import Paciente from "../models/Paciente.js";
import Usuario from "../models/Usuario.js";
import { Op } from "sequelize";

// 🚀 Registrar un paciente
export const registrarPaciente = async (req, res) => {
    try {
        const { nombre, especie, raza, edad, peso, propietario_id, foto, fechaNacimiento, estado, alergias, notas } = req.body;

        // Validar que el propietario exista
        const propietario = await Usuario.findByPk(propietario_id);
        if (!propietario) {
            return res.status(404).json({ error: "Propietario no encontrado." });
        }

        // Validar edad y peso
        if (edad < 0 || peso < 0) {
            return res.status(400).json({ error: "Edad y peso deben ser valores positivos." });
        }

        // Crear paciente
        const nuevoPaciente = await Paciente.create({
            nombre,
            especie,
            raza,
            edad,
            peso,
            propietario_id,
            foto,
            fechaNacimiento,
            estado,
            alergias,
            notas,
        });

        res.status(201).json({ message: "Paciente registrado con éxito", paciente: nuevoPaciente });
    } catch (error) {
        console.error("❌ Error al registrar paciente:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// 🚀 Obtener todos los pacientes
export const obtenerPacientes = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query; // Paginación
        const offset = (page - 1) * limit;

        const pacientes = await Paciente.findAll({
            include: { model: Usuario, as: "propietario", attributes: ["id", "nombre", "email"] },
            limit,
            offset,
        });

        res.json({ pacientes });
    } catch (error) {
        console.error("❌ Error al obtener pacientes:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// 🚀 Obtener un paciente por ID
export const obtenerPacientePorId = async (req, res) => {
    try {
        const { id } = req.params;
        const paciente = await Paciente.findByPk(id, {
            include: { model: Usuario, as: "propietario", attributes: ["id", "nombre", "email"] },
        });

        if (!paciente) return res.status(404).json({ error: "Paciente no encontrado." });

        res.json({ paciente });
    } catch (error) {
        console.error("❌ Error al obtener paciente:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// 🚀 Actualizar datos de un paciente
export const actualizarPaciente = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, especie, raza, edad, peso, foto, fechaNacimiento, estado, alergias, notas } = req.body;

        const paciente = await Paciente.findByPk(id);
        if (!paciente) return res.status(404).json({ error: "Paciente no encontrado." });

        await paciente.update({
            nombre: nombre || paciente.nombre,
            especie: especie || paciente.especie,
            raza: raza || paciente.raza,
            edad: edad ?? paciente.edad,
            peso: peso ?? paciente.peso,
            foto: foto || paciente.foto,
            fechaNacimiento: fechaNacimiento || paciente.fechaNacimiento,
            estado: estado || paciente.estado,
            alergias: alergias || paciente.alergias,
            notas: notas || paciente.notas,
        });

        res.json({ message: "Paciente actualizado con éxito", paciente });
    } catch (error) {
        console.error("❌ Error al actualizar paciente:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// 🚀 Eliminar un paciente
export const eliminarPaciente = async (req, res) => {
    try {
        const { id } = req.params;

        const paciente = await Paciente.findByPk(id);
        if (!paciente) return res.status(404).json({ error: "Paciente no encontrado." });

        await paciente.destroy();
        res.json({ message: "Paciente eliminado con éxito" });
    } catch (error) {
        console.error("❌ Error al eliminar paciente:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// 🚀 Buscar pacientes por nombre o dueño
export const buscarPacientes = async (req, res) => {
    try {
        const { nombre, propietario } = req.query;

        const pacientes = await Paciente.findAll({
            where: {
                [Op.or]: [
                    nombre ? { nombre: { [Op.like]: `%${nombre}%` } } : {},
                    propietario ? { propietario_id: propietario } : {},
                ],
            },
            include: { model: Usuario, as: "propietario", attributes: ["id", "nombre", "email"] },
        });

        res.json({ pacientes });
    } catch (error) {
        console.error("❌ Error al buscar pacientes:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
