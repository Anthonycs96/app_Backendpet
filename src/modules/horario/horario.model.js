import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";
import { addAuditHooks } from '../../middleware/auditoriaHooks.js';

const HorarioAtencion = sequelize.define("HorarioAtencion", {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    veterinaria_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: 'veterinarias',
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    dia_semana: {
        type: DataTypes.ENUM('lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'),
        allowNull: false
    },
    hora_inicio: {
        type: DataTypes.TIME,
        allowNull: false
    },
    hora_fin: {
        type: DataTypes.TIME,
        allowNull: false
    },
    es_feriado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    descripcion: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    disponible: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    usuario_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
            model: 'usuarios',
            key: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    }
}, {
    tableName: "horario_atencion",
    timestamps: true
});

addAuditHooks(HorarioAtencion);

export default HorarioAtencion;
