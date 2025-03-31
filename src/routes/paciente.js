import express from "express";
import {
    registrarPaciente,
    obtenerPacientes,
    obtenerPacientePorId,
    actualizarPaciente,
    eliminarPaciente,
    buscarPacientes,
} from "../controllers/pacienteController.js";
import { verifyToken, verificarRol } from "../middlewares/auth.js";

const router = express.Router();

// 📌 Solo veterinarios, asistentes y recepcionistas pueden registrar pacientes
router.post("/", verifyToken, verificarRol(["Veterinario", "Asistente Veterinario", "Recepcionista"]), registrarPaciente);

// 📌 Todos los usuarios autenticados pueden ver los pacientes
router.get("/", verifyToken, obtenerPacientes);

// 📌 Solo veterinarios y asistentes pueden ver un paciente específico
router.get("/:id", verifyToken, verificarRol(["Veterinario", "Asistente Veterinario"]), obtenerPacientePorId);

// 📌 Solo veterinarios pueden actualizar información médica del paciente
router.put("/:id", verifyToken, verificarRol(["Veterinario"]), actualizarPaciente);

// 📌 Solo administradores pueden eliminar pacientes
router.delete("/:id", verifyToken, verificarRol(["Administrador"]), eliminarPaciente);

// 📌 Todos los usuarios autenticados pueden buscar pacientes
router.get("/buscar", verifyToken, buscarPacientes);

export default router;
