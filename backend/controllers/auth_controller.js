import userModel from "../models/user_model.js";
import response from "../utils/responseHandler.js";
import bcrypt from "bcrypt";

const register = async (req, res) => {
    try {
        const {
            name, email, password, desc, address, phoneNumber, role
        } = req.body;
        if (role != "user" || role != "vendor") {
            return response(res, 400, "You cannot create other roles than user or vendor", null);
        }
        if (!name || !email || !password || !address || !phoneNumber) {
            return response(res, 400, "all the fields are required", null);
        }
        const userExists = await userModel.findOne({ email });
        if (userExists) {
            return response(res, 400, "user already exists", null);
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        // check role if user create model in user or else create model in vendor and user

        const user = await userModel.create({
            name,
            email,
            password: hashedPassword,
            address,
            phoneNumber,
            role,
            desc: desc
        })
        if (role == 'vendor') {
            const vendor = await vendorModel.create({
                name,
                email,
                password: hashedPassword,
                address,
                phoneNumber,
                desc: desc
            })
            return response(res, 201, "vendor created successfully", vendor);
        }
        return response(res, 201, "user created successfully", user);
    } catch (error) {
        console.error(error);
        return response(res, 500, "internal server error", null);
    }
}

const loginAsUser = async (req,res) =>{
    try {
        
    } catch (error) {
        
    }
};
const loginAsVendor = async (req,res) =>{
    try {

    } catch (error) {

    }
};

const logout = async (req,res) =>{
    try {
        
    } catch (error) {
        
    }
}

export {
    register,
    loginAsUser,
    loginAsVendor,
    logout
};
