import express from "express";
import { login, registersuperadmin, loginLimter, solicitarCodigo, verificarCodigo, cambiarPassword } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", loginLimter, login);
router.post("/register/superadmin", registersuperadmin);
router.post("/solicitar-recuperacion", solicitarCodigo);
router.post("/verificar-codigo", verificarCodigo);
router.post("/cambiar-password", cambiarPassword);

export default router;
