import userModel from "../models/user_model.js";
import response from "../utils/responseHandler.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const register = async (req, res) => {
    try {
        const {
            name, email, password, address, phoneNumber, role
        } = req.body;
        if (role != "user" && role != "vendor") {
            return response(res, 400, "You cannot create other roles than user or vendor", null);
        }
        if (!name || !email || !password || !address || !phoneNumber || !role) {
            return response(res, 400, "all the fields are required", null);
        }
        const userExists = await userModel.findOne({ email });
        if (userExists) {
            return response(res, 400, "user or vendor already exists", null);
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userModel.create({
            name,
            email,
            password: hashedPassword,
            address,
            phoneNumber,
            role
        })
        const payload = {
            id: user._id,
            role: user.role,
            email: user.email,
        };
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: '1h',
            }
        );
        return response(res, 201, "user created successfully", {
            success: true,
            user,
            token
        });
    } catch (error) {
        console.error(error);
        return response(res, 500, "internal server error", null);
    }
}
const loginAsUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return response(res, 400, "all fields are required", null);
        }
        const userExists = await userModel.findOne({ email });
        if (!userExists) {
            return response(res, 404, "invaid password or username", null);
        }
        const isPasswordValid = await bcrypt.compare(password, userExists.password);
        if (!isPasswordValid) {
            return response(res, 401, "invalid password or username", null);
        }
        const payload = {
            id: userExists._id,
            role: userExists.role,
            email: userExists.email,
        };
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: '1h',
            }
        );
        return response(res, 200, "user logged in successfully", {
            success: true,
            user: userExists,
            token
        });
    } catch (error) {

    }
};
const loginAsVendor = async (req, res) => {
    try {
        const { email, pass } = req.body;
        if (!email || !pass) {
            return response(res, 400, "all fields are required", null);
        }
        const vendor = await userModel.findOne({ email: email, role: "vendor" })
        if (!vendor) {
            return response(res, 404, "invaid password or username", null);
        }
        const isPasswordValid = await bcrypt.compare(pass, vendor.password);
        if (!isPasswordValid) {
            return response(res, 401, "invalid password or username", null);
        }
        const payload = {
            id: vendor._id,
            role: vendor.role,
            email: vendor.email,
        };
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: '1h',
            }
        );
        return response(res, 200, "vendor logged in successfully", {
            success: true,
            vendor,
            token
        });
    } catch (error) {
        console.error(error);
        return response(res, 500, "internal server error", null);
    }
};


const getMe = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id).select("-password");
        if (!user) {
            return response(res, 404, "user not found", null);
        }
        return response(res, 200, "user fetched successfully", {
            isSignedIn: true,
            user
        });
    } catch (error) {
        console.error(error);
        return response(res, 500, "internal server error", null);
    }
};

export {
    register,
    loginAsUser,
    loginAsVendor,
    getMe
};
