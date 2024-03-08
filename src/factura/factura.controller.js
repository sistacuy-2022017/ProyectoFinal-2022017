import { response, request } from "express";
import Facture from './factura.model.js';
import Product from '../product/product.model.js'
import mongoose from "mongoose";

export const facturaPost = async (req = request, res = response) => {
    try {
        const { user, products } = req.body;
        let factura = await Facture.findOne({ user });

        if (!factura) {
            factura = new Facture({ user, total: 0 }); // Inicializa total a 0
            const issueDate = new Date();
            factura.issueDate = issueDate;
        }

        // Busca los detalles de cada producto
        const productDetails = await Product.find({ _id: { $in: products } });

        // Añade los detalles completos de los productos a la factura
        factura.products.push(...productDetails);

        // Suma los precios de los nuevos productos al total existente
        const newTotal = productDetails.reduce((total, product) => total + product.price, 0);
        factura.total += newTotal;

        await factura.save();

        // Pobla el campo products antes de enviar la respuesta
        factura = await Facture.findById(factura._id).populate('products');

        res.status(200).json({
            mensaje: '|| FACTURA CREADA EXITOSAMENTE ||',
            factura,
        });
    } catch (error) {
        console.error('Error al crear la factura:', error);
        res.status(500).json({ mensaje: 'Hubo un error al crear la factura' });
    }
};