//get User Profile

import itemModel from "../models/item_model.js";
import userModel from "../models/user_model.js";
import response from "../utils/responseHandler.js";

const getUser = async (req, res) => {
    try {
        const user = req.user.id;
        const userExists = await userModel.findById(user).select("-password");
        if (!userExists) {
            return response(res, 400, "No User Found Wrong TOken Login Again", null);
        }
        return response(res, 200, "user fetched success", userExists);
    } catch (error) {
        console.error(error)
        return response(res, 500, "Internal Server Error", null)
    }
}
const updateUser = async (req, res) => {
    try {
        const userId = req.user.id;
        let userExists = await userModel.findById(userId).select("-password");
        if (!userExists) {
            return response(res, 400, "No User Found Wrong TOken Login Again", null);
        }
        const { name, address, phoneNumber, desc, image } = req.body;
        if (name) userExists.name = name;
        if (address) userExists.address = address;
        if (phoneNumber) userExists.phoneNumber = phoneNumber;
        if (desc) userExists.desc = desc;
        if (image) userExists.image = image;
        await userExists.save();
        return response(res, 200, "user updated success", userExists);
    } catch (error) {
        console.error(error)
        return response(res, 500, "Internal Server Error", null)
    }
}
const addToCart = async (req, res) => {
    try {
        // i need user id and item id 
        const { itemId } = req.params;
        let user = req.user.id;
        let userExists = await userModel.findById(user);
        if (!userExists) {
            return response(res, 400, "user not found", null);
        }
        let cart = userExists.cart;
        //check if item Exists or not
        const itemExists = await itemModel.findById(itemId);
        if (!itemExists) {
            return response(res, 400, "item not found", null);
        }
        cart.push(itemId);
        await userExists.save();
        return response(res, 200, "Item Saved to Cart", itemExists);
    } catch (error) {
        console.error(error);
        return response(res, 500, "Internal Server Error", null)
    }
}
const deleteFromCart = async (req, res) => {
    try {
        const { itemId } = req.params;
        let user = req.user.id;
        let userExists = await userModel.findById(user);
        if (!userExists) {
            return response(res, 400, "user not found", null);
        }
        let cart = userExists.cart;
        //check if item Exists or not
        const itemExists = await itemModel.findById(itemId);
        if (!itemExists) {
            return response(res, 400, "item not found", null);
        }
        const stringCart = cart.map(id => id.toString());
        if (stringCart.includes(itemId)) {
            const index = stringCart.indexOf(itemId);
            cart.splice(index, 1);
            await userExists.save();
            return response(res, 200, "Item Removed from Cart", itemExists);
        }
        return response(res, 400, "item not in cart", null);
    } catch (error) {
        console.error(error);
        return response(res, 500, "Internal Server Error", null);
    }
}
const getCart = async (req, res) => {
    try {
        let user = req.user.id;
        if (!user) {
            return response(res, 400, "user not found", null);
        }
        let userExists = await userModel.findById(user).populate("cart");
        if (!userExists) {
            return response(res, 400, "user not found", null);
        }
        let cart = userExists.cart;
        return response(res, 200, "cart fetched success", cart);
    }
    catch (error) {
        console.error(error);
        return response(res, 500, "Internal Server Error", null);
    }
}
export {
    getUser,
    updateUser,
    addToCart,
    deleteFromCart,
    getCart
}