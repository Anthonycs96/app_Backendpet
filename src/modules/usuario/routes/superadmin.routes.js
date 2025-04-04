import express from "express";
import { registersuperadmin } from "../controllers/auth.controller.js";
import {
    aprobarAdministrador,
    eliminarUsuarioAdmin
} from "../controllers/gestion.controller.js";
import { verifyToken, verificarSuperAdmin } from "../../../middleware/auth.js";

const router = express.Router();

// Middleware de autenticación para superadmin
router.use(verifyToken, verificarSuperAdmin);

router.post("/register", registersuperadmin);
router.post("/aprobar-administrador/:id", aprobarAdministrador);
router.post("/eliminar-admin/:id", eliminarUsuarioAdmin);

export default router;