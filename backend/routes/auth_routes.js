import { Router } from "express";
import { loginAsUser, loginAsVendor, register, getMe } from "../controllers/auth_controller.js";
import { protect } from "../middlewares/auth_middleware.js"
import response from "../utils/responseHandler.js";
const router = Router();
router.post("/register", register);
router.post("/login-as-user", loginAsUser);
router.post("/login-as-vendor", loginAsVendor); 
router.get("/me", protect, getMe);
router.get("/health", protect, (req, res) => {
    console.log(req.user);
    return response(res, 200, "health good on auth", {
        user: req.user,
    });
})

export default router;