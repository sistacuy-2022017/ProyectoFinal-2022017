import { Router } from 'express';
import { userLogi } from './auth.controller.js';
import { validarCampos } from '../middlewares/validarCampos.js';
import { check } from 'express-validator';
const routersAuth = Router();

routersAuth.post(
    '/',
    [
        validarCampos
    ],  
    userLogi
);

export default routersAuth;