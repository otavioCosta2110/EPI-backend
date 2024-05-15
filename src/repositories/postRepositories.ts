import pool from "../database";
import PostModel from "../models/postModel";

export default class PostRepository {
  constructor() {}

  getPosts = async (threadID: string): Promise<PostModel[]> => {
    const result = await pool.query(
      "SELECT * FROM posts WHERE thread_id = $1 AND deleted_at IS NULL",
      [threadID]
    );
    return result.rows.map(
      (row) =>
        new PostModel(
          row.id,
          row.content,
          row.user_id,
          row.thread_id,
          row.created_at,
          row.updated_at,
          row.deleted_at
        )
    );
  };

  createPost = async (post: PostModel): Promise<PostModel> => {
    const result = await pool.query(
      "INSERT INTO posts (id, content, user_id, thread_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [post.id, post.content, post.user_id, post.thread_id]
    );
    return new PostModel(
      result.rows[0].id,
      result.rows[0].content,
      result.rows[0].user_id,
      result.rows[0].thread_id,
      result.rows[0].created_at,
      result.rows[0].updated_at,
      result.rows[0].deleted_at
    );
  };

  deletePost = async (postID: string) => {
    await pool.query(
      "UPDATE posts SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1",
      [postID]
    );
  };
}
