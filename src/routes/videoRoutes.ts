import { Router } from "express";
import VideoController from "../controllers/videoController";

const router = Router();

const videoController = new VideoController();
router.get("/getvideos", videoController.getVideos);
router.post("/create", videoController.createVideo);
router.post("/delete", videoController.deleteVideo);

export default router;
