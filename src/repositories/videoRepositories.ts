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
      "INSERT INTO videos (id, title, url, description, tags) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [video.id, video.title, video.url, video.description, video.tags]
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

  deleteVideo = async (videoID: string) => {
    await pool.query("DELETE FROM videos WHERE id = $1", [videoID]);
  };
}
