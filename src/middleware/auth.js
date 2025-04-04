import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    console.log("🔹 Token recibido:", authHeader);

    if (!authHeader) {
        console.log("❌ No se proporcionó token");
        return res.status(401).json({ error: "Acceso denegado" });
    }

    try {
        const token = authHeader.replace("Bearer ", ""); // Limpiar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log("✅ Token decodificado:", decoded);

        if (!decoded.id || !decoded.rol) {  // Verifica que el token tenga ID y ROL
            console.log("❌ El token no contiene un ID o un ROL válido");
            return res.status(401).json({ message: "Estructura de token no válida" });
        }

        req.usuario = decoded;  // Guarda el usuario completo en `req.usuario`
        console.log(`✅ Usuario autenticado con ID: ${req.usuario.id} y Rol: ${req.usuario.rol}`);
        next();
    } catch (error) {
        console.log("❌ Error al verificar el token:", error.message);
        return res.status(401).json({ error: "Token inválido" });
    }
};

// 🚀 Middleware para verificar roles
export const verificarRol = (rolesPermitidos) => {
    return (req, res, next) => {
        console.log("👤 Usuario autenticado:", req.usuario);

        if (!req.usuario || !req.usuario.rol) {
            return res.status(403).json({ error: "Acceso denegado. No se encontró el rol del usuario." });
        }

        if (!rolesPermitidos.includes(req.usuario.rol)) {
            return res.status(403).json({ error: "Acceso denegado. No tienes permisos suficientes." });
        }

        console.log(`✅ Acceso permitido al usuario con rol: ${req.usuario.rol}`);
        next();
    };
};

export const verificarSuperAdmin = (req, res, next) => {
    const { id: idParametro } = req.params; //captura el id del parametro
    const { id: idToken, rol } = req.usuario; //captura el id del token y el rol

    console.log(`🔍 Verificando acceso del usuario con ID ${idToken} y rol ${rol} al recurso ID ${idParametro}`); //imprime el id del token y el rol

    if (idParametro === idToken || rol === "Administrador" || rol === "Superadmin") {
        console.log("✅ Acceso permitido: Es propietario o tiene rol autorizado");
        return next();
    } else {
        console.log("❌ Acceso denegado: No tienes permisos suficientes");
        return res.status(403).json({ error: "Acceso denegado. No tienes permisos suficientes.", message: "No tienes permisos suficientes." });
    }
}