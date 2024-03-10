import Carrito from './carrito.model.js';
import { request, response } from "express";
import Producto from "../product/product.model.js";
import Factura from "../factura/factura.model.js";

/*export const agregarProductoAlCarrito = async (req = request, res = response) => {
    const usuarioValid = req.admin;
    const yaExisteCarrito = await Carrito.findOne({ comprador: usuarioValid._id });

    if (yaExisteCarrito) {
        return res.status(400).json({
            msg: '|| Ya existe un carrito para este usuario ||'
        });
    }


    try {
        const { comprador, product, cantidad } = req.body;

        // Obtener el detalle del producto para obtener el precio
        const productDetails = await Producto.findById(product);
        if (!productDetails) {
            return res.status(404).json({
                msg: '|| Producto no encontrado ||'
            });
        }

        // Verificar si el carrito del comprador ya existe
        let carrito = await Carrito.findOne({ comprador });

        // Si no existe, crea un nuevo carrito para el comprador
        if (!carrito) {
            carrito = new Carrito({ comprador, productss: [], total: 0 });
        }

        // Verificar si el producto ya está en el carrito
        const productoIndex = carrito.productss.findIndex(item => item.product.toString() === product);

        if (productoIndex !== -1) {
            // Si el producto ya está en el carrito, actualiza la cantidad
            carrito.productss[productoIndex].cantidad += cantidad;
        } else {
            // Si el producto no está en el carrito, agrégalo
            carrito.productss.push({ product: productDetails, cantidad });
        }

        // Recalcula el total del carrito sumando el precio del producto agregado
        carrito.total += productDetails.price * cantidad;

        // Guarda el carrito actualizado en la base de datos
        await carrito.save();

        res.status(201).json({ msg: 'Producto agregado al carrito con éxito', carrito });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Hubo un error al agregar el producto al carrito' });
    }
};*/

export const agregarProductoAlCarrito = async (req = request, res = response) => {
    try {
        const { comprador, product, cantidad } = req.body;

        // Obtener el detalle del producto para obtener el precio
        const productDetails = await Producto.findById(product);
        if (!productDetails) {
            return res.status(404).json({
                msg: '|| Producto no encontrado ||'
            });
        }

        // Verificar si el carrito del comprador ya existe
        let carrito = await Carrito.findOne({ comprador }).populate('productss.product');

        // Si no existe, crea un nuevo carrito para el comprador
        if (!carrito) {
            carrito = new Carrito({ comprador, productss: [], total: 0 });
        }

        // Verificar si el producto ya está en el carrito
        const productoIndex = carrito.productss.findIndex(item => item.product.toString() === product);

        if (productoIndex !== -1) {
            // Si el producto ya está en el carrito, actualiza la cantidad
            carrito.productss[productoIndex].cantidad += cantidad;
        } else {
            // Si el producto no está en el carrito, agrégalo
            carrito.productss.push({ product: productDetails, cantidad });
        }

        // Recalcula el total del carrito sumando el precio del producto agregado
        carrito.total += productDetails.price * cantidad;

        // Guarda el carrito actualizado en la base de datos
        await carrito.save();

        res.status(201).json({ msg: 'Producto agregado al carrito con éxito', carrito });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Hubo un error al agregar el producto al carrito' });
    }
};


/*export const completarCompra = async (req = request, res = response) => {
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
            msg: 'Proceso de compra completado exitosamente',
            factura
        });
    } catch (error) {
        console.error('Error al completar la compra:', error);
        res.status(500).json({ msg: 'Hubo un error al completar la compra' });
    }
};*/