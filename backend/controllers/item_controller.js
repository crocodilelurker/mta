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


const getItem = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return response(res, 400, "id field is required", null);
        }
        const itemExists = await itemModel.findById(id);
        if (!itemExists) {
            return response(res, 404, "Item Not found with matching ID ", null);
        }
        return response(res, 200, "item found", itemExists);
    }
    catch (error) {
        console.error(error);
        return response(res, 500, "Ise at get item", null);
    }
}
const getAllItems = async (req, res) => {
    try {
        const items = await itemModel.find();
        return response(res, 200, "All items", items);
    } catch (error) {
        console.error(error);
        return response(res, 500, "ise at get ALL items", null);
    }
}
const getAllItemsByShop = async (req, res) => {
    try {
        const { shopId } = req.params;
        const shopExists = await shopModel.findById(shopId);
        if (!shopExists) {
            return response(res, 404, "Shop doesnt Exist", null);
        }
        const items = shopExists.items;
        //items is array of items id in the shop
        const itemsFound = await itemModel.find({ _id: { $in: items } });
        return response(res, 200, "items found", itemsFound);
    } catch (error) {
        console.error(error);
        return response(res, 500, "internal server error at getAllItemsByShop", null);
    }
}

const updateItem = async (req, res) => {
    try {
        const { name, price, image, desc, stock, secondaryDescription } = req.body;
        const { id } = req.params;
        // get the item
        if (name == undefined || price == undefined || !image || !desc || stock == undefined || !id || !secondaryDescription) {
            return response(res, 400, "all fields are required", null);
        }
        const itemExists = await itemModel.findById(id);
        let vendor = req.user.id;
        if (!itemExists || !itemExists.vendor.equals(vendor)) {
            return response(res, 400, "unauthorized to update or item doesnt Exists", null);
        }
        itemExists.name = name;
        itemExists.price = price;
        itemExists.image = image;
        itemExists.desc = desc;
        itemExists.stock = stock;
        itemExists.secondaryDescription = secondaryDescription;
        await itemExists.save();
        return response(res, 200, "item updated successfully", itemExists);
    }
    catch (error) {
        console.error(error);
        return response(res, 500, "internal server error at updateitemcont", null)
    }
}


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
        const itemExists = await itemModel.findById(id);
        let vendor = req.user.id;
        //if (!itemExists || !itemExists.vendor.equals(vendor)) 
        if (!itemExists || (!itemExists.vendor.equals(vendor) && req.user.role !== 'admin')) {
            return response(res, 403, "Unauthorized you cant delete an item which is not published by you", null);
        }
        //delete item 
        //delete item from the shop as well 
        const shopId = itemExists.shop;
        const shopExists = await shopModel.findById(shopId);
        if (!shopExists) {
            return response(res, 400, "Shop Not found for item deletion", null);
        }
        shopExists.items.pull(itemExists._id);
        await shopExists.save();
        await itemExists.deleteOne();
        return response(res, 200, "item deleted successfully", null);
    }
    catch (error) {
        console.error(error);
        return response(res, 500, "ise at deletitemcont", null);
    }
}
export {
    createItem,
    deleteItem,
    updateItem,
    getItem,
    getAllItems,
    getAllItemsByShop
};