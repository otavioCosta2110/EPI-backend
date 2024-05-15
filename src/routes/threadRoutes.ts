import { Router } from "express";
import ThreadController from "../controllers/threadController";

const router = Router();

const threadController = new ThreadController();
router.get("/get", threadController.getThreads);
router.post("/create", threadController.createThread);
router.delete("/delete", threadController.deleteThread);

export default router;
