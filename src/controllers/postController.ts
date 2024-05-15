import { Request, Response } from "express";
import PostServices from "../services/postServices";

export default class PostController {
  postServices = new PostServices();

  constructor() {}

  getPosts = async (req: Request, res: Response) => {
    try {
      const { threadID } = req.params;
      const posts = await this.postServices.getPosts(threadID);
      res.status(200).json({ data: posts });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  createPost = async (req: Request, res: Response) => {
    try {
      const postData = req.body;
      const createdPost = await this.postServices.createPost(postData);
      res.status(201).json({ data: createdPost });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  deletePost = async (req: Request, res: Response) => {
    try {
      const postID = req.body.id;
      await this.postServices.deletePost(postID);
      res.status(200).json({ message: "Post deleted" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}
