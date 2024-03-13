import { response, request } from "express";
import Category from './category.model.js';
import User from "../users/user.model.js";
import Product from "../product/product.model.js";

export const categoryPost = async (req, res) => {
    const { nameCategory, descriptionCategory } = req.body;
    const usuariovalid = req.admin;

    // Verifica si el usuario es un administrador
    
    if (usuariovalid.role !== 'ADMIN') {
        return res.status(400).json({
            msg: '|| NO TIENES PERMISO PARA HACER ESTO PQ NO ERES ADMIN:C ||'
        });
    }
    try {
        const newCategory = new Category({ nameCategory, descriptionCategory });
        await newCategory.save();

        res.status(200).json({
            category: newCategory
        });
    } catch (error) {
        console.error("Error al crear una nueva categoría:", error);
        res.status(500).json({
            error: 'Hubo un error al crear la categoría.'
        });
    }
};


export const categoryPut = async (req, res) => {
    const { id } = req.params;
    const usuariovalid = req.admin;


    if (usuariovalid.role !== 'ADMIN') {
        return res.status(400).json({
            msg: '|| NO TIENES PERMISO PARA HACER ESTO PQ NO ERES ADMIN:C ||'
        });
    }

    const { _id, ...resto } = req.body;

    await Category.findByIdAndUpdate(id, resto);

    const catego = await Category.find({ _id: id });

    res.status(200).json({
        msg: '|| Categoria Actualizada ||',
        catego
    });

}

export const categoryDelete = async (req, res) => {
    const { id } = req.params;
    const usuariovalid = req.admin;

    try {

        if (usuariovalid.role !== 'ADMIN') {
            return res.status(400).json({
                msg: '|| NO TIENES PERMISO PARA HACER ESTO PQ NO ERES ADMIN:C ||'
            });
        }

        // Encuentra la categoría que se va a eliminar
        const categoryToDelete = await Category.findById(id);

        // Encuentra todos los productos que pertenecen a esta categoría
        const productsToUpdate = await Product.find({ category: id });

        // Encuentra una nueva categoría a la que se transferirán los productos
        const nuevaCategoria = await Category.findOne({ categoryState: true });

        if (!nuevaCategoria) {
            return res.status(404).json({
                error: 'No hay categorías disponibles para transferir los productos.'
            });
        }

        // Actualiza la categoría de los productos para que apunten a la nueva categoría
        await Product.updateMany({ category: id }, { $set: { category: nuevaCategoria._id } });

        // Marca la categoría eliminada como inactiva
        await Category.findByIdAndUpdate(id, { categoryState: false });

        res.status(200).json({
            msg: 'Categoría eliminada y productos transferidos exitosamente.'
        });
    } catch (error) {
        console.error("Error al eliminar la categoría y transferir productos:", error);
        res.status(500).json({
            error: 'Error al eliminar la categoría y transferir productos.'
        });
    }
}

export const getCategoryByName = async (req, res) => {
    const { nameCategori } = req.params;

    try {
        const category = await Category.findOne({ nameCategory: nameCategori });

        if (!category) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        res.status(200).json({ category });
    } catch (error) {
        console.error('Error al buscar la categoría: ', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};