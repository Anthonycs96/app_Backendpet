import sequelize from "../config/database.js";

// Importar modelos base
import Usuario from "../modules/usuario/usuario.model.js";
// Modelo para gestionar usuarios del sistema (clientes, veterinarios, administradores)
import Veterinaria from "../modules/veterinaria/veterinaria.model.js";
// Modelo para almacenar información de las clínicas veterinarias
import Servicio from "../modules/servicio/servicio.model.js";
// Modelo para los servicios que ofrece cada veterinaria
import PrecioServicio from "../modules/servicio/PrecioServicio.js";
// Modelo para gestionar los precios históricos de los servicios
import Paciente from "../modules/paciente/paciente.model.js";
// Modelo para registrar las mascotas/pacientes y sus datos
import HistorialMedico from "../modules/historial/historial.model.js";
// Modelo para el historial médico de cada paciente
import Cita from "../modules/cita/cita.model.js";
// Modelo para gestionar las citas médicas
import HorarioAtencion from "../modules/horario/horario.model.js";
// Modelo para los horarios de atención de cada veterinaria
import UsuarioVeterinaria from "../modules/usuarioVeterinaria/usuarioVeterinaria.model.js";
//
import UsuarioPaciente from "../modules/usuarioPaciente/usuarioPaciente.model.js";
// Modelo para la relación entre usuarios y veterinarias (personal médico)
import Factura from "../modules/facturacion/factura.model.js";
// Modelo para las facturas de servicios prestados
import DetalleFactura from "../modules/facturacion/detalle_factura.model.js";
// Modelo para los items/servicios incluidos en cada factura
import Pago from "../modules/facturacion/pago.model.js";
// Modelo para registrar los pagos realizados a las facturas
import Promocion from "../modules/promociones/promocion.model.js";
// Modelo para las promociones y descuentos
import ServicioPromocion from "../modules/promociones/servicio_promocion.model.js";
// Modelo para relacionar servicios con promociones activas
import PuntosCliente from "../modules/fidelizacion/puntos_cliente.model.js";
// Modelo para gestionar los puntos de fidelización
import HistorialPuntos from "../modules/fidelizacion/historial_puntos.model.js";
// Modelo para el historial de puntos de fidelización
import Auditoria from "../modules/auditoria/auditoria.model.js";
// Modelo para el registro de auditoría


// ✅ Definir relaciones aquí
// Relaciones Usuario con UsuarioVeterinaria
Usuario.hasMany(UsuarioVeterinaria, { foreignKey: "usuarioId", as: "veterinariasAsociadas" });
UsuarioVeterinaria.belongsTo(Usuario, { foreignKey: "usuarioId", as: "usuarioAsociado" });

// Relaciones Veterinaria con UsuarioVeterinaria
Veterinaria.hasMany(UsuarioVeterinaria, { foreignKey: "veterinariaId", as: "usuariosAsociados" });
UsuarioVeterinaria.belongsTo(Veterinaria, { foreignKey: "veterinariaId", as: "veterinariaAsociada" });

// Relaciones Usuario con UsuarioPaciente
Usuario.hasMany(UsuarioPaciente, { foreignKey: "usuarioId", as: "pacientesAsociadas" });
UsuarioPaciente.belongsTo(Usuario, { foreignKey: "usuarioId", as: "usuarioAsociado" });

// Relaciones Paciente con UsuarioPaciente
Paciente.hasMany(UsuarioPaciente, { foreignKey: "pacienteId", as: "usuariosAsociados" });
UsuarioPaciente.belongsTo(Paciente, { foreignKey: "pacienteId", as: "pacientesAsociadas" });


// Relaciones Servicio y PrecioServicio
Servicio.hasMany(PrecioServicio, {
    foreignKey: "servicio_id",
    as: "preciosHistoricos"
});

PrecioServicio.belongsTo(Servicio, {
    foreignKey: "servicio_id",
    as: "servicioRelacionado"
});

// Relaciones Paciente
Usuario.hasMany(Paciente, {
    foreignKey: "propietario_id",
    as: "mascotasPropietario"
});

Usuario.hasMany(Paciente, {
    foreignKey: "veterinario_id",
    as: "pacientesAtendidosVeterinario"
});

Paciente.belongsTo(Usuario, {
    foreignKey: "propietario_id",
    as: "propietarioPaciente"
});

Paciente.belongsTo(Usuario, {
    foreignKey: "veterinario_id",
    as: "veterinarioAsignadoPaciente"
});

// Relaciones HistorialMedico
Paciente.hasMany(HistorialMedico, {
    foreignKey: "paciente_id",
    as: "historialesMedicos"
});

HistorialMedico.belongsTo(Paciente, {
    foreignKey: "paciente_id",
    as: "mascotaHistorial"
});

// Relaciones Cita
Cita.belongsTo(Usuario, {
    foreignKey: "veterinario_id",
    as: "veterinarioCitaAsignado"
});

Cita.belongsTo(Usuario, {
    foreignKey: "propietario_id",
    as: "clienteCitaAsociado"
});

Cita.belongsTo(Paciente, {
    foreignKey: "paciente_id",
    as: "mascotaCitaAsociada"
});

Usuario.hasMany(Cita, {
    foreignKey: "veterinario_id",
    as: "citasAsignadasVeterinario"
});

Usuario.hasMany(Cita, {
    foreignKey: "propietario_id",
    as: "citasReservadasPropietario"
});

Paciente.hasMany(Cita, {
    foreignKey: "paciente_id",
    as: "historialCitasPaciente"
});

// Relaciones HorarioAtencion
Usuario.hasMany(HorarioAtencion, { foreignKey: "usuario_id", as: "horariosAsignados" });
HorarioAtencion.belongsTo(Usuario, { foreignKey: "usuario_id", as: "usuarioHorario" });

// Relación entre Usuario y Veterinaria
Usuario.belongsToMany(Veterinaria, {
    through: 'UsuarioVeterinaria',
    foreignKey: 'usuarioId',
    as: 'veterinariasUsuarioAsociadas'
});

Veterinaria.belongsToMany(Usuario, {
    through: 'UsuarioVeterinaria',
    foreignKey: 'veterinariaId',
    as: 'usuariosVeterinariaAsociados'
});

// Relación entre Servicio y DetalleFactura
Servicio.hasMany(DetalleFactura, {
    foreignKey: "servicio_id",
    as: "detallesServicio"
});

DetalleFactura.belongsTo(Servicio, {
    foreignKey: "servicio_id",
    as: "servicioRelacionado"
});

// Relación entre Factura y DetalleFactura
Factura.hasMany(DetalleFactura, {
    foreignKey: "factura_id",
    as: "itemsFactura"
});

DetalleFactura.belongsTo(Factura, {
    foreignKey: "factura_id",
    as: "facturaRelacionada"
});

// Relación entre Promocion y ServicioPromocion
Promocion.hasMany(ServicioPromocion, {
    foreignKey: "promocion_id",
    as: "serviciosPromocionadosAsociados"
});

ServicioPromocion.belongsTo(Promocion, {
    foreignKey: "promocion_id",
    as: "promocionAsociada"
});

Servicio.hasMany(ServicioPromocion, {
    foreignKey: "servicio_id",
    as: "promocionesAsociadas"
});

ServicioPromocion.belongsTo(Servicio, {
    foreignKey: "servicio_id",
    as: "servicioPromocionado"
});

// Relación entre Usuario y PuntosCliente
Usuario.hasOne(PuntosCliente, {
    foreignKey: "usuario_id",
    as: "puntosAsociados"
});

PuntosCliente.belongsTo(Usuario, {
    foreignKey: "usuario_id",
    as: "clientePuntos"
});

// Relación entre PuntosCliente y HistorialPuntos
PuntosCliente.hasMany(HistorialPuntos, {
    foreignKey: "puntos_cliente_id",
    as: "historialPuntosAsociados"
});

HistorialPuntos.belongsTo(PuntosCliente, {
    foreignKey: "puntos_cliente_id",
    as: "puntosClienteAsociado"
});

// Relación entre Factura y Pago
Factura.hasMany(Pago, {
    foreignKey: "factura_id",
    as: "pagosAsociados"
});

Pago.belongsTo(Factura, {
    foreignKey: "factura_id",
    as: "facturaPago"
});

// Añadir relación de Auditoria con Usuario
Usuario.hasMany(Auditoria, {
    foreignKey: "usuario_id",
    as: "cambiosRealizados"
});

Auditoria.belongsTo(Usuario, {
    foreignKey: "usuario_id",
    as: "usuarioResponsable"
});



// ✅ Función para sincronizar la base de datos
export const sincronizarBaseDeDatos = async () => {
    try {
        // Primero las tablas base sin dependencias
        await Usuario.sync();
        await Veterinaria.sync();
        await Servicio.sync();
        await Promocion.sync();
        await PuntosCliente.sync();
        await Factura.sync();

        // Luego las tablas con una dependencia
        await PrecioServicio.sync();
        await Paciente.sync();
        await HistorialMedico.sync();
        await HorarioAtencion.sync();
        await Auditoria.sync();

        // Finalmente las tablas con múltiples dependencias
        await UsuarioVeterinaria.sync();
        await Cita.sync();
        await DetalleFactura.sync();
        await ServicioPromocion.sync();
        await HistorialPuntos.sync();
        await Pago.sync();

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
    PrecioServicio,
    Paciente,
    HistorialMedico,
    Cita,
    HorarioAtencion,
    UsuarioVeterinaria,
    Factura,
    DetalleFactura,
    Pago,
    Promocion,
    ServicioPromocion,
    PuntosCliente,
    HistorialPuntos,
    Auditoria
};