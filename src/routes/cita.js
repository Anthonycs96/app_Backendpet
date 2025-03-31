import express from "express";
import {
    crearCita,
    obtenerCitasPorEstado,
    obtenerCitasPorPaciente,
    obtenerCitasPorVeterinario,
    confirmarCita,
    completarCita,
    cancelarCita,
    reprogramarCita,
    marcarNoAsistio,
    obtenerNumeroCitas,
    obtenerEstadisticasPorVeterinaria,
    obtenerCitasPorVeterinaria
} from "../controllers/citaController.js";
import { verifyToken, verificarRol } from "../middlewares/auth.js";

const router = express.Router();

// 📌 Solo clientes pueden crear citas
router.post("/", verifyToken, verificarRol(["Cliente"]), crearCita);

// 📌 Solo veterinarios y asistentes pueden ver citas según estado
router.get("/estado/:estado", verifyToken, verificarRol(["Veterinario", "Asistente Veterinario"]), obtenerCitasPorEstado);

// 📌 Clientes pueden ver sus propias citas
router.get("/paciente/:id", verifyToken, verificarRol(["Cliente"]), obtenerCitasPorPaciente);

// 📌 Veterinarios pueden ver citas asignadas a ellos
router.get("/veterinario/:id", verifyToken, verificarRol(["Veterinario"]), obtenerCitasPorVeterinario);

// 📌 Solo veterinarios pueden confirmar citas
router.patch("/:id/confirmar", verifyToken, verificarRol(["Veterinario"]), confirmarCita);

// 📌 Solo veterinarios pueden marcar una cita como completada
router.patch("/:id/completar", verifyToken, verificarRol(["Veterinario"]), completarCita);

// 📌 Solo administradores pueden cancelar una cita
router.delete("/:id", verifyToken, verificarRol(["Administrador"]), cancelarCita);

// 📌 Clientes pueden reprogramar su propia cita
router.patch("/:id/reprogramar", verifyToken, verificarRol(["Cliente"]), reprogramarCita);

// 📌 Veterinarios pueden marcar una cita como "No Asistió"
router.patch("/:id/no-asistio", verifyToken, verificarRol(["Veterinario"]), marcarNoAsistio);

// 📌 Obtener el número total de citas
router.get("/numero", verifyToken, verificarRol(["Administrador"]), obtenerNumeroCitas);

// 📌 Obtener estadísticas por veterinaria
router.get("/estadisticas/:veterinariaId", verifyToken, verificarRol(["Administrador"]), obtenerEstadisticasPorVeterinaria);

// 📌 Obtener citas por veterinaria
router.get("/veterinaria/:veterinariaId", verifyToken, verificarRol(["Administrador"]), obtenerCitasPorVeterinaria);

export default router;
