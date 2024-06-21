import PostModel from "../models/postModel";
import PostRepository from "../repositories/postRepositories";
import { v4 as uuidv4 } from "uuid";

export default class PostServices {
  postRepository = new PostRepository();

  constructor() {}

  getPosts = async (threadID: string) => {
    return await this.postRepository.getPosts(threadID);
  };

  createPost = async (postData: any): Promise<PostModel> => {
    if (!postData.content || !postData.user_id || !postData.thread_id) {
      throw new Error("Missing fields");
    }
    const postID = uuidv4();
    const newPost = new PostModel(
      postID,
      postData.content,
      postData.user_id,
      postData.thread_id,
      postData.post_id
    );
    return await this.postRepository.createPost(newPost);
  };

  editPost = async (postData: any): Promise<PostModel> => {
    if (!postData.postID || !postData.content) {
      throw new Error("Missing fields");
    }
    return await this.postRepository.editPost(postData);
  };

  deletePost = async (postID: string) => {
    await this.postRepository.deletePost(postID);
  };

  vote = async (userID: string, postID: string, vote: number) => {
    await this.postRepository.vote(userID, postID, vote);
  };

  removeVote = async (userID: string, postID: string) => {
    await this.postRepository.removeVote(userID, postID);
  }
}
