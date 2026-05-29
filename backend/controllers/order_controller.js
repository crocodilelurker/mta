import orderModel from "../models/order_model.js";
import response from "../utils/responseHandler.js";
import itemModel from "../models/item_model.js";
const placeOrder = async (req, res) => {
    try {
        let role = req.user.role;
        if (role != "user") {
            return response(res, 403, "unauthorized to send orders", null);
        }
        let user = req.user.id;
        const { itemQuantStatus } = req.body;
        if (!itemQuantStatus || itemQuantStatus == undefined) {
            return response(res, 400, "need order fields supplied ", null);
        }
        let totalPrice = 0.0;
        for (let each of itemQuantStatus) {
            let currentItem = await itemModel.findById(each.itemId);
            if (currentItem.stock < each.quantity) {
                return response(res, 400, "this much stock not available", {
                    currentItem,
                    requestedQuantity: each.quantity,
                    availableQuantity: currentItem.stock
                });
            }
            totalPrice += currentItem.price * each.quantity;
        }
        // now call the payment Status and then create the order 
        // for now we mock it and pass true for payment Status
        let paymentStatus = true;
        if (!paymentStatus) {
            return response(res, 400, "payment failed", null);
        }
        const orderCreated = await orderModel.create({
            user,
            itemQuantStatus,
            totalPrice,
            paymentStatus
        });
        for (let each of itemQuantStatus) {
            let currentItem = await itemModel.findById(each.itemId);
            currentItem.stock -= each.quantity;
            await currentItem.save();
        }
        return response(res, 201, "order placed successfully", orderCreated);
    }
    catch (error) {
        console.error(error);
        return response(res, 500, "internal server error ", null)
    }
}


const fetchOrdersByShop = async (req, res) => {
    const { shopId } = req.param; s;

}
export {
    placeOrder,
    fetchOrdersByShop
};