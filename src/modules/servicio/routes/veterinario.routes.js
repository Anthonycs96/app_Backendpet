import express from "express";
import { verifyToken, verificarRol } from "../../../middleware/auth.js";
import veterinarioServicioController from "../controllers/veterinario.controller.js";

const router = express.Router();

router.use(verifyToken, verificarRol(["Veterinario"]));

router.get("/mis-servicios", veterinarioServicioController.misServicios);
router.put("/disponibilidad", veterinarioServicioController.actualizarDisponibilidad);
router.get("/:id", veterinarioServicioController.obtenerServicio);

export default router;