import { Router } from "express";
import { protect } from "../middlewares/auth_middleware.js";
import { getUser, updateUser, addToCart, deleteFromCart, getCart } from "../controllers/user_controller.js";

const router = Router();

router.get("/profile", protect, getUser);
router.post("/update", protect, updateUser);
router.post("/cart/add/:itemId", protect, addToCart);
router.post("/cart/delete/:itemId", protect, deleteFromCart);
router.get("/cart", protect, getCart);

router.get("/health", (req, res) => {
    res.status(200).json({
        "health": "good"
    })
});

export default router;
