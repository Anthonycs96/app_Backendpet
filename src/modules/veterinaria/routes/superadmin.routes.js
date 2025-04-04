import express from "express";
import { verifyToken, verificarSuperAdmin } from "../../../middleware/auth.js";
import { crearVeterinaria, cambiarEstadoVeterinaria, obtenerVeterinarias, eliminarVeterinaria, obtenerReportesGlobales } from "../controllers/superadmin/gestion.controller.js";

const router = express.Router();

// Middleware de autenticación
router.use(verifyToken, verificarSuperAdmin);

// Gestión de veterinarias
router.post("/", crearVeterinaria);
router.patch("/:id/estado", cambiarEstadoVeterinaria);
router.get("/todas", obtenerVeterinarias);
router.get("/reportes", obtenerReportesGlobales);
router.delete("/:id", eliminarVeterinaria);

export default router;