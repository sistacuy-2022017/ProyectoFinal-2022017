import { response, request } from "express";
import Category from './category.model.js';
import { existeCategoryByName } from "../middlewares/category-validators.js";

export const categoryPost = async (req = request, res = response) => {
    const { nameCategory, descriptionCategory } = req.body;

    const categ = new Category({ nameCategory, descriptionCategory });
    console.log(categ);

    await categ.save();

    res.status(200).json({
        categ
    })

}

export const categoryPut = async (req, res) => {
    const { id } = req.params;
    const usuariovalid = req.admin;
    const { _id, ...resto } = req.body;

    if (usuariovalid.role !== 'ADMIN') {
        return res.status(400).json({
            msg: '|| No tienes permisos para realizar esta acción ||'
        });
    }

    try {
        if (resto.nameCategory) {
            await existeCategoryByName(resto.nameCategory);
        }

        // Verificar si el nivel de impacto y la categoría empresarial existen
        if (resto.nameCategory) {
            const categoriasExistentes = [
                'Tecnología', 'Salud', 'Finanzas', 'Educación', 'Comercio', 'Manufactura', 'Otro'
            ];

            if (!categoriasExistentes.includes(resto.nameCategory)) {
                throw new Error(`La categoría  "${resto.nameCategory}" no es válida. Debe ser una de: ${categoriasExistentes.join(", ")}`);
            }
        }

        await Category.findByIdAndUpdate(id, resto);

        const catego = await Category.find({ _id: id });

        res.status(200).json({
            msg: '|| Categoria Actualizada ||',
            catego
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al actualizar la categoría' });
    }


}


const categoryDelete = async (req, res) => {
    const { id } = req.params;
    await Category.findByIdAndUpdate(id, { categoryState: false });

    const alumno = await Category.findOne({ _id: id });

    res.status(200).json({
        msg: 'Usuario eliminado, se paso de joya',
        alumno
    });
}