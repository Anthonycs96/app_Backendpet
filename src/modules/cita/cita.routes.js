import express from "express";
import adminRoutes from "./routes/admin.routes.js";
import veterinarioRoutes from "./routes/veterinario.routes.js";
import clienteRoutes from "./routes/cliente.routes.js";
import superadminRoutes from "./routes/superadmin.routes.js";

const router = express.Router();

// Rutas específicas por rol
router.use("/admin", adminRoutes);
router.use("/veterinario", veterinarioRoutes);
router.use("/cliente", clienteRoutes);
router.use("/superadmin", superadminRoutes);

export default router;
