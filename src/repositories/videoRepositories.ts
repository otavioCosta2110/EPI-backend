import pool from "../database";
import VideoModel from "../models/videoModel";

export default class TagRepository {
  constructor() {}

  getVideos = async (): Promise<VideoModel[]> => {
    const result = await pool.query("SELECT * FROM videos");
    const videos: VideoModel[] = [];
    for (const row of result.rows) {
      const video: VideoModel = {
        id: row.id,
        title: row.title,
        url: row.url,
        description: row.description,
        tags: [],
      };
      videos.push(video);
    }
    return videos;
  };

  createVideo = async (video: VideoModel): Promise<VideoModel> => {
    const result = await pool.query(
      "INSERT INTO videos (id, title, url, description) VALUES ($1, $2, $3, $4) RETURNING *",
      [video.id, video.title, video.url, video.description]
    );
    const createdVideoRow = result.rows[0];
    const createdVideo: VideoModel = {
      id: createdVideoRow.id,
      title: createdVideoRow.title,
      url: createdVideoRow.url,
      description: createdVideoRow.description,
      tags: [],
    };
    return createdVideo;
  };
}
