import { User } from "../models/User.models.js";
import { asyncHandler } from "../utils/AsycHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

// Register User
export const registerUser = asyncHandler(async (req, res) => {
    const { username, email, fullName, password } = req.body;
    if (!fullName || !email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required." });
      }
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ success: false, message: "Email already exists." });
      }
      if (password.length < 6) {
        return res.status(400).json({ success: false, message: "Password must be at least 6 characters." });
      }
  
      
      
    const newUser = await User.create({ username, email, fullName, password });
    res.status(201).json(new ApiResponse(201, newUser, "User registered successfully"));
});

// Login User
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and Password are required." });
      }
    const user = await User.findOne({ email }).select("+password"); // Ensure password is checked
    if (!user || !(await user.isPasswordCorrect(password))) {
        throw new ApiError(401, "Invalid email or password");
        return res.status(401).json({ success: false, message: "Invalid email or password." });
    }


    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "Strict" });

    res.status(200).json(new ApiResponse(200, {
        accessToken,
        user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            fullName: user.fullName
        }
    }, "Login successful dddddd"));
});


// Refresh Access Token
export const refreshAccessToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        throw new ApiError(401, "No refresh token found");
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded._id);
    if (!user || user.refreshToken !== refreshToken) {
        throw new ApiError(403, "Invalid refresh token");
    }

    const newAccessToken = user.generateAccessToken();
    res.status(200).json(new ApiResponse(200, { accessToken: newAccessToken }, "Token refreshed successfully"));
});

