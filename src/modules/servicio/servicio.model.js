import { DataTypes } from "sequelize";
import sequelize from "../../../src/config/database.js";

const Servicio = sequelize.define("Servicio", {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    duracion: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    estado: {
        type: DataTypes.ENUM('Activo', 'Inactivo'),
        defaultValue: 'Activo'
    },
    servicio_padre_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
            model: 'servicios',
            key: 'id'
        }
    }
}, {
    timestamps: true,
    tableName: "servicios"
});

// Relación con servicio padre
Servicio.belongsTo(Servicio, {
    foreignKey: 'servicio_padre_id',
    as: 'servicioSuperior'
});

Servicio.hasMany(Servicio, {
    foreignKey: 'servicio_padre_id',
    as: 'serviciosHijos'
});

export default Servicio;