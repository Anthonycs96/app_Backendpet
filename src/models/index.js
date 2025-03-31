import sequelize from "../config/database.js";

// Importar modelos
import Usuario from "./Usuario.js";
import Veterinaria from "./Veterinaria.js";
import Servicio from "./Servicio.js";
import Paciente from "./Paciente.js";
import HistorialMedico from "./HistorialMedico.js";
import Cita from "./Cita.js";
import HorarioAtencion from "./HorarioAtencion.js";
import UsuarioVeterinaria from "./UsuarioVeterinaria.js";

// ✅ Definir relaciones aquí
// Relación entre Usuario y Veterinaria
Usuario.belongsToMany(Veterinaria, { 
    through: 'UsuarioVeterinaria', 
    foreignKey: 'usuarioId', 
    as: 'veterinariasUsuario' 
});
Veterinaria.belongsToMany(Usuario, { 
    through: 'UsuarioVeterinaria', 
    foreignKey: 'veterinariaId', 
    as: 'usuariosVeterinaria' 
});

Usuario.hasMany(Cita, { foreignKey: "veterinario_id", as: "citasVeterinario", onDelete: "CASCADE", onUpdate: "CASCADE" });
Cita.belongsTo(Usuario, { foreignKey: "veterinario_id", as: "veterinario", onDelete: "CASCADE", onUpdate: "CASCADE" });

Paciente.hasMany(Cita, { foreignKey: "paciente_id", as: "citasPaciente", onDelete: "CASCADE", onUpdate: "CASCADE" });
Cita.belongsTo(Paciente, { foreignKey: "paciente_id", as: "paciente", onDelete: "CASCADE", onUpdate: "CASCADE" });

// Relación entre Usuario y Paciente
Usuario.hasMany(Paciente, { foreignKey: "usuario_id", as: "pacientes", onDelete: "CASCADE", onUpdate: "CASCADE" });
Paciente.belongsTo(Usuario, { foreignKey: "usuario_id", as: "propietario", onDelete: "CASCADE", onUpdate: "CASCADE" });

// Relación entre Veterinaria y Servicio
Veterinaria.hasMany(Servicio, { foreignKey: "veterinaria_id", as: "servicios", onDelete: "CASCADE", onUpdate: "CASCADE" });
Servicio.belongsTo(Veterinaria, { foreignKey: "veterinaria_id", as: "veterinaria", onDelete: "CASCADE", onUpdate: "CASCADE" });

// Relación entre Veterinaria y HorarioAtencion
Veterinaria.hasMany(HorarioAtencion, { foreignKey: "veterinaria_id", as: "horarios", onDelete: "CASCADE", onUpdate: "CASCADE" });
HorarioAtencion.belongsTo(Veterinaria, { foreignKey: "veterinaria_id", as: "veterinaria", onDelete: "CASCADE", onUpdate: "CASCADE" });

// Relación entre Veterinaria y Usuario (empleados)
Veterinaria.hasMany(Usuario, { foreignKey: "veterinaria_id", as: "empleados", onDelete: "CASCADE", onUpdate: "CASCADE" });
Usuario.belongsTo(Veterinaria, { foreignKey: "veterinaria_id", as: "veterinaria", onDelete: "CASCADE", onUpdate: "CASCADE" });

// Relación entre Servicio y Cita
Servicio.hasMany(Cita, { foreignKey: "servicio_id", as: "citasServicio", onDelete: "CASCADE", onUpdate: "CASCADE" });
Cita.belongsTo(Servicio, { foreignKey: "servicio_id", as: "servicio", onDelete: "CASCADE", onUpdate: "CASCADE" });

// Relación entre Paciente y HistorialMedico
Paciente.hasMany(HistorialMedico, { foreignKey: "paciente_id", as: "historialMedico", onDelete: "CASCADE", onUpdate: "CASCADE" });
HistorialMedico.belongsTo(Paciente, { foreignKey: "paciente_id", as: "paciente", onDelete: "CASCADE", onUpdate: "CASCADE" });

// Relación entre Cita y HistorialMedico
Cita.hasOne(HistorialMedico, { foreignKey: "cita_id", as: "historial" });
HistorialMedico.belongsTo(Cita, { foreignKey: "cita_id", as: "cita" });

Usuario.hasMany(UsuarioVeterinaria, { foreignKey: "usuarioId", as: 'asignacionesUsuario' });
UsuarioVeterinaria.belongsTo(Usuario, { foreignKey: "usuarioId", as: 'usuarioAsignado' });

Veterinaria.hasMany(UsuarioVeterinaria, { foreignKey: "veterinariaId", as: 'asignacionesVeterinaria' });
UsuarioVeterinaria.belongsTo(Veterinaria, { foreignKey: "veterinariaId", as: 'veterinariaAsignada' });

// ✅ Función para sincronizar la base de datos
const sincronizarBaseDeDatos = async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ Conexión exitosa a la base de datos.");

        await sequelize.sync({ force: false, alter: true }); // Usar alter: true para actualizar la estructura sin eliminar datos
        console.log("✅ Base de datos sincronizada correctamente.");
    } catch (error) {
        console.error("❌ Error al sincronizar la base de datos:", error);
    }
};

// ✅ Exportar modelos y la función de sincronización
export {
    sequelize,
    Usuario,
    Veterinaria,
    Servicio,
    Paciente,
    Cita,
    HorarioAtencion,
    sincronizarBaseDeDatos,
};
