import orderModel from "../models/order_model.js";
import response from "../utils/responseHandler.js";
import itemModel from "../models/item_model.js";
import shopModel from "../models/shop_model.js";

const getOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || id == undefined) {
            return response(res, 400, "all fields are required ", null);
        }
        const orderExists = await orderModel.findById(id);
        if (!orderExists) {
            return response(res, 400, "order not found", null);
        }
        let user = req.user.id;
        if(orderExists.user.toString() !== user.toString()) {
            return response(res, 403, "unauthorized", null);
        }
        return response(res, 200, "order found", orderExists);
    } catch (error) {
        console.error(error);
        return response(res, 500, "internal server error", null);
    }
}
const completeOrder = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || id == undefined) {
            return response(res, 400, "all fields are required ", null);
        }
        let orderExists = await orderModel.findById(id);
        if (!orderExists) {
            return response(res, 400, "Order doesnt exist", null)
        }
        let vendor = req.user.id;
        const itemIds = orderExists.itemQuantStatus.map(each => each.itemId);
        const items = await itemModel.find({ _id: { $in: itemIds } });
        const itemVendorMap = {};
        items.forEach(item => {
            itemVendorMap[item._id.toString()] = item.vendor.toString();
        });
        orderExists.itemQuantStatus.forEach((each) => {
            if (itemVendorMap[each.itemId.toString()] === vendor.toString()) {
                each.status = "completed";
            }
        });
        await orderExists.save();
        return response(res, 200, "Order completed successfully", orderExists);
    } catch (error) {
        console.error(error);
        return response(res, 500, "internal server error", null);
    }
}
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
            if (!currentItem) {
                return response(res, 404, `Item with ID ${each.itemId} not found`, null);
            }
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
            // currentItem must exist because we checked above
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
    try {
        const { shopId } = req.params;
        let vendor = req.user.id;
        const shopExists = await shopModel.findById(shopId);
        if (!shopExists) {
            return response(res, 400, "Shop doesnt exists", null)
        }
        if (shopExists.vendor.toString() !== vendor.toString()) {
            return response(res, 403, "Unauthorized you cant visit other shop backend", null);
        }
        // find all items belonging to this shop
        const shopItems = await itemModel.find({ shop: shopId }).select('_id');
        const itemIds = shopItems.map(item => item._id);

        // find orders containing any of those items
        const orders = await orderModel.find({
            'itemQuantStatus.itemId': { $in: itemIds }
        }).populate({
            path: 'user',
            select: 'name email'
        }).populate({
            path: 'itemQuantStatus.itemId',
            select: 'name'
        });
        return response(res, 200, "Orders fetched successfully", orders);
    }
    catch (error) {
        console.error(error);
        return response(res, 500, "internal server error ", null)
    }
}
export {
    placeOrder,
    fetchOrdersByShop,
    completeOrder,
    getOrderStatus
};