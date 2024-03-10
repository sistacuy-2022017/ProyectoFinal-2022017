import { Router } from "express";
import { validarCampos } from "../middlewares/validarCampos.js";
import { explorarProductos } from "./producto.controller.js";
const routerProductss = Router();

routerProductss.post(
    '/',
    [
        validarCampos
    ],
    explorarProductos
);

export default routerProductss;