import pool from "../database";
import VideoModel from "../models/videoModel";
import TagRepository from "./tagRepositories";

export default class VideoRepository {
  constructor() {}

  getVideos = async (): Promise<VideoModel[]> => {
    const result = await pool.query(`
      SELECT v.id, v.title, v.url, v.description, array_agg(t.name) as tags, v.user_id
      FROM videos v
      LEFT JOIN video_tags vt ON v.id = vt.video_id
      LEFT JOIN tags t ON vt.tag_id = t.id
      GROUP BY v.id
    `);
    const videos: VideoModel[] = result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      url: row.url,
      description: row.description,
      tags: row.tags || [],
      user_id: row.user_id,
    }));
    return videos;
  };

  createVideo = async (video: VideoModel): Promise<VideoModel> => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const videoResult = await client.query(
        "INSERT INTO videos (id, title, url, description, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        [video.id, video.title, video.url, video.description, video.user_id]
      );
      const videoId = videoResult.rows[0].id;

      const tagRepository = new TagRepository();
      video.tags.forEach(async (tag) => {
        const tagFound = await tagRepository.getTagByName(tag);
        await client.query(
          "INSERT INTO video_tags (video_id, tag_id) VALUES ($1, $2)",
          [video.id, tagFound.id]
        );
      });

      await client.query("COMMIT");

      const createdVideo: VideoModel = {
        id: videoId,
        title: video.title,
        url: video.url,
        description: video.description,
        tags: video.tags,
        user_id: video.user_id,
      };
      return createdVideo;
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  };

  deleteVideo = async (videoID: string) => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query("DELETE FROM video_tags WHERE video_id = $1", [
        videoID,
      ]);
      await client.query("DELETE FROM videos WHERE id = $1", [videoID]);
      await client.query("COMMIT");
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  };
}
