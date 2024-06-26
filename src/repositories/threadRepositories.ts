import pool from "../database";
import ThreadModel from "../models/threadModel";
import TagRepository from "./tagRepositories";

export default class ThreadRepository {
  constructor() {}

  getThreads = async (): Promise<ThreadModel[]> => {
    const result = await pool.query(
      "SELECT * FROM threads WHERE deleted_at IS NULL ORDER BY created_at DESC"
    );
    const threads: ThreadModel[] = [];
    for (const row of result.rows) {
      const tagRepository = new TagRepository();
      const tags = await tagRepository.getTagByThreadId(row.id);
      const thread: ThreadModel = {
        id: row.id,
        title: row.title,
        description: row.description,
        user_id: row.user_id,
        tags: tags.map((tag) => tag.name),
      };
      threads.push(thread);
    }
    return threads;
  };

  getThreadById = async (id: string): Promise<any> => {
    const result = await pool.query(
      "SELECT * FROM threads WHERE id = $1 AND deleted_at IS NULL",
      [id]
    );
    if (result.rows.length === 0) {
      return null;
    }
    const threadRow = result.rows[0];
    const tagRepository = new TagRepository();
    const tags = await tagRepository.getTagByThreadId(threadRow.id);
    const thread: ThreadModel = {
      id: threadRow.id,
      title: threadRow.title,
      description: threadRow.description,
      user_id: threadRow.user_id,
      tags: tags.map((tag) => tag.name),
    };
    return thread;
  };

  createThread = async (thread: ThreadModel): Promise<ThreadModel> => {
    const result = await pool.query(
      "INSERT INTO threads (id, title, description, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [thread.id, thread.title, thread.description, thread.user_id]
    );
    const tagRepository = new TagRepository();
    if (thread.tags) {
      thread.tags.forEach(async (tag: string) => {
        const tagFound = await tagRepository.getTagByName(tag);
        const resultUsersTags = await pool.query(
          "INSERT INTO threads_tags (thread_id, tag_id) VALUES ($1, $2) RETURNING *",
          [thread.id, tagFound.id]
        );
      });
    }
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
