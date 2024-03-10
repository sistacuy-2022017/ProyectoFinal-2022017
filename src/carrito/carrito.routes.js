import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validarCampos.js";
import { validarJWT } from "../helpers/validar-jwt.js";
import { agregarProductoAlCarrito } from "./carrito.controller.js";
const routerCarrito = Router();

routerCarrito.post(
    '/',
    [
        validarJWT,
        validarCampos
    ],
    agregarProductoAlCarrito
);

export default routerCarrito;