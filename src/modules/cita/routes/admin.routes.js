import express from "express";
import { verifyToken, verificarRol } from "../../../middleware/auth.js";
import {
    obtenerNumeroCitas,
    obtenerEstadisticasPorVeterinaria,
    obtenerCitasPorVeterinaria
} from "../controllers/busqueda.controller.js";
import { cancelarCita } from "../controllers/gestion.controller.js";

const router = express.Router();

router.use(verifyToken, verificarRol(["Administrador"]));

router.get("/numero", obtenerNumeroCitas);
router.get("/estadisticas/:veterinariaId", obtenerEstadisticasPorVeterinaria);
router.get("/veterinaria/:veterinariaId", obtenerCitasPorVeterinaria);
router.delete("/:id", cancelarCita);

export default router;