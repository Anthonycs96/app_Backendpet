import express from "express";
import { verifyToken, verificarSuperAdmin } from "../../../middleware/auth.js";
import {
    obtenerTodosLosHorarios,
    configurarDiasFestivos,
    gestionarHorariosGlobales
} from "../controllers/superadmin.controller.js";

const router = express.Router();

router.use(verifyToken, verificarSuperAdmin);

router.get("/todos", obtenerTodosLosHorarios);
router.post("/dias-festivos", configurarDiasFestivos);
router.put("/configuracion-global", gestionarHorariosGlobales);

export default router;