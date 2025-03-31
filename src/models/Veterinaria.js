import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Veterinaria = sequelize.define("Veterinaria", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    direccion: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isEmail: true,
        },
    },
    estado: {
        type: DataTypes.ENUM("Activo", "Inactivo"),
        defaultValue: "Activo",
    },
    administrador_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // Permitir NULL si no siempre hay un administrador
        references: {
            model: "usuarios", // Nombre de la tabla referenciada
            key: "id",
        },
        onDelete: "SET NULL", // Si el usuario se elimina, establecer administrador_id como NULL
        onUpdate: "CASCADE", // Si el id del usuario cambia, actualizar administrador_id
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: "Veterinaria", // Nombre de la tabla en la base de datos
    timestamps: true, // Agrega `createdAt` y `updatedAt`
});


export default Veterinaria;