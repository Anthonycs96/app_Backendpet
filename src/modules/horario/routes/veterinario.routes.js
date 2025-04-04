import express from "express";
import { verifyToken, verificarRol } from "../../../middleware/auth.js";
import {
    verificarDisponibilidad,
    obtenerHorariosSemana,
    obtenerMiHorario,
    actualizarDisponibilidad
} from "../controllers/veterinarioHorarioController.js";

const router = express.Router();

router.use(verifyToken, verificarRol(["Veterinario"]));

router.get("/:veterinaria_id/disponibilidad", verificarDisponibilidad);
router.get("/:veterinaria_id/semana", obtenerHorariosSemana);
router.get("/mi-horario", obtenerMiHorario);
router.put("/disponibilidad", actualizarDisponibilidad);

export default router;