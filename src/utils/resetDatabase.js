import sequelize from "../config/database.js";
import {
    Usuario,
    Veterinaria,
    Servicio,
    Paciente,
    Cita,
    HorarioAtencion,
    Factura,
    DetalleFactura,
    Pago,
    PrecioServicio,
    Promocion,
    ServicioPromocion,
    PuntosCliente,
    HistorialPuntos
} from "../models/index.js";

const resetDatabase = async () => {
    try {
        console.log("🔄 Iniciando reset de la base de datos...");

        // Forzar la sincronización de todos los modelos
        await sequelize.sync({ force: true });

        console.log("✅ Base de datos reseteada exitosamente");

        // Crear datos iniciales
        await seedInitialData();

        console.log("✨ Proceso completado");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error al resetear la base de datos:", error);
        process.exit(1);
    }
};

const seedInitialData = async () => {
    try {
        // Crear usuario administrador inicial
        const admin = await Usuario.create({
            nombre: "Administrador",
            email: "admin@veterinaria.com",
            password: "admin123",
            rol: "ADMIN"
        });

        // Crear una veterinaria de ejemplo
        const veterinaria = await Veterinaria.create({
            nombre: "Veterinaria Principal",
            direccion: "Av. Principal 123",
            telefono: "123456789",
            email: "info@veterinaria.com",
            estado: "activo"
        });

        // Crear algunos servicios básicos
        await Servicio.bulkCreate([
            {
                nombre: "Consulta General",
                descripcion: "Revisión general de la mascota",
                veterinaria_id: veterinaria.id
            },
            {
                nombre: "Vacunación",
                descripcion: "Servicio de vacunación",
                veterinaria_id: veterinaria.id
            }
        ]);

        console.log("✅ Datos iniciales agregados correctamente");
    } catch (error) {
        console.error("❌ Error al agregar datos iniciales:", error);
        throw error;
    }
};

resetDatabase();