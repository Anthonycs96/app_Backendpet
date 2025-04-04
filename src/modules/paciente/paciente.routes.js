import express from "express";
import adminRoutes from "./routes/admin.routes.js";
import veterinarioRoutes from "./routes/veterinario.routes.js";
import asistenteRoutes from "./routes/asistente.routes.js";
import recepcionistaRoutes from "./routes/recepcionista.routes.js";
import { verifyToken } from "../../middleware/auth.js";
import { buscarPacientes } from "./controllers/admin.controller.js";

const router = express.Router();

// Ruta común para búsqueda (requiere solo autenticación)
router.get("/buscar", verifyToken, buscarPacientes);

// Rutas específicas por rol
router.use("/admin", adminRoutes);
router.use("/veterinario", veterinarioRoutes);
router.use("/asistente", asistenteRoutes);
router.use("/recepcionista", recepcionistaRoutes);

export default router;