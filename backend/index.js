import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/dbConfig.js";
import authRoutes from "./routes/auth_routes.js";
import shopRoutes from "./routes/shop_routes.js";
import itemRoutes from "./routes/item_routes.js";
import orderRoutes from "./routes/order_routes.js";

dotenv.config();

const PORT = process.env.PORT || 8080;

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/item", itemRoutes);
app.use("/api/order", orderRoutes);

connectDB();

app.get("/", (req, res) => {
    return res.send("health good on home");
})

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})