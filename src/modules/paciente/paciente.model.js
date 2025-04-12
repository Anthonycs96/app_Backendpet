import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";
import { addAuditHooks } from '../../middleware/auditoriaHooks.js';

const Paciente = sequelize.define("Paciente", {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    fotoPerfil: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
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
    genero: {
        type: DataTypes.ENUM('Macho', 'Hembra'),
        allowNull: false
    },
    peso: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    alergias: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    fecha_nacimiento: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    estado: {
        type: DataTypes.ENUM('Activo', 'Inactivo'),
        defaultValue: 'Activo'
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
}, {
    tableName: "pacientes",
    timestamps: true
});

addAuditHooks(Paciente);

export default Paciente;
