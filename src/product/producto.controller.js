import Product from "./product.model.js";
import { response, request } from "express";
import Category from "../categorias/category.model.js";

export const productPost = async (req = request, res = response) => {
    const { name, description, price, stockProduc, category } = req.body;
    const product = new Product({ name, description, price, stockProduc, category });
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
            const isMostSold = allProducts.indexOf(product) < 10; // Primeros 5 productos más vendidos

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

export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    const usuariovalidacion = req.admin;

    if (usuariovalidacion.role !== "ADMIN_ROLE") {
        return res.status(400).json({
            msg: "|| TU NO PUEDES ELIMINAR PRODUCTOS ||"
        });
    }


    const product = await userModel.findById(id);
    if (!product) {
        return res.status(400).json({
            msg: "|| EL PRODUCTO NO FUE ENCONTRADO ||"
        });
    }


    await Product.findByIdAndUpdate(id, { stateProduct: false });


    const auida = await Product.findById(id);

    res.status(200).json({
        msg: "||  PRODUCTO ELIMINADO EXITOSAMENTE  ||",
        auida
    });

};



export const explorarProductos = async (req, res) => {
    try {
        const { action, nombre, category } = req.body;

        let productos;

        switch (action) {
            case "productos_mas_vendidos":
                // Aquí puedes implementar la lógica para obtener los productos más vendidos
                productos = await Product.find().sort({ ventas: -1 }).limit(10);
                break;

            case "buscar_por_nombre":
                // Aquí puedes implementar la lógica para buscar productos por nombre
                var pro;
                pro = await Product.findOne(nombre);
                if (pro) {
                    return res.status(200).json({
                        msg: '|| productoEncontrado ||',
                        pro
                    });
                }
                break;
            case "explorar_categorias":
                try {
                    // Buscar todos los productos y poblar los datos de categoría
                    const productos = await Product.find().populate('category');

                    // Devolver los productos encontrados
                    return res.status(200).json({ productos });
                } catch (error) {
                    console.error(error);
                    return res.status(500).json({ msg: 'Error en el servidor' });
                }
            break;

            case "filtrar_por_categoria":
                // Busca la categoría por su ID
                var categorio = await Category.findById(category);

                // Si la categoría no existe, retorna un mensaje de error
                if (!categorio) {
                    return { error: 'Categoría no encontrada' };
                }

                // Busca los productos que tengan la categoría encontrada
                const products = await Product.find({ category: categorio.id });
                // Retorna los productos encontrados
                return res.status(200).json({
                    m: '|| Productos encontrados por categoría ||',
                    products
                });
                break;

            default:
                return res.status(400).json({ msg: "Acción no válida" });
        }

        res.status(200).json({ productos });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Hubo un error al explorar los productos" });
    }
};
