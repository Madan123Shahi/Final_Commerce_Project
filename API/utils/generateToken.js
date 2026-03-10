import jwt from "jsonwebtoken";
import RefreshToken from "../models/RefreshToken.js";
import env from "../config/env.js";
import crypto from "crypto";

const TOKEN_CONFIG = {
  access: {
    secret: env.JWT_SECRET,
    expires: "15m",
  },
  refresh: {
    secret: env.JWT_REFRESH_SECRET,
    expiresIn: "7d",
    expiresMs: 7 * 24 * 60 * 60 * 1000, // 7 days in ms (for cookie)
  },
};

// Access Token
export const generateAccessToken = (userId) => {
  return jwt.sign(
    { id: userId },
    TOKEN_CONFIG.access.secret,
    { expiresIn: TOKEN_CONFIG.access.expires }, // "15m"
  );
};

// Refresh Token
export const generateRefreshToken = async (userId, req) => {
  const token = crypto.randomBytes(64).toString("hex");

  // calculate real Date
  const expiresAt = new Date(Date.now() + TOKEN_CONFIG.refresh.expiresMs);

  await RefreshToken.create({
    token,
    user: userId,
    expiresAt,
    userAgent: req.headers["user-agent"],
    ip: req.ip,
  });

  return token;
};

// Send Both Tokens
export const sendTokenResponse = async (user, statusCode, req, res) => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = await generateRefreshToken(user._id, req);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(Date.now() + TOKEN_CONFIG.refresh.expiresMs),
  });

  res.status(statusCode).json({
    success: true,
    accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};
