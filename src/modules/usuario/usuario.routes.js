import express from "express";
import authRoutes from "./routes/auth.routes.js";
import superadminRoutes from "./routes/superadmin.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import clienteRoutes from "./routes/cliente.routes.js";

const router = express.Router();

// Rutas de autenticación (públicas)
router.use("/auth", authRoutes);

// Rutas específicas por rol
router.use("/superadmin", superadminRoutes);
router.use("/admin", adminRoutes);
router.use("/cliente", clienteRoutes);


export default router;
