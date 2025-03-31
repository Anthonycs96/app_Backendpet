import express from "express";
import {
    agregarHorario,
    obtenerHorarios,
    eliminarHorario,
    verificarDisponibilidad,
} from "../controllers/horarioAtencionController.js";
import { verifyToken, verificarRol } from "../middlewares/auth.js";

const router = express.Router();

// 📌 Agregar un horario (Solo Administradores)
router.post("/", verifyToken, verificarRol(["Administrador"]), agregarHorario);

// 📌 Obtener horarios de una veterinaria
router.get("/:veterinaria_id", verifyToken, obtenerHorarios);

// 📌 Eliminar un horario (Solo Administradores)
router.delete("/:id", verifyToken, verificarRol(["Administrador"]), eliminarHorario);

// 📌 Verificar disponibilidad en un horario específico
router.get("/:veterinaria_id/disponibilidad", verifyToken, verificarDisponibilidad);

export default router;
