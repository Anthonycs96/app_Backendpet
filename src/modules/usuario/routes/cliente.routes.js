import express from "express";
import {
    registrarUsuarioCliente,
    registrarUsuarioClienteEnVeterinaria
} from "../controllers/auth.controller.js";
import {
    perfilPorId,
    actualizarPerfilId
} from "../controllers/perfil.controller.js";
import { verifyToken } from "../../../middleware/auth.js";
import { validarRegistroCliente } from "../../../middleware/cliente.validator.js";
import { registrarCliente } from "../controllers/cliente.controller.js";

const router = express.Router();

router.post("/registrar", validarRegistroCliente, registrarCliente);
router.use(verifyToken);

// Ruta para registrar un nuevo cliente
router.post("/registrar-en-veterinaria", registrarUsuarioClienteEnVeterinaria);
router.get("/perfil/:id", perfilPorId);
router.put("/perfil/:id", actualizarPerfilId);

export default router;