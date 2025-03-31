import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; // Asegúrate de importar tu instancia de Sequelize
import Veterinaria from "./Veterinaria.js";

const Servicio = sequelize.define('Servicio', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.TEXT,
    },
}, {
    tableName: "servicio", // Nombre real de la tabla en la BD
    timestamps: true, // Usa los timestamps `createdAt` y `updatedAt`
});
export default Servicio;