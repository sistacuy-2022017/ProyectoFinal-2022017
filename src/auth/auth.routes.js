import { Router } from 'express';
import { userLogi } from './auth.controller.js';
import { validarCampos } from '../middlewares/validarCampos.js';
import { check } from 'express-validator';
import { validarJWT } from '../helpers/validar-jwt.js';
import { historialDeCompra } from '../factura/factura.controller.js';
import { existePersonByEmail } from '../middlewares/users-validators.js';
const routersAuth = Router();

routersAuth.post(
    '/',
    [
        validarCampos
    ],  
    userLogi
);

routersAuth.get(
    '/',
    [   
       validarJWT 
    ],
    historialDeCompra
)

export default routersAuth;