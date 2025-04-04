import express from "express";
import adminRoutes from "./routes/admin.routes.js";
import veterinarioRoutes from "./routes/veterinario.routes.js";
import clienteRoutes from "./routes/cliente.routes.js";

const router = express.Router();

router.use("/admin", adminRoutes);
router.use("/veterinario", veterinarioRoutes);
router.use("/cliente", clienteRoutes);

export default router;