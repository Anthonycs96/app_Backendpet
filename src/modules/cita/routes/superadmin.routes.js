import express from "express";
import { verifyToken, verificarSuperAdmin } from "../../../middleware/auth.js";
import { obtenerCitasPorVeterinaria } from "../controllers/busqueda.controller.js";

const router = express.Router();

router.use(verifyToken, verificarSuperAdmin);

router.get("/todas", obtenerCitasPorVeterinaria);

export default router;