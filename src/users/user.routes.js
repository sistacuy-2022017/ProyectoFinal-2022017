import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from '../middlewares/validarCampos.js'
import { eliminarUser, usersPost, usersUpdate } from '../users/user.controller.js';
import { verificarUser } from "../middlewares/users-validators.js";
import { validarJWT } from "../helpers/validar-jwt.js"
const routerUsers = Router();

routerUsers.post(
    '/',
    [
        //check("name", "this name is a parameter required").not().isEmpty(),
        //check("email", "the parameter is required").isEmail(),
        //check("password", "the pass is required").isLength({ min: 6, }),
       // check("role", "the parameter role is required").not().isEmpty(),
        verificarUser,
        validarCampos
    ],
        usersPost
);

routerUsers.put(
    '/:id',
    [
        validarJWT,
        validarCampos
    ],
    usersUpdate
);

routerUsers.delete(
    '/',
    [
        validarJWT,
        validarCampos
    ],
    eliminarUser
);

export default routerUsers;