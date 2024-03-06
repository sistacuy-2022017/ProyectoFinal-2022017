import productModel from "./product.model.js";
import { response, request } from "express";

export const productPost = async (req = request, res = response) => {
    const { name, description, price , category } = req.body;
    const product = new productModel({ name, description, price, category  });
    console.log(product);

    await product.save();
    
    return res.status(200).json({
        product
    })
}