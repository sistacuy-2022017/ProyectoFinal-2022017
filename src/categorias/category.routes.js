import { Router } from "express";
import { categoryPost, categoryPut } from "./category.controller.js";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validarCampos.js";
import { validarJWT } from "../helpers/validar-jwt.js";

const routerCateg = Router();

routerCateg.post(
    '/',
    [
        validarCampos
    ],
    categoryPost
);

routerCateg.put(
    '/:id',
    [
        validarJWT,
        validarCampos
    ],
    categoryPut
);

export default routerCateg;