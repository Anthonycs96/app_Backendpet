import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";
import Usuario from "../usuario/usuario.model.js";

const Auditoria = sequelize.define("Auditoria", {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    tabla: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    registro_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    accion: {
        type: DataTypes.ENUM('crear', 'actualizar', 'eliminar'),
        allowNull: false
    },
    valores_anteriores: {
        type: DataTypes.JSON,
        allowNull: true
    },
    valores_nuevos: {
        type: DataTypes.JSON,
        allowNull: true
    },
    usuario_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: Usuario,
            key: 'id'
        }
    },
    fecha_cambio: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
    },
    ip_usuario: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    navegador: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    sistema_operativo: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: "auditoria",
    timestamps: false
});

export default Auditoria;