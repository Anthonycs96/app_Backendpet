import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";
import { addAuditHooks } from '../../middleware/auditoriaHooks.js';

const PrecioServicio = sequelize.define("PrecioServicio", {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    servicio_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
            model: 'servicios',
            key: 'id'
        },
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE'
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    estado: {
        type: DataTypes.ENUM('Activo', 'Inactivo'),
        defaultValue: 'Activo'
    }
}, {
    tableName: "precios_servicios",
    timestamps: true
});

addAuditHooks(PrecioServicio);

export default PrecioServicio;