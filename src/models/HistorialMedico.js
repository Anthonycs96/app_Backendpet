import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Paciente from "./Paciente.js";

const HistorialMedico = sequelize.define("HistorialMedico", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
    fecha: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    tratamiento: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    detalles: {
        type: DataTypes.JSON, // Para almacenar múltiples entradas de historial médico
        allowNull: true,
    },
}, {
    tableName: "historial_medico",
    timestamps: true,
});

export default HistorialMedico;
