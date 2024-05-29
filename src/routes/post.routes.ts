import { Router } from "express";
import PostController from "../controllers/postController";

const router = Router();

const postController = new PostController();
router.get("/get/:threadID", postController.getPosts);
router.post("/create", postController.createPost);
router.delete("/delete", postController.deletePost);

export default router;
