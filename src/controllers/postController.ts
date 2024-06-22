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

  editPost = async (req: Request, res: Response) => {
    try {
      const body = req.body;
      const editedPost = await this.postServices.editPost(body);
      res.status(201).json({ data: editedPost });
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

  vote = async (req: Request, res: Response) => {
    try {
      const { userID, postID, vote } = req.body;
      if (!userID || !postID || !vote) {
        throw new Error("Missing fields");
      }
      await this.postServices.vote(userID, postID, vote);
      res.status(200).json({ message: "Vote registered" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  removeVote = async (req: Request, res: Response) => {
    try {
      const { userID, postID } = req.body;
      if (!userID || !postID) {
        throw new Error("Missing fields");
      }
      await this.postServices.removeVote(userID, postID);
      res.status(200).json({ message: "Vote removed" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  isVoted = async (req: Request, res: Response) => {
    try {
      const userID = req.params.userID;
      const postID = req.params.postID;
      if (!userID || !postID) {
        throw new Error("Missing fields");
      }
      const isVoted = await this.postServices.isVoted(userID, postID);
      res.status(200).json({ data: isVoted });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
