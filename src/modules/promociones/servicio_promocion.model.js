import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';
import { addAuditHooks } from '../../middleware/auditoriaHooks.js';
import Promocion from '../promociones/promocion.model.js';
import Servicio from '../servicio/servicio.model.js';

const ServicioPromocion = sequelize.define('ServicioPromocion', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    promocion_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: Promocion,
            key: 'id'
        }
    },
    servicio_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: Servicio,
            key: 'id'
        }
    }
}, {
    tableName: 'servicios_promociones',
    timestamps: true
});

addAuditHooks(ServicioPromocion);

export default ServicioPromocion;