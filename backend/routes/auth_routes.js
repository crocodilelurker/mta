import { Router } from "express";
import { register } from "../controllers/auth_controller.js";

const router = Router();
router.post("/register", register);
router.get("/health", (req, res) => {
    return res.send("health good on auth");
})

export default router;