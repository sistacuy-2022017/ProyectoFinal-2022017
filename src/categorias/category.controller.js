import { response, request } from "express";
import Category from './category.model.js';


export const categoryPost = async (req = request, res = response) => {
    const { nameCategory, descriptionCategory } = req.body;

    const categ = new Category({ nameCategory, descriptionCategory });
    console.log(categ);

    await categ.save();

    res.status(200).json({
        categ
    })

}