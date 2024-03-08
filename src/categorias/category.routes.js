import { Router } from "express";
import { categoryPost, categoryPut, categoryDelete } from "./category.controller.js";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validarCampos.js";
import { validarJWT } from "../helpers/validar-jwt.js";

const routerCateg = Router();

routerCateg.post(
    '/',
    [
        validarJWT,
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

routerCateg.delete(
    '/:id',
    [
        validarJWT,
        validarCampos
    ],
    categoryDelete
);

export default routerCateg;