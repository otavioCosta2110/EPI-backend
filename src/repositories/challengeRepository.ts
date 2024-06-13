import pool from "../database";
import ChallengeModel from "../models/challengeModel";

export default class ChallengeRepository {
  constructor() {}

  async createChallenge(challenge: ChallengeModel): Promise<ChallengeModel> {
    const {
      id,
      title,
      type,
      description,
      startDate,
      endDate,
      video_id,
      file_url,
    } = challenge;

    const result = await pool.query(
      "INSERT INTO challenges (id, title, type, description, start_date, end_date, video_id, file_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [id, title, type, description, startDate, endDate, video_id, file_url]
    );

    const createdChallengeRow = result.rows[0];
    const createdChallenge: ChallengeModel = {
      id: createdChallengeRow.id,
      title: createdChallengeRow.title,
      type: createdChallengeRow.type,
      description: createdChallengeRow.description,
      startDate: createdChallengeRow.start_date,
      endDate: createdChallengeRow.end_date,
      video_id: createdChallengeRow.video_id,
      file_url: createdChallengeRow.file_url,
    };

    return createdChallenge;
  }

  async getChallengeById(id: string): Promise<ChallengeModel | null> {
    try {
      const result = await pool.query(
        "SELECT * FROM challenges WHERE id = $1",
        [id]
      );
      if (result.rows.length === 0) {
        return null;
      }
      const challengeRow = result.rows[0];
      const challenge: ChallengeModel = {
        id: challengeRow.id,
        title: challengeRow.title,
        type: challengeRow.type,
        description: challengeRow.description,
        startDate: challengeRow.start_date,
        endDate: challengeRow.end_date,
        video_id: challengeRow.video_id,
        file_url: challengeRow.file_url,
      };
      return challenge;
    } catch (error) {
      console.error("Error fetching challenge:", error);
      return null;
    }
  }

  async getChallenges(): Promise<ChallengeModel[] | null> {
    try {
      const result = await pool.query(
        "SELECT * FROM challenges WHERE deleted_at IS NULL"
      );
      const challenges: ChallengeModel[] = [];
      for (const row of result.rows) {
        const challenge: ChallengeModel = {
          id: row.id,
          title: row.title,
          type: row.type,
          description: row.description,
          startDate: row.start_date,
          endDate: row.end_date,
          video_id: row.video_id,
          file_url: row.file_url,
        };
        challenges.push(challenge);
      }
      return challenges;
    } catch (error) {
      console.error("Error fetching challenges:", error);
      return null;
    }
  }

  async updateChallenge(challenge: ChallengeModel): Promise<ChallengeModel> {
    const result = await pool.query(
      "UPDATE challenges SET title = $1, type = $2, description = $3, start_date = $4, end_date = $5, video_id = $6, file_url = $7 WHERE id = $8 RETURNING *",
      [
        challenge.title,
        challenge.type,
        challenge.description,
        challenge.startDate,
        challenge.endDate,
        challenge.video_id,
        challenge.file_url,
        challenge.id,
      ]
    );
    const updatedChallengeRow = result.rows[0];
    if (!updatedChallengeRow) {
      throw new Error("Challenge not found");
    }
    const updatedChallenge: ChallengeModel = {
      id: updatedChallengeRow.id,
      title: updatedChallengeRow.title,
      type: updatedChallengeRow.type,
      description: updatedChallengeRow.description,
      startDate: updatedChallengeRow.start_date,
      endDate: updatedChallengeRow.end_date,
      video_id: updatedChallengeRow.video_id,
      file_url: updatedChallengeRow.file_url,
    };
    return updatedChallenge;
  }

  getChallengeByVideoId = async (
    videoID: string
  ): Promise<ChallengeModel[]> => {
    const result = await pool.query(
      "SELECT * FROM challenges WHERE video_id = $1",
      [videoID]
    );
    return result.rows.map(
      (row) =>
        new ChallengeModel(
          row.id,
          row.title,
          row.type,
          row.description,
          row.start_date,
          row.end_date,
          videoID,
          row.file_url
        )
    );
  };

  async deleteChallenge(id: string): Promise<void> {
    await pool.query("DELETE FROM challenges WHERE id = $1", [id]);
  }
}
