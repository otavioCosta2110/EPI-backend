import pool from "../database";
import ThreadModel from "../models/threadModel";

export default class ThreadRepository {
  constructor() {}

  getThreads = async (): Promise<ThreadModel[]> => {
    const result = await pool.query(
      "SELECT * FROM threads WHERE deleted_at IS NULL"
    );
    return result.rows.map(
      (row) =>
        new ThreadModel(
          row.id,
          row.title,
          row.description,
          row.user_id,
          row.created_at,
          row.updated_at,
          row.deleted_at
        )
    );
  };

  getThreadById = async (id: string): Promise<any> => {
    const result = await pool.query('SELECT * FROM threads WHERE id = $1 AND deleted_at IS NULL', [id]);
    if (result.rows.length === 0) {
      return null;
    }
    const threadRow = result.rows[0];
    const thread: ThreadModel = {
      id: threadRow.id,
      title: threadRow.title,
      description: threadRow.description,
      user_id: threadRow.user_id,
    };
    return thread;
  }

  createThread = async (thread: ThreadModel): Promise<ThreadModel> => {
    const result = await pool.query(
      "INSERT INTO threads (id, title, description, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [thread.id, thread.title, thread.description, thread.user_id]
    );
    return new ThreadModel(
      result.rows[0].id,
      result.rows[0].title,
      result.rows[0].description,
      result.rows[0].user_id,
      result.rows[0].created_at,
      result.rows[0].updated_at,
      result.rows[0].deleted_at
    );
  };

  deleteThread = async (threadID: string) => {
    await pool.query(
      "UPDATE threads SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1",
      [threadID]
    );
  };
}
