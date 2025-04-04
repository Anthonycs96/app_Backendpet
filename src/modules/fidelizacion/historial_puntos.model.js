import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';
import { addAuditHooks } from '../../middleware/auditoriaHooks.js';
import Usuario from '../usuario/usuario.model.js';
import Factura from '../facturacion/factura.model.js';

const HistorialPuntos = sequelize.define('HistorialPuntos', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    cliente_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: Usuario,
            key: 'id'
        }
    },
    tipo_movimiento: {
        type: DataTypes.ENUM('acumulacion', 'canje', 'expiracion', 'ajuste'),
        allowNull: false
    },
    puntos: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    motivo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    factura_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
            model: Factura,
            key: 'id'
        }
    }
}, {
    tableName: 'historial_puntos',
    timestamps: true
});

addAuditHooks(HistorialPuntos);

export default HistorialPuntos;