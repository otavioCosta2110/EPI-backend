import { Router } from "express";
import VideoController from "../controllers/videoController";

const router = Router();

const videoController = new VideoController();
router.get("/getvideos", videoController.getVideos);
router.post("/create", videoController.createVideo);
router.post("/delete", videoController.deleteVideo);
router.put("/rate", videoController.rateVideo);
router.post("/play", videoController.playVideo);

export default router;
