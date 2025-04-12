import express from "express";
import { verifyToken, verificarRol } from "../../../middleware/auth.js";
import { propietarioPacienteController } from "../controllers/propietario.controller.js";
import { misMascotas } from "../controllers/propietario.controller.js";

const router = express.Router();

router.use(verifyToken, verificarRol(["Cliente"]));

// Rutas para clientes
router.post("/", propietarioPacienteController);
router.get("/", misMascotas);
// router.get("/:id", obtenerPacientePorId);
// router.put("/:id", actualizarPaciente);

export default router;