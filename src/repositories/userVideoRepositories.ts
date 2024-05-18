import pool from "../database";
import UserVideoModel from "../models/userVideoModel";

export default class UserVideoRepository {
  constructor() {}

  addUserVideoPlay = async (userVideo: UserVideoModel): Promise<void> => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const result = await client.query(
        `INSERT INTO user_videos (user_id, video_id, play_count, last_played) 
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (user_id, video_id) 
         DO UPDATE SET play_count = user_videos.play_count + 1, last_played = $4`,
        [
          userVideo.user_id,
          userVideo.video_id,
          userVideo.play_count,
          new Date(),
        ]
      );

      await client.query("COMMIT");
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  };

  getWatchedVideos = async (user_id: string): Promise<UserVideoModel[]> => {
    const result = await pool.query(
      "SELECT * FROM user_videos WHERE user_id = $1",
      [user_id]
    );
    const userVideos: UserVideoModel[] = result.rows.map((row) => {
      return new UserVideoModel(
        row.user_id,
        row.video_id,
        row.play_count,
        row.last_played
      );
    });
    return userVideos;
  }
}
