import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validarCampos.js";
import { productPost } from "./producto.controller.js";
const routerProducts = Router();

routerProducts.post(
    '/',
    [
        validarCampos
    ],
    productPost
);


export default routerProducts;