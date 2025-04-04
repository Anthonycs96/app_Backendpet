import express from "express";
import { verifyToken } from "../../../middleware/auth.js";
import { buscarVeterinarias, obtenerDetalleVeterinaria, listarServicios, consultarHorarios, valorarVeterinaria, obtenerVeterinariasVisitadas } from "../controllers/cliente/busqueda.controller.js";

const router = express.Router();

// Rutas públicas
router.get("/buscar", buscarVeterinarias);
router.get("/:id", obtenerDetalleVeterinaria);
router.get("/:id/servicios", listarServicios);
router.get("/:id/horarios", consultarHorarios);

// Rutas que requieren autenticación
router.use(verifyToken);
router.post("/:id/valoracion", valorarVeterinaria);
router.get("/mis-veterinarias", obtenerVeterinariasVisitadas);

export default router;