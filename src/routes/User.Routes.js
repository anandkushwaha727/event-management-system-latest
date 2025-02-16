import express from "express";
import { registerUser, loginUser, refreshAccessToken } from "../controllers/auth.Controller.js";

const router = express.Router();

// User registration
router.post("/register", registerUser);

// User login
router.post("/login", loginUser);

// Refresh access token
router.post("/refresh-token", refreshAccessToken);

export default router;
