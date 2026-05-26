//item router
import { Router } from "express";
import { protect } from "../middlewares/auth_middleware.js"
import { createShop } from "../controllers/shop_controller.js";
const router = Router();
router.post("/create", protect, createShop);
router.get("/health", (req, res) => {
    res.status(200).json({
        "health": "good"
    })
})
export default router;
