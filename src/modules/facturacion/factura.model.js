import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";
import { addAuditHooks } from '../../middleware/auditoriaHooks.js';
import Usuario from "../usuario/usuario.model.js";
import Veterinaria from "../veterinaria/veterinaria.model.js";

const Factura = sequelize.define("Factura", {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    numero_factura: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    fecha_emision: {
        type: DataTypes.DATE,
        allowNull: true
    },
    veterinaria_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: Veterinaria,
            key: 'id'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
    },
    cliente_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: Usuario,
            key: 'id'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
    },
    subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    iva: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    descuento: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    estado: {
        type: DataTypes.ENUM('pendiente', 'pagada', 'anulada'),
        defaultValue: 'pendiente'
    },
    metodo_pago: {
        type: DataTypes.ENUM('efectivo', 'tarjeta', 'transferencia'),
        allowNull: false
    }
}, {
    tableName: "facturas",
    timestamps: true
});

// Relaciones
Veterinaria.hasMany(Factura, {
    foreignKey: 'veterinaria_id',
    as: 'facturas'
});

Factura.belongsTo(Veterinaria, {
    foreignKey: 'veterinaria_id',
    as: 'veterinaria'
});

Usuario.hasMany(Factura, {
    foreignKey: 'cliente_id',
    as: 'facturas'
});

Factura.belongsTo(Usuario, {
    foreignKey: 'cliente_id',
    as: 'cliente'
});

addAuditHooks(Factura);

export default Factura;