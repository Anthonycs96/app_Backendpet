import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";
import Servicio from "../servicio/servicio.model.js";
import Usuario from "../usuario/usuario.model.js";
import Paciente from "../paciente/paciente.model.js";
import HistorialMedico from "../historial/historial.model.js";

const Cita = sequelize.define("Cita", {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false
    },
    hora: {
        type: DataTypes.TIME,
        allowNull: false
    },
    estado: {
        type: DataTypes.ENUM('pendiente', 'completada', 'cancelada'),
        defaultValue: 'pendiente'
    },
    veterinario_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: Usuario,
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    paciente_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: Paciente,
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    servicio_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: Servicio,
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    entrega_domicilio: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    urgente: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    nota: DataTypes.TEXT,
    motivo: DataTypes.STRING,
    duracion: DataTypes.INTEGER,
    recordatorio: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    observaciones: DataTypes.TEXT,
    tipoCita: {
        type: DataTypes.ENUM('consulta', 'vacunación', 'emergencia', 'seguimiento', 'otro')
    },
    fechaCreacion: DataTypes.DATE,
    fechaModificacion: DataTypes.DATE,
    historialMedico_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
            model: HistorialMedico,
            key: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    },
    propietario_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
            model: Usuario,
            key: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    }
}, {
    tableName: "citas",
    timestamps: true
});

// Relaciones
Usuario.hasMany(Cita, {
    foreignKey: 'veterinario_id',
    as: 'citasAsignadas'
});

Cita.belongsTo(Usuario, {
    foreignKey: 'veterinario_id',
    as: 'veterinario'
});

Paciente.hasMany(Cita, {
    foreignKey: 'paciente_id',
    as: 'historialCitas'
});

Cita.belongsTo(Paciente, {
    foreignKey: 'paciente_id',
    as: 'mascota'
});

Servicio.hasMany(Cita, {
    foreignKey: 'servicio_id',
    as: 'citasServicio'
});

Cita.belongsTo(Servicio, {
    foreignKey: 'servicio_id',
    as: 'servicio'
});

HistorialMedico.hasMany(Cita, {
    foreignKey: 'historialMedico_id',
    as: 'citasHistorial'
});

Cita.belongsTo(HistorialMedico, {
    foreignKey: 'historialMedico_id',
    as: 'historial'
});

export default Cita;
