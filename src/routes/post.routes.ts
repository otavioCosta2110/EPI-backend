import { Router } from "express";
import PostController from "../controllers/postController";

const router = Router();

const postController = new PostController();
router.get("/get/:threadID", postController.getPosts);
router.post("/create", postController.createPost);
router.put("/edit", postController.editPost);
router.delete("/delete", postController.deletePost);
router.put("/vote", postController.vote);
router.put("/removeVote", postController.removeVote);
router.get("/isvoted", postController.isVoted);

export default router;
