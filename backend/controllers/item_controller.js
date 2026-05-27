// we will first develop without middlewares :) and after developing shop create
// create item 
// delete item
// update item
// get item by id
// get all items
// get all items for the shop


import itemModel from "../models/item_model.js";
import shopModel from "../models/shop_model.js";
import response from "../utils/responseHandler.js";

const createItem = async (req, res) => {
    try {
        const { name, price, image, desc, stock, shop } = req.body;
        if (!name || !price || !image || !desc || !stock || !shop) {
            return response(res, 400, "All fields are required", null);
        }
        let vendor = req.user.id;
        // we find the shop if not exists or if shop's vendor doesnt match with the user id 
        const shopExists = await shopModel.findById(shop);
        if (!shopExists || shopExists.vendor.toString() != vendor) {
            return response(res, 403, "not authorized to create this item, not your store", null)
        }
        const itemCreate = await itemModel.create({
            name,
            price,
            desc,
            image,
            stock,
            shop,
            vendor
        })
        shopExists.items.push(itemCreate._id);
        await shopExists.save();
        return response(res, 201, "item was created successfully", itemCreate);
    } catch (error) {
        console.error(error);
        return response(res, 500, "internal server error at item controller ", null);
    }
}

const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return response(res, 400, "we need id as params :id", null);
        }

    }
    catch (error) {
        console.error(error);
        return response(res, 500, "ise at deletitemcont", null);
    }
}
export {
    createItem,
    deleteItem
};