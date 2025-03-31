import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const UsuarioVeterinaria = sequelize.define('UsuarioVeterinaria', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    usuarioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'usuarios',
            key: 'id'
        }
    },
    veterinariaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'veterinarias',
            key: 'id'
        }
    },
    estado: {
        type: DataTypes.ENUM('activo', 'inactivo'),
        defaultValue: 'activo'
    },
    fechaAsignacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    fechaDesasignacion: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'usuario_veterinaria',
    timestamps: true
});

export default UsuarioVeterinaria;
