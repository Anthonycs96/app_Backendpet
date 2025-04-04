import express from "express";
import adminRoutes from "./routes/admin.routes.js";
import superadminRoutes from "./routes/superadmin.routes.js";
import clienteRoutes from "./routes/cliente.routes.js";
import veterinarioRoutes from "./routes/veterinario.routes.js";

const router = express.Router();

// Configuración de rutas por rol
router.use("/admin", adminRoutes);
router.use("/superadmin", superadminRoutes);
router.use("/cliente", clienteRoutes);
router.use("/veterinario", veterinarioRoutes);

export default router;