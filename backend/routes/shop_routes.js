//item router
import { Router } from "express";
import { authorize, protect } from "../middlewares/auth_middleware.js"
import { createShop, deleteShop, getShop, updateShop, getAllShop, getHotShop } from "../controllers/shop_controller.js";
const router = Router();
router.post("/create", protect, authorize('vendor'), createShop);
router.post("/delete/:id", protect, authorize('vendor', 'admin'), deleteShop);
router.post("/update/:id", protect, authorize('vendor', 'admin'), updateShop);
router.get("/hot", getHotShop);
router.get("/get/:id", getShop);
router.get("/get", getAllShop);
router.get("/health", (req, res) => {
    res.status(200).json({
        "health": "good"
    })
})
export default router;
