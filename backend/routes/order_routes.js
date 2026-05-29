import { Router } from "express";
import { fetchOrdersByShop, placeOrder,completeOrder,getOrderStatus } from "../controllers/order_controller.js";
import { protect } from "../middlewares/auth_middleware.js";
import { authorize } from "../middlewares/auth_middleware.js";
const router = Router();

router.post("/create", protect, authorize('user'), placeOrder);
router.get("/shop/:shopId", protect, authorize('vendor'), fetchOrdersByShop);
router.post("/complete/:id", protect, authorize('vendor'), completeOrder);
router.get("/status/:id", protect, getOrderStatus);

router.get("/health", (req, res) => {
    res.status(200).json({
        "health": "good"
    })
})


export default router;