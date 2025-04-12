import Auditoria from '../modules/auditoria/auditoria.model.js';

export const addAuditHooks = (model) => {
    const registrarAuditoria = async (instance, options, accion) => {
        try {
            const usuario_id = options.usuario_id || options.userId || null;
            if (!usuario_id) {
                console.warn('No se pudo obtener el ID del usuario para la auditoría.');
                return;
            }
            // Verificar si la acción es válida

            const datosAuditoria = {
                tabla: model.tableName,
                registro_id: instance.id,
                accion,
                valores_anteriores: accion === 'actualizar' ? instance._previousDataValues :
                    accion === 'eliminar' ? instance.toJSON() : null,
                valores_nuevos: accion === 'crear' ? instance.toJSON() :
                    accion === 'actualizar' ? instance.dataValues : null,
                usuario_id,
                ip_usuario: options.ipAddress,
                navegador: options.userAgent,
                sistema_operativo: options.platformInfo
            };

            await Auditoria.create(datosAuditoria);
        } catch (error) {
            console.error('Error al registrar auditoría:', error);
        }
    };

    // Hook para crear
    model.addHook('afterCreate', async (instance, options) => {
        await registrarAuditoria(instance, options, 'crear');
    });

    // Hook para actualizar
    model.addHook('afterUpdate', async (instance, options) => {
        await registrarAuditoria(instance, options, 'actualizar');
    });

    // Hook para eliminar
    model.addHook('afterDestroy', async (instance, options) => {
        await registrarAuditoria(instance, options, 'eliminar');
    });
};