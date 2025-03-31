import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Veterinaria from "./Veterinaria.js";

const HorarioAtencion = sequelize.define("HorarioAtencion", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    veterinaria_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Veterinaria,
            key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    },
    dia_semana: {
        type: DataTypes.ENUM("lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"),
        allowNull: false,
    },
    hora_inicio: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    hora_fin: {
        type: DataTypes.TIME,
        allowNull: false,
        validate: {
            isAfter: (value) => {
                if (value <= this.hora_inicio) {
                    throw new Error("hora_fin debe ser posterior a hora_inicio");
                }
            },
        },
    },
    es_feriado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // Si es feriado, la veterinaria está cerrada ese día
    },
    descripcion: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    disponible: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    tableName: "horario_atencion",
    timestamps: true,
});

export default HorarioAtencion;
