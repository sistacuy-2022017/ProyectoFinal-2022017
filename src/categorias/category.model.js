import mongoose from "mongoose";

const categories = ['Tecnología', 'Salud', 'Finanzas', 'Educación', 'Comercio', 'Manufactura', 'Otro']

const CategorySchema = mongoose.Schema({
    nameCategory: {
        type: String,
        enum: categories,
        required: [true, "The categories are a paremeter required"],
    },
    descriptionCategory: {
        type: String,
        required: [true, "The description is a required parameter"],
    },
    categoryState: {
        type: Boolean,
        default: true,
    }
});

CategorySchema.methods.toJSON = function () {
    const { __v, _id, ...catego } = this.toObject();
    catego.uid = _id;
    return catego;
}

export default mongoose.model('Category', CategorySchema);