import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";
import { addAuditHooks } from '../../middleware/auditoriaHooks.js';

const Paciente = sequelize.define("Paciente", {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    especie: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    raza: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    propietario_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: 'usuarios',
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    veterinario_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
            model: 'usuarios',
            key: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    },
    estado: {
        type: DataTypes.ENUM('Activo', 'Inactivo'),
        defaultValue: 'Activo'
    }
}, {
    tableName: "pacientes",
    timestamps: true
});

addAuditHooks(Paciente);

export default Paciente;
