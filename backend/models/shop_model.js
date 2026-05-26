import mongoose from "mongoose";

const shopSchema = new mongoose.Schema({
    name: { type: String, required: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: "vendor" },
    slug: { type: String, required: true, unique: true },
    desc: { type: String },
    image: { type: String, }
}, { timestamps: true });

const shopModel = mongoose.model("shop", shopSchema);
export default shopModel;