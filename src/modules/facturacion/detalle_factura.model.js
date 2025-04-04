import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';
import { addAuditHooks } from '../../middleware/auditoriaHooks.js';
import Factura from "./factura.model.js";
import Servicio from "../servicio/servicio.model.js";

const DetalleFactura = sequelize.define('DetalleFactura', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    factura_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: 'facturas',
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    servicio_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: 'servicios',
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    precio_unitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    descuento: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    tableName: 'detalle_facturas',
    timestamps: true
});

// Relaciones
Factura.hasMany(DetalleFactura, {
    foreignKey: 'factura_id',
    as: 'detallesDeFactura'
});

DetalleFactura.belongsTo(Factura, {
    foreignKey: 'factura_id',
    as: 'facturaAsociada'
});

Servicio.hasMany(DetalleFactura, {
    foreignKey: 'servicio_id',
    as: 'detallesDeServicio'
});

DetalleFactura.belongsTo(Servicio, {
    foreignKey: 'servicio_id',
    as: 'servicioDetalle'
});

addAuditHooks(DetalleFactura);

export default DetalleFactura;