import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from '../middlewares/validarCampos.js'
import { usersPost } from '../users/user.controller.js';
import { verificarUser } from "../middlewares/users-validators.js";

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

export default routerUsers;