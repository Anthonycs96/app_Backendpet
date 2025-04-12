import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

// Importar rutas de usuario
import authRoutes from "./modules/usuario/routes/auth.routes.js";
import usuarioRoutes from "./modules/usuario/usuario.routes.js";
import adminUserRoutes from "./modules/usuario/routes/admin.routes.js";
import superAdminUserRoutes from "./modules/usuario/routes/superadmin.routes.js";
import clienteUserRoutes from "./modules/usuario/routes/cliente.routes.js";

// Importar rutas de veterinaria
import veterinariaRoutes from "./modules/veterinaria/veterinaria.routes.js";
import adminVeterinariaRoutes from "./modules/veterinaria/routes/admin.routes.js";
import superAdminVeterinariaRoutes from "./modules/veterinaria/routes/superadmin.routes.js";
import clienteVeterinariaRoutes from "./modules/veterinaria/routes/cliente.routes.js";
import veterinarioVeterinariaRoutes from "./modules/veterinaria/routes/veterinario.routes.js";

// Importar rutas de cita
import citaRoutes from "./modules/cita/cita.routes.js";
import adminCitaRoutes from "./modules/cita/routes/admin.routes.js";
import superAdminCitaRoutes from "./modules/cita/routes/superadmin.routes.js";
import clienteCitaRoutes from "./modules/cita/routes/cliente.routes.js";
import veterinarioCitaRoutes from "./modules/cita/routes/veterinario.routes.js";

// Importar rutas de horario
import horarioRoutes from "./modules/horario/horario.routes.js";
import adminHorarioRoutes from "./modules/horario/routes/admin.routes.js";
import superAdminHorarioRoutes from "./modules/horario/routes/superadmin.routes.js";
import clienteHorarioRoutes from "./modules/horario/routes/cliente.routes.js";
import veterinarioHorarioRoutes from "./modules/horario/routes/veterinario.routes.js";

// Importar rutas de servicio
import servicioRoutes from "./modules/servicio/servicio.routes.js";
import adminServicioRoutes from "./modules/servicio/routes/admin.routes.js";
import clienteServicioRoutes from "./modules/servicio/routes/cliente.routes.js";
import veterinarioServicioRoutes from "./modules/servicio/routes/veterinario.routes.js";

// Importar rutas de paciente
import pacienteRoutes from "./modules/paciente/paciente.routes.js";
import adminPacienteRoutes from "./modules/paciente/routes/admin.routes.js";
import asistentePacienteRoutes from "./modules/paciente/routes/asistente.routes.js";
import recepcionistaPacienteRoutes from "./modules/paciente/routes/recepcionista.routes.js";
import veterinarioPacienteRoutes from "./modules/paciente/routes/veterinario.routes.js";
import clientePacienteRoutes from "./modules/paciente/routes/cliente.routes.js";

const app = express();

// Middlewares de seguridad
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// Rutas de usuario
app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/usuarios/admin", adminUserRoutes);
app.use("/api/usuarios/superadmin", superAdminUserRoutes);
app.use("/api/usuarios/cliente", clienteUserRoutes);

// Rutas de veterinaria
app.use("/api/veterinaria", veterinariaRoutes);
app.use("/api/veterinaria/admin", adminVeterinariaRoutes);
app.use("/api/veterinaria/superadmin", superAdminVeterinariaRoutes);
app.use("/api/veterinaria/cliente", clienteVeterinariaRoutes);
app.use("/api/veterinaria/veterinario", veterinarioVeterinariaRoutes);

// Rutas de cita
app.use("/api/citas", citaRoutes);
app.use("/api/citas/admin", adminCitaRoutes);
app.use("/api/citas/superadmin", superAdminCitaRoutes);
app.use("/api/citas/cliente", clienteCitaRoutes);
app.use("/api/citas/veterinario", veterinarioCitaRoutes);

// Rutas de horario
app.use("/api/horarios", horarioRoutes);
app.use("/api/horarios/admin", adminHorarioRoutes);
app.use("/api/horarios/superadmin", superAdminHorarioRoutes);
app.use("/api/horarios/cliente", clienteHorarioRoutes);
app.use("/api/horarios/veterinario", veterinarioHorarioRoutes);

// Rutas de servicio
app.use("/api/servicios", servicioRoutes);
app.use("/api/servicios/admin", adminServicioRoutes);
app.use("/api/servicios/cliente", clienteServicioRoutes);
app.use("/api/servicios/veterinario", veterinarioServicioRoutes);

// Rutas de paciente
app.use("/api/pacientes", pacienteRoutes);
app.use("/api/pacientes/admin", adminPacienteRoutes);
app.use("/api/pacientes/asistente", asistentePacienteRoutes);
app.use("/api/pacientes/recepcionista", recepcionistaPacienteRoutes);
app.use("/api/pacientes/veterinario", veterinarioPacienteRoutes);
//app.use("/api/pacientes/cliente", clientePacienteRoutes);

export default app;
