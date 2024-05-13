import { Request, Response } from "express";
import VideoRepository from "../repositories/videoRepositories";
import VideoServices from "../services/videoServices";

export default class TagController {
  videoRepository = new VideoRepository();
  videoServices = new VideoServices();
  constructor() {}

  getVideos = async (req: Request, res: Response) => {
    try {
      const videos = await this.videoServices.getVideos();
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
}
