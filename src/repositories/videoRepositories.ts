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
      rating: row.rating,
      timesRated: row.timesRated,
      ratingTotal: row.ratingtotal,
      user_id: row.user_id,
    }));
    return videos;
  };

  getVideoById = async (id: string): Promise<VideoModel> => {
    const result = await pool.query('SELECT * FROM videos WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      throw new Error("Video not found");
    }
    const videoRow = result.rows[0];
    const tagRepository = new TagRepository();
    const tags = await tagRepository.getTagByVideoId(videoRow.id);
    const video: VideoModel = {
      id: videoRow.id,
      title: videoRow.title,
      url: videoRow.url,
      description: videoRow.description,
      rating: videoRow.rating,
      timesRated: videoRow.timesRated,
      ratingTotal: videoRow.ratingtotal,
      user_id: videoRow.user_id,
      tags: tags.map(tag => tag.name)
    };
    return video;
  }

  search = async (name: string): Promise<VideoModel[]> => {
    const result = await pool.query(`
      SELECT id FROM videos WHERE title ILIKE $1;
    `, [`%${name}%`]);
    const videos = await Promise.all(result.rows.map(async (row) => {
      return await this.getVideoById(row.id);
    }));
    return videos;
  }

  createVideo = async (video: VideoModel): Promise<VideoModel> => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const videoResult = await client.query( "INSERT INTO videos (id, title, url, description, user_id, rating, timesRated, ratingtotal) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id", [video.id, video.title, video.url, video.description, video.user_id, video.rating, video.timesRated, video.ratingTotal]);
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
        rating: video.rating,
        timesRated: video.timesRated,
        ratingTotal: video.ratingTotal,
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

  rateVideo = async (userID: string, videoID: string, newRating: number) => {
    try {
      const video = await this.findVideoByID(videoID)
      if (!video){
        throw new Error("Video not found")
      }
      let average = newRating
      const ratingTotal = video.ratingTotal + newRating
      console.log(video.timesRated)
      if (video.timesRated > 0){
        console.log(ratingTotal, newRating, video.timesRated)
        average = ratingTotal / (video.timesRated + 1)
      } 

      const resultAverage = await pool.query('UPDATE videos SET rating = $1 WHERE id = $2', [average, videoID]);
      const resultTimesRated = await pool.query('UPDATE videos SET timesrated = timesrated + 1 WHERE id = $1', [videoID]);
      const resultRatingTotal = await pool.query('UPDATE videos SET ratingtotal = ratingtotal + $1 WHERE id = $2', [newRating, videoID]);
      const resultRatingUserVideos = await pool.query('UPDATE user_videos SET rating = $1 WHERE user_id = $2 AND video_id = $3', [newRating, userID, videoID]);
    }catch(err){
      throw err
    }
  }

  isVideoRatedByUser = async (userID: string, videoID: string): Promise<boolean> => {
    const result = await pool.query('SELECT * FROM user_videos WHERE user_id = $1 AND video_id = $2 AND rating IS NOT NULL', [userID, videoID]);
    console.log(result)
    if (result.rows.length === 0) {
      return false;
    }
    return true;
  }

  findVideoByID = async (id: string): Promise<VideoModel | any> => {
    const result = await pool.query('SELECT * FROM videos WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return null;
    }

    const videoRow = result.rows[0];
    const tagRepository = new TagRepository();
    const tags = await tagRepository.getTagByVideoId(videoRow.id);
    const video: VideoModel = {
      id: videoRow.id,
      title: videoRow.title,
      url: videoRow.url,
      rating: videoRow.rating,
      description: videoRow.description,
      tags: tags.map(tag => tag.name),
      timesRated: videoRow.timesrated,
      ratingTotal: videoRow.ratingtotal,
      user_id: videoRow.user_id
    };
    return video;
  }
}

