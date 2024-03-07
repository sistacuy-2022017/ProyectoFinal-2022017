import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validarCampos.js";
import { facturaPost } from "./factura.controller.js";
const facturaRoutes = Router();

facturaRoutes.post(
    '/',
    [
        validarCampos
    ],
    facturaPost
);

export default facturaRoutes;