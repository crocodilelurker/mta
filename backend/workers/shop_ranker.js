import cron from 'node-cron';
import Order from "../models/order_model.js";
import { upstashRedis } from "../middlewares/rate_limiter.js";
const updateHotShopsCache = async () => {
    console.log("starting cron files")
    try {
        const topShops = await Order.aggregate([
            { $unwind: "$itemQuantStatus" },
            {
                $lookup: {
                    from: "items",
                    localField: "itemQuantStatus.itemId",
                    foreignField: "_id",
                    as: "itemDetails"
                }
            },
            { $unwind: "$itemDetails" },
            {
                $group: {
                    _id: "$itemDetails.shop",
                    orderCount: { $sum: "$itemQuantStatus.quantity" }
                }
            },
            { $sort: { orderCount: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: "shops",
                    localField: "_id",
                    foreignField: "_id",
                    as: "shopDetails"
                }
            },
            { $unwind: "$shopDetails" }
        ]);


        const cleanData = topShops.map(item => item.shopDetails);

        await upstashRedis.set("shops:hot", JSON.stringify(cleanData));
        console.log("Hot shops cache updated successfully");
    } catch (error) {
        console.error(error);
    }
}
cron.schedule('0 0 * * *', updateHotShopsCache);
export {
    updateHotShopsCache
}