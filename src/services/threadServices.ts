import ThreadModel from "../models/threadModel";
import ThreadRepository from "../repositories/threadRepositories";
import { v4 as uuidv4 } from "uuid";

export default class ThreadServices {
  threadRepository = new ThreadRepository();

  constructor() {}

  getThreads = async () => {
    return await this.threadRepository.getThreads();
  };

  createThread = async (threadData: any): Promise<ThreadModel> => {
    const threadID = uuidv4();
    const newThread = new ThreadModel(
      threadID,
      threadData.title,
      threadData.description,
      threadData.user_id
    );
    return await this.threadRepository.createThread(newThread);
  };

  deleteThread = async (threadID: string) => {
    await this.threadRepository.deleteThread(threadID);
  };
}
