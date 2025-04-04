import express from "express";
import { verifyToken, verificarRol } from "../../../middleware/auth.js";
import {
    obtenerCitasPorEstado,
    obtenerCitasPorVeterinario
} from "../controllers/busqueda.controller.js";
import {
    confirmarCita,
    completarCita,
    marcarNoAsistio
} from "../controllers/gestion.controller.js";

const router = express.Router();

router.use(verifyToken, verificarRol(["Veterinario"]));

router.get("/estado/:estado", obtenerCitasPorEstado);
router.get("/mis-citas/:id", obtenerCitasPorVeterinario);
router.patch("/:id/confirmar", confirmarCita);
router.patch("/:id/completar", completarCita);
router.patch("/:id/no-asistio", marcarNoAsistio);

export default router;