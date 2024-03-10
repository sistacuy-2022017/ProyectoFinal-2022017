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
                msg: 'No hay carrito activo para este usuario'
            });
        }

        // Verificar si el carrito tiene productos
        if (carrito.productss.length === 0) {
            return res.status(400).json({
                msg: 'El carrito está vacío'
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

        // Actualizar el stock de los productos
        await Promise.all(carrito.productss.map(async (item) => {
            const producto = await Product.findById(item.product._id);
            if (producto) {
                producto.stockProduc -= item.cantidad; // Reducir la cantidad comprada del stock
                await producto.save(); // Guardar los cambios
            }
        }));

        // Guardar la factura en la base de datos
        await factura.save();

        // Vaciar el carrito del usuario
        carrito.productss = [];
        carrito.total = 0;
        await carrito.save();

        res.status(200).json({
            msg: 'Proceso de compra completado, aquí está tu factura',
            factura
        });
    } catch (error) {
        console.error('Error al completar la compra:', error);
        res.status(500).json({ msg: 'Hubo un error al completar la compra' });
    }
};


export const editarFactura = async (req, res) => {
    try {
        const { id } = req.params;
        const { productss } = req.body;

        // Verificar si la factura existe
        const facturaExistente = await Factura.findById(id);
        if (!facturaExistente) {
            return res.status(404).json({ msg: 'La factura no existe' });
        }

        // Validar el stock de los productos antes de editar la factura
        for (const item of productos) {
            const producto = await Product.findById(item.producto);
            if (!producto) {
                return res.status(400).json({ msg: `El producto con ID ${item.producto} no existe` });
            }
            if (item.cantidad > producto.stockProduc) {
                return res.status(400).json({ msg: `La cantidad de ${producto.name} supera el stock disponible` });
            }

            // Calcular la diferencia en la cantidad de productos
            const cantidadAnterior = facturaExistente.productss.find(prod => prod.producto.equals(item.producto))?.cantidad || 0;
            const diferencia = item.cantidad - cantidadAnterior;

            // Actualizar el stock del producto
            producto.stockProduc -= diferencia;
            await producto.save();
        }

        // Actualizar los detalles de la factura
        facturaExistente.productss = productos.map(item => ({
            producto: item.producto,
            cantidad: item.cantidad,
            precioUnitario: item.precioUnitario,
            subtotal: item.precioUnitario * item.cantidad
        }));
        // Recalcular el total de la factura
        facturaExistente.total = facturaExistente.productos.reduce((total, item) => total + item.subtotal, 0);
        
        // Guardar la factura actualizada
        await facturaExistente.save();

        res.status(200).json({ msg: 'Factura actualizada correctamente', factura: facturaExistente });
    } catch (error) {
        console.error('Error al editar la factura:', error);
        res.status(500).json({ msg: 'Hubo un error al editar la factura' });
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