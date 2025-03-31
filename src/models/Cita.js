import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Servicio from "./Servicio.js";
import Usuario from "./Usuario.js";
import Paciente from "./Paciente.js";
import HistorialMedico from "./HistorialMedico.js"; // Agregado import de HistorialMedico

const Cita = sequelize.define("Cita", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    hora: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    estado: {
        type: DataTypes.ENUM("pendiente", "completada", "cancelada"),
        defaultValue: "pendiente",
    },
    veterinario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario,
            key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    },
    paciente_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Paciente,
            key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    },
    servicio_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Servicio,
            key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    },
    entrega_domicilio: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    urgente: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    nota: {
        type: DataTypes.TEXT,
        allowNull: true, // Información específica sobre la cita
    },
    motivo: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    duracion: {
        type: DataTypes.INTEGER,
        allowNull: true, // Duración en minutos
    },
    recordatorio: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    observaciones: {
        type: DataTypes.TEXT,
        allowNull: true, // Comentarios del veterinario después de la cita
    },
    tipoCita: {
        type: DataTypes.ENUM(
            "consulta",
            "vacunación",
            "emergencia",
            "seguimiento",
            "otro"
        ),
        allowNull: true,
    },
    fechaCreacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    fechaModificacion: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    historialMedico_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: HistorialMedico,
            key: "id",
        },
        onDelete: "SET NULL",
    },
}, {
    tableName: "citas",
    timestamps: true,
});

export default Cita;
