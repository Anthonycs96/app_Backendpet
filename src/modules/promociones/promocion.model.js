import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';
import { addAuditHooks } from '../../middleware/auditoriaHooks.js';
import Veterinaria from '../veterinaria/veterinaria.model.js';

const Promocion = sequelize.define('Promocion', {
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
        allowNull: true
    },
    tipo: {
        type: DataTypes.ENUM('descuento_porcentaje', 'descuento_monto', '2x1', 'regalo'),
        allowNull: false
    },
    valor: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true // Puede ser nulo en caso de promociones tipo '2x1' o 'regalo'
    },
    fecha_inicio: {
        type: DataTypes.DATE,
        allowNull: false
    },
    fecha_fin: {
        type: DataTypes.DATE,
        allowNull: false
    },
    condiciones: {
        type: DataTypes.JSON,
        allowNull: true // Para almacenar condiciones específicas
    },
    limite_uso: {
        type: DataTypes.INTEGER,
        allowNull: true // Límite de veces que se puede usar la promoción
    },
    veterinaria_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: Veterinaria,
            key: 'id'
        }
    },
    estado: {
        type: DataTypes.ENUM('activa', 'inactiva', 'expirada'),
        defaultValue: 'activa'
    },
    codigo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'promociones',
    timestamps: true
});

addAuditHooks(Promocion);

export default Promocion;