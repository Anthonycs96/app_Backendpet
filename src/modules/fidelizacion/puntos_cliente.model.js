import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';
import { addAuditHooks } from '../../middleware/auditoriaHooks.js';
import Veterinaria from '../veterinaria/veterinaria.model.js';
import Usuario from '../usuario/usuario.model.js';

const PuntosCliente = sequelize.define('PuntosCliente', {
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
    veterinaria_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: Veterinaria,
            key: 'id'
        }
    },
    puntos_actuales: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    puntos_acumulados: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    puntos_canjeados: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    nivel: {
        type: DataTypes.ENUM('bronce', 'plata', 'oro', 'platino'),
        defaultValue: 'bronce'
    }
}, {
    tableName: 'puntos_clientes',
    timestamps: true
});

addAuditHooks(PuntosCliente);

export default PuntosCliente;