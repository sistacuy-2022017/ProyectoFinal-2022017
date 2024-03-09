import mongoose from "mongoose";
import Product from '../product/product.model.js'

const facturaSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    issueDate: {
        type: Date,
        default: Date.now
    },
    total: {
        type: Number,
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
});

facturaSchema.methods.toJSON = function () {
    const { __v, _id, ...factures } = this.toObject();
    factures.uid = _id;
    return factures;
}

export default mongoose.model('Factura', facturaSchema);
