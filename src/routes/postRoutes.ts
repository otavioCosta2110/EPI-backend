import { Router } from "express";
import PostController from "../controllers/postController";

const router = Router();

const postController = new PostController();
router.get("/posts/:threadID", postController.getPosts);
router.post("/posts", postController.createPost);
router.delete("/posts", postController.deletePost);

export default router;
