import Product from "./product.model.js";
import { response, request } from "express";

export const productPost = async (req = request, res = response) => {
    const { name, description, price, stockProduc, category } = req.body;
    const product = new Product({ name, description, price, stockProduc, agotadoProduc, category });
    console.log(product);

    await product.save();

    return res.status(200).json({
        product
    })
}


export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const usuariovalidacion = req.admin;

    if (usuariovalidacion.role !== 'ADMIN') {
        return res.status(400).json({
            msg: 'No tienes permiso para realizar esta operación porque no eres administrador.'
        });
    }

    try {
        // Verificar si el producto existe
        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }

        // Actualizar el producto con los datos proporcionados
        const { _id, ...resto } = req.body;
        await Product.findByIdAndUpdate(id, resto);

        // Obtener el producto actualizado
        const updatedProduct = await Product.findById(id);

        res.status(200).json({
            msg: 'Producto actualizado exitosamente',
            product: updatedProduct
        });
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(400).json({ error: error.message });
    }
};


export const getProductStockAndSalesStatus = async (req, res) => {
    try {
        // Obtener todos los productos de la base de datos
        const allProducts = await Product.find();

        // Ordenar los productos por la cantidad vendida en orden descendente
        allProducts.sort((a, b) => b.stockProduc - a.stockProduc);

        // Determinar el estado del stock y si son productos más vendidos
        const productsWithStockAndSalesStatus = allProducts.map(product => {
            let agotadoProduct = '';
            switch (true) {
                case product.stockProduc === 0:
                    agotadoProduct = 'Agotado';
                    break;
                case product.stockProduc > 0 && product.stockProduc <= 10:
                    agotadoProduct = 'Stock bajo';
                    break;
                default:
                    agotadoProduct = 'Disponible';
            }
            const isMostSold = allProducts.indexOf(product) < 100; // Primeros 5 productos más vendidos

            return {
                _id: product._id,
                name: product.name,
                stockProduc: product.stockProduc,
                agotadoProduct: agotadoProduct, // Estado del stock
                mostSold: isMostSold // Indicador de producto más vendido
            };
        });

        res.status(200).json({
            msg: 'Estado del stock y productos más vendidos obtenidos exitosamente',
            products: productsWithStockAndSalesStatus
        });
    } catch (error) {
        console.error('Error al obtener el estado del stock y productos más vendidos:', error);
        res.status(400).json({ error: error.message });
    }
};