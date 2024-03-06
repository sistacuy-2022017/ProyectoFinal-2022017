import mongoose from "mongoose";

const CategorySchema = mongoose.Schema({
    nameCategory: {
        type: String,
        required: [true, "The name is a required parameter"],
    },
    descriptionCategory: {
        type: String,
        required: [true, "The description is a required parameter"],
    },
});

CategorySchema.methods.toJSON = function () {
    const { __v, _id, ...catego } = this.toObject();
    catego.uid = _id;
    return catego;
}

export default mongoose.model('Category', CategorySchema);