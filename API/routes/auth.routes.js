import express from "express";
import {
  register,
  login,
  refresh,
  logout,
  logoutAll,
  getMe,
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.post("/logout-all", protect, logoutAll);
router.get("/me", protect, getMe);

export default router;
