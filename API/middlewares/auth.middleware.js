import jwt from "jsonwebtoken";
import User from "../models/User.js";
import env from "../config/env.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ─── Protect: must be logged in ───────────────────────────
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new AppError("Not logged in. Please log in to continue.", 401));
  }

  const decoded = jwt.verify(token, env.JWT_SECRET);

  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new AppError("User no longer exists.", 401));
  }

  if (!user.isActive) {
    return next(new AppError("Your account has been deactivated.", 401));
  }

  if (user.wasPasswordChangedAfter(decoded.iat)) {
    return next(
      new AppError("Password was recently changed. Please log in again.", 401),
    );
  }

  req.user = user;
  next();
});

// must be admin role ──────────────────────────
export const isAdmin = (...roles) => {
  const allowedRoles = roles.length ? roles : ["admin"];

  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("Not authenticated.", 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError("Access denied. Admin privileges required.", 403),
      );
    }

    next();
  };
};
