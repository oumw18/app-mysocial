import express from "express";
import {
  createFollow,
  deleteFollow,
  getFollowers,
  getFollowing,
} from "../controllers/follow.controller.js";
import { protect } from "../middleware/protect.js";

const router = express.Router();

router.get("/:userId/followers", getFollowers, protect);
router.get("/:userId/following", getFollowing, protect);
router.post("/", createFollow, protect);
router.delete("/", deleteFollow, protect);

export default router;
