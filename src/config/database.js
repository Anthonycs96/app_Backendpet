import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const useSSL = process.env.USE_SSL === "true";

// Extraer las credenciales de DATABASE_URL
const parseDBUrl = (url) => {
    const regex = /mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/;
    const matches = url.match(regex);
    if (!matches) {
        throw new Error('Invalid DATABASE_URL format');
    }
    return {
        user: matches[1],
        password: matches[2],
        host: matches[3],
        port: matches[4],
        database: matches[5]
    };
};

const dbConfig = parseDBUrl(process.env.DATABASE_URL);

const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.user,
    dbConfig.password,
    {
        host: dbConfig.host,
        port: dbConfig.port,
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
    }
);

(async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ Conexión exitosa a la base de datos.");
    } catch (error) {
        console.error("❌ Error al conectar a la base de datos:", error.message);
    }
})();

export { sequelize };
export default sequelize;
