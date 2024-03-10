import mongoose from "mongoose";
import { Schema } from "mongoose";


const CarritoSchema = mongoose.Schema({
    comprador: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "The user is required"]
    },
    productss: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product"
        },
        cantidad: {
            type: Number,
            default: 1,
            min: 1,
        },
    }],
    total: {
        type: Number,
    },
    carritoState: {
        type: Boolean,
        default: true,
    },
});

CarritoSchema.methods.toJSON = function() {
    const { __v, _id, ...carrito } = this.toObject();
    carrito.uid = _id;
    return carrito;
}

export default mongoose.model('Carrito', CarritoSchema);