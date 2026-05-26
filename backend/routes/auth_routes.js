import { Router } from "express";
import { loginAsUser, loginAsVendor, register } from "../controllers/auth_controller.js";

const router = Router();
router.post("/register", register);
router.post("/login-as-user", loginAsUser);
router.post("/login-as-vendor", loginAsVendor);
router.get("/health", (req, res) => {
    return res.send("health good on auth");
})

export default router;