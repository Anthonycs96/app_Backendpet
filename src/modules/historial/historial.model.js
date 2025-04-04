import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";
import { addAuditHooks } from '../../middleware/auditoriaHooks.js';
import Paciente from '../paciente/paciente.model.js';

const HistorialMedico = sequelize.define("HistorialMedico", {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
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
    fecha: {
        type: DataTypes.DATE,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    tratamiento: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    detalles: {
        type: DataTypes.JSON,
        allowNull: true
    }
}, {
    tableName: "historial_medico",
    timestamps: true
});

addAuditHooks(HistorialMedico);

export default HistorialMedico;