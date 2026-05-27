import response from "../utils/responseHandler.js";
import jwt from "jsonwebtoken";
const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers["authorization"] && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers["authorization"].split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            req.user = decoded;
            next();
        }
        else {
            return response(res, 401, "unauthenticated", null);
        }
    } catch (error) {
        console.error(error);
        if (error.name == "TokenExpiredError" || error.name == "JsonWebTokenError")
            return response(res, 401, "unauthenticated", error);
        return response(res, 500, "internal server error at middleware", null)
    }
}

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return response(res, 403, "Unauthorized Access")
        }
        next();
    }
}
export {
    protect,
    authorize
}