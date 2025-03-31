import express from "express";
import {
    registrarVeterinaria,
    obtenerVeterinarias,
    obtenerVeterinariaPorId,
    actualizarVeterinaria,
    eliminarVeterinaria,
    obtenerVeterinariasCercanas,
} from "../controllers/veterinariaController.js";
import { verifyToken, verificarRol } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", verifyToken, verificarRol(["Administrador", "superadmin"]), registrarVeterinaria);
router.get("/", verifyToken, verificarRol(["superadmin", "Administrador", "Veterinario", "Recepcionista", "Asistente Veterinario", "Personal de Servicios", "Encargado de Inventario", "Cliente"]), obtenerVeterinarias);
router.get("/:id", verifyToken, verificarRol(["superadmin", "Administrador", "Veterinario", "Recepcionista", "Asistente Veterinario", "Personal de Servicios", "Encargado de Inventario", "Cliente"]), obtenerVeterinariaPorId);
router.put("/:id", verifyToken, verificarRol(["Administrador", "superadmin"]), actualizarVeterinaria);
router.delete("/:id", verifyToken, verificarRol(["Administrador", "superadmin"]), eliminarVeterinaria);
router.get("/cercanas", verifyToken, verificarRol(["superadmin", "Administrador", "Veterinario", "Recepcionista", "Asistente Veterinario", "Personal de Servicios", "Encargado de Inventario", "Cliente"]), obtenerVeterinariasCercanas);

export default router;
