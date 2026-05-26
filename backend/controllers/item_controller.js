// we will first develop without middlewares :) and after developing shop create
// create item 
// delete item
// update item
// get item by id
// get all items
// get all items for the shop


import response from "../utils/responseHandler.js";

const createItem = async (req, res) => {
    try {
        //const { name , price , image , desc ,}
    } catch (error) {
        console.error(error);
        return response(res, 500, "internal server error at item controller ", null);
    }
}

export { createItem };