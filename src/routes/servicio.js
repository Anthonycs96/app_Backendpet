import express from "express";
import {
    crearServicio,
    obtenerServicios,
    obtenerServicioPorId,
    actualizarServicio,
    eliminarServicio
} from "../controllers/servicioController.js";
import { verifyToken } from "../middlewares/auth.js"; // ✅ Middleware para proteger las rutas

const router = express.Router();

// ✅ Rutas protegidas con autenticación
router.post("/", verifyToken, crearServicio);
router.get("/", verifyToken, obtenerServicios);
router.get("/:id", verifyToken, obtenerServicioPorId);
router.put("/:id", verifyToken, actualizarServicio);
router.delete("/:id", verifyToken, eliminarServicio);

export default router;
