import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config(); // Cargar variables de entorno

const useSSL = process.env.USE_SSL === "true"; // Mayúsculas en la variable

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "mysql",
    dialectOptions: useSSL
        ? {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        }
        : {},
    logging: false,
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ Conexión exitosa a la base de datos.");
    } catch (error) {
        console.error("❌ Error al conectar a la base de datos:", error.message);
    }
})();

export default sequelize;
