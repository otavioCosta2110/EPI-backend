import pool from "../database";
import VideoModel from "../models/videoModel";
import { v4 as uuidv4 } from "uuid";

export default class TagRepository {
  constructor() {}

  getVideos = async (): Promise<VideoModel[]> => {
    const result = await pool.query(`
      SELECT v.id, v.title, v.url, v.description, array_agg(t.name) as tags
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
    }));
    return videos;
  };

  createVideo = async (video: VideoModel): Promise<VideoModel> => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Insert the new video with the generated ID
      const videoResult = await client.query(
        "INSERT INTO videos (id, title, url, description) VALUES ($1, $2, $3, $4) RETURNING id",
        [video.id, video.title, video.url, video.description]
      );
      const videoId = videoResult.rows[0].id;

      for (const tag of video.tags) {
        // Check if the tag exists
        const tagResult = await client.query(
          "SELECT id FROM tags WHERE name = $1",
          [tag]
        );

        if (tagResult.rows.length > 0) {
          // If tag exists, link the video with the tag
          await client.query(
            "INSERT INTO video_tags (video_id, tag_id) SELECT $1, id FROM tags WHERE name = $2",
            [videoId, tag]
          );
        } else {
          // If tag does not exist, you might want to handle this case appropriately
          throw new Error(`Tag '${tag}' does not exist.`);
        }
      }

      await client.query("COMMIT");

      const createdVideo: VideoModel = {
        id: videoId,
        title: video.title,
        url: video.url,
        description: video.description,
        tags: video.tags,
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
