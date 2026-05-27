import mongoose from "mongoose";

const shopSchema = new mongoose.Schema({
    name: { type: String, required: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    slug: { type: String, required: true, unique: true },
    desc: { type: String, required: true },
    image: { type: String, required: true },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: "item" }]
}, { timestamps: true });

const shopModel = mongoose.model("shop", shopSchema);
export default shopModel;