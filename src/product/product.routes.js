import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validarCampos.js";
import { productPost, updateProduct, getProductStockAndSalesStatus, deleteProduct } from "./producto.controller.js";
import { validarJWT } from "../helpers/validar-jwt.js";
const routerProducts = Router();

routerProducts.post(
    '/',
    [
        validarCampos
    ],
    productPost
);

routerProducts.put(
    '/:id',
    [
        validarJWT,
        validarCampos
    ],
    updateProduct
);

routerProducts.get(
    '/',
    [
        validarCampos
    ],
    getProductStockAndSalesStatus
);

routerProducts.delete(
    '/:id',
    [
        validarJWT,
        validarCampos
    ],
    deleteProduct
);


export default routerProducts;