import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Usuario from "./Usuario.js";

const Paciente = sequelize.define("Paciente", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    especie: {
        type: DataTypes.ENUM("Perro", "Gato", "Ave", "Reptil", "Roedor", "Otro"),
        allowNull: false,
    },
    raza: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    edad: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    peso: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario,
            key: "id",
        },
        onDelete: "CASCADE",
    },
    foto: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    fechaNacimiento: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    estado: {
        type: DataTypes.ENUM("activo", "inactivo", "en tratamiento"),
        defaultValue: "activo",
    },
    genero: {
        type: DataTypes.ENUM("Macho", "Hembra"),
        allowNull: true,
    },
    alergias: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    notas: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    creado_en: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
});

export default Paciente;
