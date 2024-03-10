import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validarCampos.js";
import { completarCompra } from "./factura.controller.js";
import { validarJWT } from "../helpers/validar-jwt.js";
const facturaRoutes = Router();

facturaRoutes.get(
    '/',
    [
        validarJWT
    ],
    completarCompra
);

export default facturaRoutes;