import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    desc: { type: String },
    image: { type: String, },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "order" }],
    cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "cart" }],
    whishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "whishlist" }],
    role: {
        type: String,
        enum: ["user", "admin", "vendor"],
        default: "user"
    },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true }
}, { timestamps: true });

const userModel = mongoose.model("user", userSchema);
export default userModel;