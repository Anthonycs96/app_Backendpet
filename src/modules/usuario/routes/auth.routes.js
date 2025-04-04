import express from "express";
import {
    login,
    loginLimter,
    solicitarCodigo,
    verificarCodigo,
    cambiarPassword,
    resetearPassword
} from "../controllers/auth.controller.js";
import { verifyToken } from "../../../middleware/auth.js";

const router = express.Router();

router.post("/login", loginLimter, login);
router.post("/solicitar-recuperacion", solicitarCodigo);
router.post("/verificar-codigo", verificarCodigo);
router.post("/cambiar-password", cambiarPassword);
router.post("/resetear-password", verifyToken, resetearPassword);

export default router;