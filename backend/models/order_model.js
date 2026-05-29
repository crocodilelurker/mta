import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    itemQuantStatus: [{
        itemId: { type: mongoose.Schema.Types.ObjectId, ref: "item" },
        quantity: { type: Number, default: 1 },
        status: {
            type: String,
            enum: ["pending", "completed", "cancelled"],
            default: "pending"
        },
    }],

    paymentStatus: {
        type: Boolean,
        default: false
    },
    totalPrice: { type: Number, default: 0 }
}, { timestamps: true });

const orderModel = mongoose.model("order", orderSchema);

export default orderModel;