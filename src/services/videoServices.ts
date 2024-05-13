import VideoModel from "../models/videoModel";
import VideoRepository from "../repositories/videoRepositories";
import { v4 as uuidv4 } from "uuid";

export default class TagServices {
  videoRepository = new VideoRepository();

  constructor() {}

  getVideos = async () => {
    const videos = await this.videoRepository.getVideos();
    return videos;
  };

  createVideo = async (video: any): Promise<VideoModel> => {
    if (!video.title || !video.url || !video.description) {
      throw new Error("Missing fields");
    }
    const videoID = uuidv4();
    const newVideo = new VideoModel(
      videoID,
      video.title,
      video.url,
      video.description,
      video.tags
    );
    const createdVideo = await this.videoRepository.createVideo(newVideo);

    return createdVideo;
  };
}
