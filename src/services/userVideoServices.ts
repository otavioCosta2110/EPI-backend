import UserVideoModel from "../models/userVideoModel";
import UserVideoRepository from "../repositories/userVideoRepositories";

export default class UserVideoServices {
  userVideoRepository = new UserVideoRepository();

  constructor() {}

  addUserVideoPlay = async (user_id: string, video_id: string) => {
    const userVideo = new UserVideoModel(user_id, video_id);
    await this.userVideoRepository.addUserVideoPlay(userVideo);
  };
}
