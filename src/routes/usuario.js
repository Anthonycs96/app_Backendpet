import express from "express";
import {
    registrarUsuarioCliente,
    obtenerUsuarios,
    obtenerUsuarioPorId,
    actualizarUsuario,
    eliminarUsuario,
    obtenerUsuariosPorRol,
    aprobarAdministrador,
    registrarUsuarioClienteEnVeterinaria,
    aprobarUsuario,
    rechazarUsuario,
    obtenerUsuariosPendientes,
    actualizarsueldorol,
    actualizarEspecialidad,
    eliminarUsuarioAdmin,
    obtenerEstadisticasUsuariosPorEstado,
    obtenerEstadisticasGenerales

} from "../controllers/usuarioController.js";
import { verifyToken, verificarRol, verificarSuperAdmin } from "../middlewares/auth.js";

const router = express.Router();


// 🚀 Rutas para la gestión de usuarios con permisos
router.post("/registrar-cliente", verifyToken, verificarRol(["Administrador", "Superadmin"]), registrarUsuarioClienteEnVeterinaria);//ok listo
router.patch("/aprobar-administrador/:id", verifyToken, verificarRol(["Superadmin"]), aprobarAdministrador);//ok listo
router.get("/usuarios", verifyToken, verificarRol(["Administrador", "Superadmin"]), obtenerUsuarios);
router.delete("/usuarios/:id", verifyToken, verificarRol(["Administrador", "Superadmin"]), eliminarUsuario);
router.get("/usuarios/rol/:rol", verifyToken, verificarRol(["Administrador", "Superadmin"]), obtenerUsuariosPorRol);
router.post('/aprobar/:id', verifyToken, verificarRol(["Administrador", "Superadmin"]), aprobarUsuario);
router.post('/rechazar/:id', verifyToken, verificarRol(["Administrador", "Superadmin"]), rechazarUsuario);
router.get('/pendientes', verifyToken, verificarRol(["Administrador", "Superadmin"]), obtenerUsuariosPendientes);
router.patch('/actualizar-sueldo-rol/:id', verifyToken, verificarRol(["Administrador", "Superadmin"]), actualizarsueldorol);
router.patch('/actualizar-especialidad/:id', verifyToken, verificarRol(["Administrador", "Superadmin"]), actualizarEspecialidad);
router.delete('/eliminar-usuario/:id', verifyToken, verificarRol(["Administrador", "Superadmin"]), eliminarUsuarioAdmin);
router.get('/estadisticas', verifyToken, verificarRol(["Administrador", "Superadmin"]), obtenerEstadisticasUsuariosPorEstado);
router.get('/estadisticas-generales', verifyToken, verificarRol(["Administrador", "Superadmin"]), obtenerEstadisticasGenerales);

// 🚀 Rutas de la gestión de usuarios
router.post('/registrar', registrarUsuarioCliente);//ok listo
router.get('/:id', verifyToken, obtenerUsuarioPorId);//ok listo
router.put('/:id', verifyToken, actualizarUsuario);//ok listo
router.delete('/:id', verifyToken, eliminarUsuario);//ok listo
export default router;
