import app from "./app.js";
import sequelize from "./config/database.js";
import os from "os";
import cors from "cors";

import "./models/index.js";

const PORT = process.env.PORT || 5000;

// Configurar CORS
app.use(cors({
    origin: process.env.FRONTEND_URL, // Permitir solicitudes desde el frontend
    credentials: true,
}));

// Función para obtener la IP local automáticamente
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (let iface of Object.values(interfaces)) {
        for (let config of iface) {
            if (config.family === "IPv4" && !config.internal) {
                return config.address; // Retorna la IP local
            }
        }
    }
    return "127.0.0.1"; // Si falla, usa localhost
}

const LOCAL_IP = getLocalIP();

sequelize.sync({ force: false }).then(() => {
    console.log("✅ Base de datos conectada correctamente.");


    app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en:`);
        console.log(`   - Local:   http://localhost:${PORT}`);
        console.log(`   - Red LAN: http://${LOCAL_IP}:${PORT}`);
    });
}).catch((error) => {
    console.error("❌ Error al conectar la base de datos:", error);
});
