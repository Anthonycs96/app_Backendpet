import express from "express";
import { verifyToken, verificarRol } from "../../../middleware/auth.js";
import { registrarVeterinaria, obtenerMiVeterinaria, actualizarVeterinaria, agregarServicio, eliminarServicio, actualizarHorarios, listarPersonal, agregarPersonal, eliminarPersonal } from "../controllers/admin/gestion.controller.js";
import { estadisticasController } from "../controllers/admin/estadisticas.controller.js";

const router = express.Router();

// Middleware de autenticación
router.use(verifyToken, verificarRol(["Administrador"]));

// Gestión de veterinaria
router.get("/mi-veterinaria", obtenerMiVeterinaria);
router.put("/:id", actualizarVeterinaria);
router.post("/servicios", agregarServicio);
router.delete("/servicios/:id", eliminarServicio);
router.put("/horarios", actualizarHorarios);

// Estadísticas
router.get("/:id/estadisticas", estadisticasController.obtenerEstadisticasGenerales);
router.get("/:id/estadisticas/mensual", estadisticasController.obtenerEstadisticasMensuales);
router.get("/:id/kpis", estadisticasController.obtenerKPIs);

// Personal
router.get("/personal", listarPersonal);
router.post("/personal", agregarPersonal);
router.delete("/personal/:id", eliminarPersonal);

export default router;