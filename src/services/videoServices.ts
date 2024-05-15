import VideoModel from "../models/videoModel";
import TagRepository from "../repositories/tagRepositories";
import VideoRepository from "../repositories/videoRepositories";
import { v4 as uuidv4 } from "uuid";

export default class VideoServices {
  videoRepository = new VideoRepository();

  constructor() {}

  getVideos = async () => {
    const videos = await this.videoRepository.getVideos();
    return videos;
  };

  createVideo = async (video: any): Promise<VideoModel> => {
    if (
      !video.title ||
      !video.url ||
      !video.description ||
      !video.tags ||
      !video.user_id
    ) {
      throw new Error("Missing fields");
    }
    const videoID = uuidv4();
    const newVideo = new VideoModel(
      videoID,
      video.title,
      video.url,
      video.description,
      video.tags,
      video.user_id
    );
    const tagRepository = new TagRepository();
    for (let i = 0; i < video.tags.length; i++) {
      const tagExists = await tagRepository.getTagByName(video.tags[i]);
      if (!tagExists) {
        throw new Error("Tag not found");
      }
    }
    const createdVideo = await this.videoRepository.createVideo(newVideo);
    return createdVideo;
  };

  deleteVideo = async (videoID: string) => {
    await this.videoRepository.deleteVideo(videoID);
  };
}
