import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: "item" }],
    totalPrice: { type: Number, required: true },
    totalQuantity: { type: Number, required: true },
    status: {
        type: String,
        enum: ["pending", "completed", "cancelled"],
        default: "pending"
    },
}, { timestamps: true });

const orderModel = mongoose.model("order", orderSchema);

export default orderModel;