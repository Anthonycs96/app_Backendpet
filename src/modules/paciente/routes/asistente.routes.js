import express from "express";
import { verifyToken, verificarRol } from "../../../middleware/auth.js";
import { registrarPaciente, obtenerPacientePorId } from "../controllers/asistente.controller.js";

const router = express.Router();

router.use(verifyToken, verificarRol(["Asistente Veterinario"]));

// Rutas para asistentes
router.post("/", registrarPaciente);
router.get("/:id", obtenerPacientePorId);

export default router;