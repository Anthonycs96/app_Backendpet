import Paciente from "../paciente.model.js";
import usuario_paciente from "../../usuarioPaciente/usuarioPaciente.model.js";

export const propietarioPacienteController = async (req, res) => {
    try {
        const propietario_id = req.usuario.id; // ✅

        const {
            fotoPerfil,
            nombre,
            especie,
            raza,
            genero,
            peso,
            alergias,
            fecha_nacimiento,
            descripcion
        } = req.body;

        // Validación correcta
        if (!nombre || !especie || !fecha_nacimiento) {
            return res.status(400).json({
                error: "Nombre, especie y fecha de nacimiento son obligatorios"
            });
        }

        const nuevoPaciente = await Paciente.create({
            fotoPerfil,
            nombre,
            especie,
            raza,
            genero,
            peso,
            alergias,
            fecha_nacimiento,
            descripcion,
            propietario_id, // ✅ Se guarda el dueño
            estado: 'activo'
        });

        // Asignar el usuario al usuario_paciente
        await usuario_paciente.create({
            pacienteId: nuevoPaciente.id,
            usuarioId: propietario_id, // ✅ Se guarda el dueño
            estado: 'activo',
            fecha_asignacion: new Date()
        });


        res.status(201).json({
            message: "Paciente registrado exitosamente",
            paciente: nuevoPaciente
        });

    } catch (error) {
        console.error("❌ Error en registrar:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// 🔒 Obtener mascotas de propietario

export const misMascotas = async (req, res) => {
    try {
        const usuarioId = req.usuario.id; // ✅ ID del usuario logueado

        const relaciones = await usuario_paciente.findAll({
            where: { usuarioId },
            include: [
                {
                    model: Paciente,
                    as: "pacientesAsociadas", // ⚠️ Asegúrate que este alias esté bien definido en el modelo
                    //attributes: ["id", "nombre", "especie", "raza", "fotoPerfil"]
                }
            ]
        });

        // Extraer solo los datos de las mascotas
        const mascotas = relaciones.map(r => r.pacientesAsociadas);

        res.json({ mascotas });
    } catch (error) {
        console.error("❌ Error en misMascotas:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};


// 🔒 Obtener mis pacientes
// misMascotas: async (req, res) => {
//     try {
//         const propietario_id = req.user.id;

//         const pacientes = await Paciente.findAll({
//             where: { propietario_id },
//             include: [
//                 {
//                     model: Usuario,
//                     as: "veterinarioAsignado",
//                     attributes: ["id", "nombre", "especialidad"]
//                 }
//             ]
//         });

//         res.json({ pacientes });
//     } catch (error) {
//         console.error("❌ Error en misMascotas:", error);
//         res.status(500).json({ error: "Error interno del servidor" });
//     }
// },

// 🔒 Ver historial médico
// verHistorial: async (req, res) => {
//     try {
//         const { id } = req.params;
//         const propietario_id = req.user.id;

//         const paciente = await Paciente.findOne({
//             where: {
//                 id,
//                 propietario_id
//             },
//             attributes: ['id', 'nombre', 'historial_medico']
//         });

//         if (!paciente) {
//             return res.status(404).json({
//                 error: "Paciente no encontrado o no autorizado"
//             });
//         }

//         res.json({ historial: paciente.historial_medico || [] });
//     } catch (error) {
//         console.error("❌ Error en verHistorial:", error);
//         res.status(500).json({ error: "Error interno del servidor" });
//     }
// }

