import express from "express";
import { verifyToken } from "../../../middleware/auth.js";
import {
    verificarDisponibilidad,
    obtenerHorariosSemana
} from "../controllers/cliente.controller.js";

const router = express.Router();

router.use(verifyToken);

router.get("/:veterinaria_id/disponibilidad", verificarDisponibilidad);
router.get("/:veterinaria_id/semana", obtenerHorariosSemana);

export default router;