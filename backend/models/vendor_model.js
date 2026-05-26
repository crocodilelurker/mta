import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    desc: { type: String },
    image: { type: String, },
    shops: [{ type: mongoose.Schema.Types.ObjectId, ref: "shop" }],
    phoneNumber: {type: String,required: true,unique: true},
    address: {type: String,required: true}
}, { timestamps: true });

const vendorModel = mongoose.model("vendor", vendorSchema);
export default vendorModel;