import express from "express";
import { verifyToken, verificarRol } from "../../../middleware/auth.js";
import { veterinarioVeterinariaController } from "../controllers/veterinario/gestion.controller.js";

const router = express.Router();

// Middleware de autenticación
router.use(verifyToken, verificarRol(["Veterinario"]));

// Gestión de servicios y horarios
router.get("/mi-horario", veterinarioVeterinariaController.consultarMiHorario);
router.put("/mi-horario", veterinarioVeterinariaController.actualizarMiHorario);
router.get("/mis-servicios", veterinarioVeterinariaController.listarMisServicios);
router.post("/servicios/disponibilidad", veterinarioVeterinariaController.actualizarDisponibilidad);

// Estadísticas personales
router.get("/mis-estadisticas", veterinarioVeterinariaController.obtenerEstadisticasPersonales);

export default router;