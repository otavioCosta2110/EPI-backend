import { Router } from 'express';
import VideoController from '../controllers/videoController';

const router = Router();

const videoController = new VideoController();
router.get('/getvideos', videoController.getVideos);
router.get('/getbyid', videoController.getVideoById);
router.get('/search/:name', videoController.search);
router.post('/create', videoController.createVideo);
router.delete('/delete', videoController.deleteVideo);
router.put('/rate', videoController.rateVideo);
router.post('/play', videoController.playVideo);
router.get('/watchedvideos', videoController.watchedVideos);
router.post('/download', videoController.downloadVideo);

export default router;
