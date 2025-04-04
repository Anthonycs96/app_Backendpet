import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';
import { addAuditHooks } from '../../middleware/auditoriaHooks.js';

const Pago = sequelize.define('Pago', {
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
        }
    },
    monto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    fecha_pago: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    metodo_pago: {
        type: DataTypes.ENUM('efectivo', 'tarjeta', 'transferencia'),
        allowNull: false
    },
    comprobante: {
        type: DataTypes.STRING,
        allowNull: true
    },
    estado: {
        type: DataTypes.ENUM('procesado', 'pendiente', 'rechazado'),
        defaultValue: 'pendiente'
    },
    referencia: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'pagos',
    timestamps: true
});

addAuditHooks(Pago);

export default Pago;