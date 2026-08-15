import express from "express";
import { protect } from "../middleware/protect.js";
import {
  createPost,
  deletePost,
  getPostByUser,
  getPosts,
} from "../controllers/post.controller.js";
import uploadImage from "../middleware/upload.js";

const router = express.Router();

router.post("/", protect, uploadImage, createPost);
router.get("/", protect, getPosts);
router.get("/user/:id", protect, getPostByUser);
router.delete("/:id", protect, deletePost);

export default router;
