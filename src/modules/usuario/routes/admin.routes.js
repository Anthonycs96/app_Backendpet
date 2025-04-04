import express from "express";
import {
    obtenerUsuarios,
    obtenerUsuariosPendientes,
    obtenerUsuariosPorRol,
    obtenerEstadisticasGenerales,
    obtenerEstadisticasUsuariosPorEstado
} from "../controllers/busqueda.controller.js";
import {
    aprobarUsuario,
    rechazarUsuario,
    eliminarUsuario,
    actualizarsueldorol,
    actualizarEspecialidad
} from "../controllers/gestion.controller.js";
import { verifyToken, verificarRol } from "../../../middleware/auth.js";

const router = express.Router();

// Middleware de autenticación para admin
router.use(verifyToken, verificarRol(["Administrador"]));

// Rutas de gestión
router.get("/usuarios", obtenerUsuarios);
router.get("/usuarios/pendientes", obtenerUsuariosPendientes);
router.get("/usuarios/rol/:rol", obtenerUsuariosPorRol);
router.get("/estadisticas", obtenerEstadisticasGenerales);
router.get("/estadisticas-estado", obtenerEstadisticasUsuariosPorEstado);

router.post("/aprobar-usuario/:id", aprobarUsuario);
router.post("/rechazar-usuario/:id", rechazarUsuario);
router.post("/eliminar-usuario/:id", eliminarUsuario);
router.post("/actualizar-sueldo/:id", actualizarsueldorol);
router.post("/actualizar-especialidad/:id", actualizarEspecialidad);

export default router;