import express from "express";
import { verifyToken, verificarRol } from "../../../middleware/auth.js";
import adminServicioController from "../controllers/admin.controller.js";

const router = express.Router();

router.use(verifyToken, verificarRol(["Administrador"]));

router.post("/", adminServicioController.crearServicio);
router.put("/:id", adminServicioController.actualizarServicio);

export default router;