import Paciente from "../paciente.model.js";
import Usuario from "../../usuario/usuario.model.js";
import { Op } from "sequelize";

// Registrar paciente
export const registrarPaciente = async (req, res) => {
    try {
        const {
            nombre,
            especie,
            raza,
            edad,
            peso,
            color,
            propietario_id,
            veterinaria_id
        } = req.body;

        // Validar propietario
        const propietario = await Usuario.findByPk(propietario_id);
        if (!propietario) {
            return res.status(404).json({ error: "Propietario no encontrado" });
        }

        // Crear paciente
        const paciente = await Paciente.create({
            nombre,
            especie,
            raza,
            edad,
            peso,
            color,
            propietario_id,
            veterinaria_id,
            estado: 'Activo'
        });

        res.json({ message: "Paciente registrado exitosamente", paciente });
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Obtener paciente por ID
export const obtenerPacientePorId = async (req, res) => {
    try {
        const { id } = req.params;

        const paciente = await Paciente.findOne({
            where: { id },
            include: [
                {
                    model: Usuario,
                    as: 'propietario',
                    attributes: ['id', 'nombre', 'email']
                }
            ]
        });

        if (!paciente) {
            return res.status(404).json({ error: "Paciente no encontrado" });
        }

        res.json(paciente);
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Actualizar paciente
export const actualizarPaciente = async (req, res) => {
    try {
        const { id } = req.params;
        const datosActualizados = req.body;

        const paciente = await Paciente.findByPk(id);
        if (!paciente) {
            return res.status(404).json({ error: "Paciente no encontrado" });
        }

        await paciente.update(datosActualizados);
        res.json({ message: "Paciente actualizado exitosamente", paciente });
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};