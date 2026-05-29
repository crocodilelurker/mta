//getShop
//getAllShop
//updateShop
//deleteShop
//createShop
import shopModel from "../models/shop_model.js";
import itemModel from "../models/item_model.js";
import userModel from "../models/user_model.js";
import response from "../utils/responseHandler.js"
import slugNameGen from "../utils/slugNameGenerator.js";

const getAllShop = async (req, res) => {
    try {
        const shops = await shopModel.find();
        return response(res, 200, "shops found successfully", shops);
    } catch (error) {
        console.error(error);
        return response(res, 500, "internal server error", null)
    }
}
const getShop = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return response(res, 400, "id is required", null);
        }
        const shopExists = await shopModel.findById(id);
        if (!shopExists) {
            return response(res, 404, "shop doesnt exist", null);
        }
        return response(res, 200, "shop found successfully", shopExists);
    } catch (error) {
        console.error(error);
        return response(res, 500, "internal server error", null)
    }
}
const updateShop = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, desc, image } = req.body;
        const shopExists = await shopModel.findById(id);
        if (!shopExists) {
            return response(res, 404, "shop doesnt exist", null);
        }
        //check if user is authorized
        if (!shopExists.vendor.equals(req.user.id) && req.user.role !== 'admin') {
            return response(res, 403, "not authorized", null);
        }
        //update shop
        if (name) {
            shopExists.name = name;
            shopExists.slug = await slugNameGen(name);
        }
        if (desc) {
            shopExists.desc = desc;
        }
        if (image) {
            shopExists.image = image;
        }
        await shopExists.save();
        return response(res, 200, "shop updated successfully", shopExists);
    } catch (error) {
        console.error(error);
        return response(res, 500, "internal server error", null)
    }
}
const deleteShop = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return response(res, 400, "id is required", null);
        }
        const shopExists = await shopModel.findById(id);
        if (!shopExists) {
            return response(res, 404, "shop doesnt exist", null);
        }
        //check if user is authorized
        if (!shopExists.vendor.equals(req.user.id) && req.user.role !== 'admin') {
            return response(res, 403, "not authorized", null);
        }
        //delete all items from shop
        await itemModel.deleteMany({ shop: shopExists._id });
        // remove shop ID from vendor's user profile
        await userModel.findByIdAndUpdate(shopExists.vendor, { $pull: { shops: shopExists._id } });
        await shopExists.deleteOne();
        return response(res, 200, "shop deleted successfully", null);
    } catch (error) {
        console.error(error);
        return response(res, 500, "internal server error", null);
    }
}
const createShop = async (req, res) => {
    try {
        const { name, desc, image } = req.body;
        if (!name || !desc || !image) {
            return response(res, 400, "all fields (name, desc, image) are required", null);
        }
        const vendor = req.user.id;
        const slug = await slugNameGen(name);
        const shop = await shopModel.create({
            name,
            desc,
            image,
            slug,
            vendor
        });
        // add shop ID to vendor's user profile
        await userModel.findByIdAndUpdate(vendor, { $push: { shops: shop._id } });
        return response(res, 201, "shop created successfully", shop);
    } catch (error) {
        console.error(error);
        return response(res, 500, "internal server error at spc", null);
    }
}
export {
    createShop,
    deleteShop,
    updateShop,
    getShop,
    getAllShop
}