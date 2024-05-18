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
    const postID = uuidv4();
    const newPost = new PostModel(
      postID,
      postData.content,
      postData.user_id,
      postData.thread_id
    );
    return await this.postRepository.createPost(newPost);
  };

  deletePost = async (postID: string) => {
    await this.postRepository.deletePost(postID);
  };
}
