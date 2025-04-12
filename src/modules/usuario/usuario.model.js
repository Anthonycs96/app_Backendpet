import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';

const Usuario = sequelize.define('Usuario', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    paisCode: {
        type: DataTypes.STRING(10),
        allowNull: true,
    },
    telefono: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    direccion: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    estado: {
        type: DataTypes.ENUM("activo", "inactivo"),
        defaultValue: "activo",
    },
    documentoIdentidad: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    // Dentro de tu modelo Usuario:
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    fechaContratacion: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    contraseniaActualizada: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    // Añadir estos dos campos nuevos:
    preguntaSecreta: {
        type: DataTypes.STRING(255),
        allowNull: true, // Puede ser opcional si no todos los usuarios tienen preguntas secretas.
    },
    respuestaSecreta: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },

    estadoRegistro: {
        type: DataTypes.ENUM('pendiente', 'aprobado', 'rechazado'),
        defaultValue: 'pendiente',
    },
    aprobadoPor: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
            model: 'usuarios',
            key: 'id'
        }
    },
    especialidad: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    horarioDisponibilidad: {
        type: DataTypes.JSON, // Para almacenar horarios disponibles
        allowNull: true,
    },
    fotoPerfil: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    notificaciones: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    fechaNacimiento: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    rol: {
        type: DataTypes.ENUM('Cliente', 'Staff', 'Veterinario', 'Groomer', 'Admin', 'Superadmin'), // Define roles como ENUM
        allowNull: false,
    },
    sueldo: {
        type: DataTypes.FLOAT,
        allowNull: true, // Solo se llenará si es trabajador
    },
    resetToken: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    resetTokenExpires: {
        type: DataTypes.DATE,
        allowNull: true,
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
    tableName: "usuarios",
    timestamps: true,
});

export default Usuario;
