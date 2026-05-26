import shopModel from "../models/shop_model.js";
import response from "../utils/responseHandler.js"
import slugNameGen from "../utils/slugNameGenerator.js";
const createShop = async (req, res) => {
    try {
        const { name, desc, image } = req.body;
        const vendor = req.user.id;
        const slug = await slugNameGen(name);
        const shop = await shopModel.create({
            name,
            desc,
            image,
            slug,
            vendor
        })
        return response(res, 201, "shop created succeesfully", shop);
    } catch (error) {
        console.error(error);
        return response(res, 500, "internal server error at spc", error);
    }
}
export {
    createShop
}