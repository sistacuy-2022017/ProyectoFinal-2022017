import { Router } from "express";
import { categoryPost } from "./category.controller.js";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validarCampos.js";

const routerCateg = Router();

routerCateg.post(
    '/',
    [
        validarCampos
    ],
    categoryPost
);

export default routerCateg;