import jwt from "jsonwebtoken";
import { User } from "../models/User.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsycHandler.js";

export const authenticateUser = asyncHandler(async (req, res, next) => {
    console.log("Headers received:", req.headers);  // 🔹 Debugging line

    const token = req.header("Authorization");
    if (!token || !token.startsWith("Bearer ")) {
        throw new ApiError(401, "Access denied. No token provided");
    }

    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.ACCESS_TOKEN_SECRET);
        req.user = await User.findById(decoded._id).select("-password");
        if (!req.user) {
            throw new ApiError(404, "User not found");
        }
        next();
    } catch (error) {
        throw new ApiError(403, "Invalid or expired token");
    }
});
