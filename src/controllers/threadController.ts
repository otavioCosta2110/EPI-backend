import { Request, Response } from "express";
import ThreadServices from "../services/threadServices";

export default class ThreadController {
  threadServices = new ThreadServices();

  constructor() {}

  getThreads = async (req: Request, res: Response) => {
    try {
      const threads = await this.threadServices.getThreads();
      res.status(200).json({ data: threads });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

   getThreadById = async (req: Request, res: Response) => {
     try {
       const id = req.query.id as string
       const thread = await this.threadServices.getThreadById(id);
       res.status(200).json({data: thread});
     }catch (error: any) {
       res.status(500).json({error: error.message});
     }
   }

  createThread = async (req: Request, res: Response) => {
    try {
      const threadData = req.body;
      const createdThread = await this.threadServices.createThread(threadData);
      res.status(201).json({ data: createdThread });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  deleteThread = async (req: Request, res: Response) => {
    try {
      const threadID = req.body.id;
      await this.threadServices.deleteThread(threadID);
      res.status(200).json({ message: "Thread deleted" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}
