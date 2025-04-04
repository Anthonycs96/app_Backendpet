import express from "express";
import { verifyToken, verificarRol } from "../../../middleware/auth.js";
import { obtenerCitasPorPaciente } from "../controllers/busqueda.controller.js";
import {
    crearCita,
    reprogramarCita
} from "../controllers/gestion.controller.js";

const router = express.Router();

router.use(verifyToken, verificarRol(["Cliente"]));

router.get("/paciente/:id", obtenerCitasPorPaciente);
router.post("/", crearCita);
router.patch("/:id/reprogramar", reprogramarCita);

export default router;