import pool from "../database";
import PostModel from "../models/postModel";

export default class PostRepository {
  constructor() {}

  getPosts = async (threadID: string): Promise<PostModel[]> => {
    const result = await pool.query(
      "SELECT * FROM posts WHERE thread_id = $1 AND deleted_at IS NULL ORDER BY created_at DESC",
      [threadID]
    );
    return result.rows.map(
      (row) =>
        new PostModel(
          row.id,
          row.content,
          row.user_id,
          row.thread_id,
          row.post_id,
          row.created_at,
          row.updated_at,
          row.deleted_at
        )
    );
  };

  createPost = async (post: PostModel): Promise<PostModel> => {
    console.log(post);
    const result = await pool.query(
      "INSERT INTO posts (id, content, user_id, thread_id, post_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [post.id, post.content, post.user_id, post.thread_id, post.post_id]
    );
    return new PostModel(
      result.rows[0].id,
      result.rows[0].content,
      result.rows[0].user_id,
      result.rows[0].thread_id,
      result.rows[0].post_id,
      result.rows[0].created_at,
      result.rows[0].updated_at,
      result.rows[0].deleted_at
    );
  };

  editPost = async (post: any): Promise<PostModel> => {
    const result = await pool.query(
      "UPDATE posts SET content = $1 WHERE id = $2 RETURNING *",
      [post.content, post.postID]
    );
    console.log(post);
    return new PostModel(
      result.rows[0].id,
      result.rows[0].content,
      result.rows[0].user_id,
      result.rows[0].thread_id,
      result.rows[0].post_id,
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

  vote = async (userID: string, postID: string, vote: number) => {
    const voteBool = vote == 1;
    const voteValue = voteBool ? 1: -1;
    const checkVote = await pool.query(
      "SELECT voted FROM user_post_votes WHERE user_id = $1 AND post_id = $2",
        [userID, postID]
    );

    if (checkVote.rows.length === 0 || checkVote.rows[0].voted === null || checkVote.rows[0].voted !== voteBool) {
      const resultUserPost = await pool.query(
        "INSERT INTO user_post_votes (user_id, post_id, voted) VALUES ($1, $2, $3) ON CONFLICT (user_id, post_id) DO UPDATE SET voted = EXCLUDED.voted",
          [userID, postID, voteBool]
      );

      const resultVotes = await pool.query(
        "UPDATE posts SET votes = votes + $1 WHERE id = $2",
          [voteValue, postID]
      );
    }
  };

  removeVote = async (userID: string, postID: string) => {
    const checkVote = await pool.query(
      "SELECT voted FROM user_post_votes WHERE user_id = $1 AND post_id = $2",
        [userID, postID]
    );
    const votedValue = checkVote.rows[0].voted ? -1 : 1;
    console.log(votedValue)

    if (checkVote.rows.length !== 0) {
      const resultUserPost = await pool.query(
        "DELETE FROM user_post_votes WHERE user_id = $1 AND post_id = $2",
          [userID, postID]
      );


      const resultVotes = await pool.query(
        "UPDATE posts SET votes = votes + $1 WHERE id = $2",
          [votedValue, postID]
      );
    }
  }
}
