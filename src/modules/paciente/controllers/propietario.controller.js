import Paciente from "../models/Paciente.js";

export const propietarioPacienteController = {
    // 🔒 Registrar nuevo paciente
    registrar: async (req, res) => {
        try {
            const propietario_id = req.user.id;
            const {
                nombre,
                especie,
                raza,
                edad,
                peso,
                foto,
                fechaNacimiento,
                alergias,
                notas
            } = req.body;

            // Validaciones
            if (!nombre || !especie || !edad) {
                return res.status(400).json({
                    error: "Nombre, especie y edad son obligatorios"
                });
            }

            const nuevoPaciente = await Paciente.create({
                nombre,
                especie,
                raza,
                edad,
                peso,
                propietario_id,
                foto,
                fechaNacimiento,
                estado: 'activo',
                alergias,
                notas
            });

            res.status(201).json({
                message: "Paciente registrado exitosamente",
                paciente: nuevoPaciente
            });
        } catch (error) {
            console.error("❌ Error en registrar:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    // 🔒 Obtener mis pacientes
    misMascotas: async (req, res) => {
        try {
            const propietario_id = req.user.id;

            const pacientes = await Paciente.findAll({
                where: { propietario_id },
                include: [
                    {
                        model: Usuario,
                        as: "veterinarioAsignado",
                        attributes: ["id", "nombre", "especialidad"]
                    }
                ]
            });

            res.json({ pacientes });
        } catch (error) {
            console.error("❌ Error en misMascotas:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    // 🔒 Ver historial médico
    verHistorial: async (req, res) => {
        try {
            const { id } = req.params;
            const propietario_id = req.user.id;

            const paciente = await Paciente.findOne({
                where: {
                    id,
                    propietario_id
                },
                attributes: ['id', 'nombre', 'historial_medico']
            });

            if (!paciente) {
                return res.status(404).json({
                    error: "Paciente no encontrado o no autorizado"
                });
            }

            res.json({ historial: paciente.historial_medico || [] });
        } catch (error) {
            console.error("❌ Error en verHistorial:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
};