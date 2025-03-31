import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import citaRoutes from "./routes/cita.js";
import usuarioRoutes from "./routes/usuario.js";
import veterinariaRoutes from "./routes/veterinaria.js";
import horarioAtencionRoutes from "./routes/horarioAtencion.js";
import servicioRoutes from "./routes/servicio.js"; // ✅ Importar rutas de servicios

const app = express();

// Middlewares de seguridad
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/citas", citaRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/veterinaria", veterinariaRoutes);
app.use("/api/horarios", horarioAtencionRoutes);
app.use("/api/servicios", servicioRoutes); // ✅ Agregar rutas de servicios

export default app;
