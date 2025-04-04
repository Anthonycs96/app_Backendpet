import express from "express";
import { verifyToken, verificarRol } from "../../../middleware/auth.js";
import { registrarPaciente, obtenerPacientesDia } from "../controllers/recepcionista.controller.js";

const router = express.Router();

router.use(verifyToken, verificarRol(["Recepcionista"]));

// Rutas para recepcionistas
router.post("/", registrarPaciente);
router.get("/agenda-dia", obtenerPacientesDia);

export default router;