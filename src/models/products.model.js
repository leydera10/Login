import mongoose from "mongoose";

const productsCollection = "products";

const productsSchema = new mongoose.Schema({
    description: { type: String, max:100, required: true},
    img: { type: String, max:100, required: true},
    Price: { type: Number, required: true},
    Stock: { type: Number, required: true},
    category : { type: String, max:50 },
    avalability : {type: String, enum: ['in_stock','out_of_stock']}
});

export const productsModel = mongoose.model(productsCollection,productsSchema);