import express from "express";
import { verifyToken } from "../../../middleware/auth.js";
import { buscarServicios, obtenerDetalleServicio } from "../controllers/cliente.controller.js";

const router = express.Router();

router.use(verifyToken);

router.get("/buscar", buscarServicios);
router.get("/:id", obtenerDetalleServicio);

export default router;