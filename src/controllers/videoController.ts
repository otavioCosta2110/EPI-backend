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

  deleteVideo = async (req: Request, res: Response) => {
    try {
      const videoID = req.body.id;
      await this.videoServices.deleteVideo(videoID);
      res.status(200).json({ message: "Video deleted" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  rateVideo = async (req: Request, res: Response) => {
    try{
      const {videoID, rating} = req.body;
      await this.videoServices.rateVideo(videoID, rating)
      res.status(200).json({message: "Video Rated!"})
    } catch(error: any){
      res.status(500).json({error: error.message})
    }

  }
}
