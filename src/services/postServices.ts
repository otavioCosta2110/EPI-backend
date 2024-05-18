import PostModel from "../models/postModel";
import PostRepository from "../repositories/postRepositories";
import { v4 as uuidv4 } from "uuid";
import TagRepository from "../repositories/tagRepositories";

export default class PostServices {
  postRepository = new PostRepository();

  constructor() {}

  getPosts = async (threadID: string) => {
    return await this.postRepository.getPosts(threadID);
  };

  createPost = async (postData: any): Promise<PostModel> => {
    const tags: string[] = postData.tags;

    const tagRepository = new TagRepository()
    
    console.log(tags)
    if(tags){
      for(let i = 0; i < tags.length; i++) {
        const tagExists = await tagRepository.getTagByName(tags[i])   
        if (!tagExists) {
          throw new Error("Tag not found");
        }
      }
    }
    const postID = uuidv4();
    const newPost = new PostModel(
      postID,
      postData.content,
      postData.user_id,
      postData.thread_id,
      tags
    );
    return await this.postRepository.createPost(newPost);
  };

  deletePost = async (postID: string) => {
    await this.postRepository.deletePost(postID);
  };
}
