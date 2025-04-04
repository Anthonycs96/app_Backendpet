import { check } from 'express-validator';
import { validarCampos } from '../middleware/validar-campos.js';

export const validarRegistroCliente = [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email debe ser válido').isEmail(),
    check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
    check('telefono', 'El teléfono es obligatorio').not().isEmpty(),
    check('direccion', 'La dirección es obligatoria').not().isEmpty(),
    validarCampos
];