import mongoose from "mongoose";

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
        required: true
    }
});


export default mongoose.model('factura', facturaSchema);
