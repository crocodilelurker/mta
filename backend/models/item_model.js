import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    desc: { type: String, required: true },
    image: { type: String, required: true },
    stock: { type: Number, required: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "shop", required: true },
    whishlistedBy: { type: Number, default: 0 },
    cartedBy: { type: Number, default: 0 },
    secondaryDescription: {
        type: String,
        enum: ["best seller", "exclusive", "base", "limited edition"],
        default: "base"
    },
    rating: {
        type: Number,
        default: 1,
        min: 1,
        max: 5
    },
    reviews: [
        {
            comment: { type: String },
            rating: { type: Number, default: 1 },
        }
    ],
}, { timestamps: true });

const itemModel = mongoose.model("item", itemSchema);
export default itemModel;