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

// Obtener pacientes del día
export const obtenerPacientesDia = async (req, res) => {
    try {
        const { fecha } = req.query;
        const hoy = fecha || new Date().toISOString().split('T')[0];

        const pacientes = await Paciente.findAll({
            where: {
                createdAt: {
                    [Op.gte]: new Date(hoy),
                    [Op.lte]: new Date(hoy + 'T23:59:59')
                }
            },
            include: [
                {
                    model: Usuario,
                    as: 'propietario',
                    attributes: ['id', 'nombre', 'email']
                }
            ]
        });

        res.json({ pacientes });
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};