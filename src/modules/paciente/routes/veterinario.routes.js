import express from "express";
import { verifyToken, verificarRol } from "../../../middleware/auth.js";
import { registrarPaciente, obtenerPacientePorId, actualizarPaciente } from "../controllers/veterinario.controller.js";

const router = express.Router();

router.use(verifyToken, verificarRol(["Veterinario"]));

// Rutas para veterinarios
router.post("/", registrarPaciente);
router.get("/:id", obtenerPacientePorId);
router.put("/:id", actualizarPaciente);

export default router;