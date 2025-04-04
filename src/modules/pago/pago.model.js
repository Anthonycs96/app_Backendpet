import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";
import { addAuditHooks } from '../../middleware/auditoriaHooks.js';
import Factura from '../facturacion/factura.model.js';

const Pago = sequelize.define("Pago", {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    factura_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: Factura,
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    monto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    fecha_pago: {
        type: DataTypes.DATE,
        allowNull: true
    },
    metodo_pago: {
        type: DataTypes.ENUM('efectivo', 'tarjeta', 'transferencia'),
        allowNull: false
    },
    comprobante: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    estado: {
        type: DataTypes.ENUM('procesado', 'pendiente', 'rechazado'),
        defaultValue: 'pendiente'
    },
    referencia: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: "pagos",
    timestamps: true
});

// Relaciones
Factura.hasMany(Pago, {
    foreignKey: 'factura_id',
    as: 'pagos'
});

Pago.belongsTo(Factura, {
    foreignKey: 'factura_id',
    as: 'factura'
});

addAuditHooks(Pago);

export default Pago;