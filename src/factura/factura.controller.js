import { response, request } from "express";
import Facture from './factura.model.js';
import Products from '../product/product.model.js'


export const facturaPost = async (req = request, res = response) => {
    try {
        const { user, products } = req.body;
        let factura = await Facture.findOne({ user });

        if (!factura) {
            factura = new Facture({ user });


            const issueDate = new Date();
            factura.issueDate = issueDate;
        }

        factura.products.push(products);

        factura.total = factura.products.length;

        await factura.save();


        res.status(200).json({
            mensaje: '|| FACTURA CREADA EXITOSAMENTE ||',
            factura,
        });
    } catch (error) {
        console.error('Error al crear la factura:', error);
        res.status(500).json({ mensaje: 'Hubo un error al crear la factura' });
    }
};

