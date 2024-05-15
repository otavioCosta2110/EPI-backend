import { Router } from "express";
import ThreadController from "../controllers/threadController";

const router = Router();

const threadController = new ThreadController();
router.get("/threads", threadController.getThreads);
router.post("/threads", threadController.createThread);
router.delete("/threads", threadController.deleteThread);

export default router;
