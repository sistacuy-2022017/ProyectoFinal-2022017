import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from '../middlewares/validarCampos.js'
import { usersPost, usersUpdate, eliminarUser } from '../users/user.controller.js';
import { existePersonByEmail, verificarUser } from "../middlewares/users-validators.js";
import { validarJWT } from "../helpers/validar-jwt.js";
const routerUsers = Router();

routerUsers.post(
    '/',
    [
        //check("name", "this name is a parameter required").not().isEmpty(),
        //check("email", "the parameter is required").isEmail(),
        //check("password", "the pass is required").isLength({ min: 6, }),
        // check("role", "the parameter role is required").not().isEmpty(),
        check("email").custom(existePersonByEmail),
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
    '/:id',
    [
        validarJWT,
        validarCampos
    ],
    eliminarUser
);


export default routerUsers;