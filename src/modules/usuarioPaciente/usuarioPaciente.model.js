import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';
import { addAuditHooks } from '../../middleware/auditoriaHooks.js';

const UsuarioPaciente = sequelize.define('UsuarioPaciente', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    usuarioId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: 'usuarios',
            key: 'id'
        }
    },
    pacienteId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: 'pacientes',
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
    tableName: 'usuario_paciente',
    timestamps: true
});

addAuditHooks(UsuarioPaciente);

export default UsuarioPaciente;
