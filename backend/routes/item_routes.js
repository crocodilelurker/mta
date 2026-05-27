//item router
import { Router } from "express";
import { protect, authorize } from "../middlewares/auth_middleware.js";
import { createItem, deleteItem } from "../controllers/item_controller.js";
const router = Router();


router.post("/create", protect, authorize('vendor'), createItem);
router.post("/delete/:id", protect, authorize('vendor', 'admin'), deleteItem);
router.get("/health", (req, res) => {
    res.status(200).json({
        "health": "good"
    })
})
export default router;
