import { response, request } from "express";
import Factura from './factura.model.js';
import Product from '../product/product.model.js';
import Carrito from '../carrito/carrito.model.js';
import mongoose from "mongoose";

export const completarCompra = async (req = request, res = response) => {
    try {
        const usuarioValid = req.admin;

        // Verificar si el usuario tiene un carrito activo
        const carrito = await Carrito.findOne({ comprador: usuarioValid._id }).populate('productss.product');
        if (!carrito) {
            return res.status(400).json({
                msg: '|| No hay carrito activo para este usuario ||'
            });
        }

        // Verificar si el carrito tiene productos
        if (carrito.productss.length === 0) {
            return res.status(400).json({
                msg: '|| El carrito está vacío ||'
            });
        }

        // Calcular el total de la compra
        const totalCompra = carrito.total;

        // Crear la factura
        const factura = new Factura({
            comprador: usuarioValid._id,
            productos: carrito.productss.map(item => ({
                producto: item.product,
                cantidad: item.cantidad,
                precioUnitario: item.product.price,
                subtotal: item.product.price * item.cantidad
            })),
            total: totalCompra
        });

        // Guardar la factura en la base de datos
        await factura.save();

        // Vaciar el carrito del usuario
        carrito.productss = [];
        carrito.total = 0;
        await carrito.save();

        res.status(200).json({
            msg: '|| PROCESO DE COMPRA COMPLETADO AQUI TA TU FACTURA ||',
            factura
        });
    } catch (error) {
        console.error('Error al completar la compra:', error);
        res.status(500).json({ msg: 'Hubo un error al completar la compra' });
    }
};


export const historialDeCompra = async (req = request, res = response) => {
    try {
        const usuarioValid = req.admin;

        // Buscar todas las facturas del usuario en la base de datos
        const facturas = await Factura.find({ comprador: usuarioValid._id }).populate('productos.producto');

        res.status(200).json({
            msg: '|| HISTORIAL DE COMPRA ||',
            facturas
        });
    } catch (error) {
        console.error('Error al obtener el historial de compras:', error);
        res.status(500).json({ msg: 'Hubo un error al obtener el historial de compras' });
    }
};