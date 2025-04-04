import express from "express";
import { verifyToken, verificarRol } from "../../../middleware/auth.js";
import { listarTodos, eliminarPaciente, generarReporte, asignarVeterinario } from "../controllers/admin.controller.js";

const router = express.Router();

router.use(verifyToken, verificarRol(["Administrador"]));

// Rutas para administradores
router.get("/", listarTodos);
router.delete("/:id", eliminarPaciente);
router.get("/reportes", generarReporte);
router.post("/:id/asignar-veterinario", asignarVeterinario);

export default router;