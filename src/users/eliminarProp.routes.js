import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from '../middlewares/validarCampos.js'
import { actualizarUsuarioAll, eliminarUsersAll } from '../users/user.controller.js';
import { verificarUser } from "../middlewares/users-validators.js";
import { validarJWT } from "../helpers/validar-jwt.js";
const routerUsers = Router();

routerUsers.delete(
    '/:id',
    [
        validarJWT,
        validarCampos
    ],
    eliminarUsersAll
);

routerUsers.put(
    '/:id',
    [
        validarJWT,
        validarCampos
    ],
    actualizarUsuarioAll
);


export default routerUsers;