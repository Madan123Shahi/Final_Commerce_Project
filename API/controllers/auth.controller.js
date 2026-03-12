import crypto from "crypto";
import User from "../models/User.js";
import OTP from "../models/OTP.js";
import RefreshToken from "../models/RefreshToken.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  generateAccessToken,
  sendTokenResponse,
} from "../utils/generateToken.js";
import { generateOTP } from "../utils/generateOTP.js";
import { sendEmail } from "../utils/sendEmail.js";

// Register
export const register = asyncHandler(async (req, res, next) => {
  const emailRegex = /^\S+@\S+\.\S+$/;
  const phoneRegex = /^\+?[1-9]\d{9,14}$/;
  const { phone, email, password } = req.body;

  if (!email) return next(new AppError("Email is required", 400));
  if (!phone) return next(new AppError("Phone is required", 400));
  if (!password) return next(new AppError("Password is required", 400));

  if (email && !emailRegex.test(email)) {
    return next(new AppError("Please enter a valid email", 400));
  }

  if (phone && !phoneRegex.test(phone)) {
    return next(new AppError("Please enter a valid phone number", 400));
  }

  const existingUser = await User.findOne({ $or: [{ email }, { phone }] });

  if (existingUser) {
    if (email && existingUser.email === email)
      return next(new AppError("Email already exists", 400));
    if (phone && existingUser.phone === phone)
      return next(new AppError("Phone already exists", 400));
  }

  const emailOTP = generateOTP();
  const hashedEmailOTP = crypto
    .createHmac("sha256", env.OTP_SECRET)
    .update(emailOTP)
    .digest("hex");

  await OTP.create({});

  const user = await User.create({ phone, email, password });
  await sendTokenResponse(user, 201, req, res);
});

// Login
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password.", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError("Invalid email or password.", 401));
  }

  if (!user.isActive) {
    return next(new AppError("Account has been deactivated.", 401));
  }

  await sendTokenResponse(user, 200, req, res);
});

// Refresh Token
export const refresh = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.refreshToken;

  if (!token) {
    return next(new AppError("No refresh token. Please log in.", 401));
  }

  const storedToken = await RefreshToken.findOne({ token }).populate("user");

  if (!storedToken) {
    return next(new AppError("Invalid refresh token. Please log in.", 401));
  }

  // token was already revoked → possible reuse attack
  if (storedToken.isRevoked) {
    await RefreshToken.updateMany(
      { user: storedToken.user._id },
      { isRevoked: true },
    );
    return next(
      new AppError("Refresh token reuse detected. All sessions revoked.", 401),
    );
  }

  if (storedToken.expiresAt < new Date()) {
    return next(new AppError("Refresh token expired. Please log in.", 401));
  }

  const user = storedToken.user;
  if (!user.isActive) {
    return next(new AppError("Account deactivated.", 401));
  }

  // Token Rotation
  // revoke old token
  storedToken.isRevoked = true;
  await storedToken.save();

  // issue new refresh token
  const { generateRefreshToken } = await import("../utils/generateToken.js");
  const newRefreshToken = await generateRefreshToken(user._id, req);

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  // issue new access token
  const newAccessToken = generateAccessToken(user._id);

  res.status(200).json({
    success: true,
    accessToken: newAccessToken,
  });
});

// Logout
export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;

  if (token) {
    await RefreshToken.findOneAndUpdate({ token }, { isRevoked: true });
  }

  // clear cookie
  res.cookie("refreshToken", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ success: true, message: "Logged out successfully" });
});

// Logout all devices
export const logoutAll = asyncHandler(async (req, res) => {
  // revoke every refresh token for this user
  await RefreshToken.updateMany({ user: req.user._id }, { isRevoked: true });

  res.cookie("refreshToken", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    success: true,
    message: "Logged out from all devices",
  });
});

// Get current user
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, user });
});
