import express from "express";
import {
  getAllUser,
  getUser,
  login,
  register,
} from "../controllers/user.controller.js";
import { protect } from "../middleware/protect.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getUser);
router.get("/", protect, getAllUser);

export default router;
