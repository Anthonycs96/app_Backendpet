import express from "express";
import { verifyToken, verificarRol } from "../../../middleware/auth.js";
import {
    obtenerTodosLosHorarios,
    configurarDiasFestivos,
    gestionarHorariosGlobales
} from "../controllers/superadmin.controller.js";

const router = express.Router();

router.use(verifyToken, verificarRol(["Administrador"]));

// Obtener todos los horarios
router.get("/", obtenerTodosLosHorarios);

// Configurar días festivos
router.post("/dias-festivos", configurarDiasFestivos);

// Gestionar horarios globales
router.put("/gestion", gestionarHorariosGlobales);

export default router;