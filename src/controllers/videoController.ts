import { Request, Response } from 'express';
import VideoRepository from '../repositories/videoRepositories';
import VideoServices from '../services/videoServices';
import UserVideoServices from '../services/userVideoServices';
import ytdl, { videoFormat } from 'ytdl-core';

export default class VideoController {
  videoRepository = new VideoRepository();
  videoServices = new VideoServices();
  userVideoServices = new UserVideoServices();

  constructor() {}

  getVideos = async (req: Request, res: Response) => {
    try {
      const videos = await this.videoServices.getVideos();
      res.status(200).json({ data: videos });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getVideoById = async (req: Request, res: Response) => {
    try {
      const id = req.query.id as string;
      const video = await this.videoServices.getVideoById(id);
      res.status(200).json({ data: video });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  search = async (req: Request, res: Response) => {
    try {
      const name = req.params.name;
      console.log(name);
      const videos = await this.videoServices.search(name);
      res.status(200).json({ data: videos });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  createVideo = async (req: Request, res: Response) => {
    try {
      const video = req.body;
      const createdVideo = await this.videoServices.createVideo(video);
      res.status(201).json({ data: createdVideo });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  deleteVideo = async (req: Request, res: Response) => {
    try {
      const videoID = req.body.id;
      if (!videoID) {
        return res.status(400).json({ error: 'Video ID is required' });
      }
      await this.videoServices.deleteVideo(videoID);
      res.status(200).json({ message: 'Video deleted' });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  };

  rateVideo = async (req: Request, res: Response) => {
    try {
      const { userID, videoID, rating } = req.body;
      await this.videoServices.rateVideo(userID, videoID, rating);
      res.status(200).json({ message: 'Video Rated!' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  playVideo = async (req: Request, res: Response) => {
    try {
      const { user_id, video_id } = req.body;
      await this.userVideoServices.addUserVideoPlay(user_id, video_id);
      res.status(200).json({ message: 'Video played' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  watchedVideos = async (req: Request, res: Response) => {
    try {
      const user_id = req.query.id as string;
      const videos = await this.userVideoServices.getWatchedVideos(user_id);
      res.status(200).json({ data: videos });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  downloadVideo = async (req: Request, res: Response) => {
    try {
      const videoUrl = req.query.url as string;
      if (!ytdl.validateURL(videoUrl)) {
        return res.status(400).json({ error: 'Invalid video URL' });
      }

      const formatOptions = {
        filter: (format: videoFormat) =>
          format.container === 'mp4' && format.hasAudio && format.hasVideo,
      };

      const info = await ytdl.getInfo(videoUrl);
      const format = ytdl.chooseFormat(info.formats, formatOptions);

      res.header('Content-Disposition', 'attachment; filename="video.mp4"');
      ytdl(videoUrl, {
        format: format,
      }).pipe(res);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}
