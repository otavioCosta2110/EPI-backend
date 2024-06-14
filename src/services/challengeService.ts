import ChallengeModel from "../models/challengeModel";
import { v4 as uuidv4 } from "uuid";
import ChallengeRepository from "../repositories/challengeRepository";

export default class ChallengeServices {
  challengeRepository = new ChallengeRepository();

  constructor() {}

  async createChallenge(challengeData: any): Promise<ChallengeModel> {
    const { title, type, description, startDate, endDate, fileUrl, videoID } =
      challengeData;
    if (!title || !type) {
      throw new Error("Missing fields");
    }
    const challengeID = uuidv4();
    const newChallenge = new ChallengeModel(
      challengeID,
      title,
      type,
      description,
      new Date(startDate),
      new Date(endDate),
      videoID,
      fileUrl
    );
    const createdChallenge = await this.challengeRepository.createChallenge(
      newChallenge
    );
    return createdChallenge;
  }

  async getChallengeById(id: string): Promise<ChallengeModel | null> {
    const challenge = await this.challengeRepository.getChallengeById(id);
    if (!challenge) {
      throw new Error("Challenge not found");
    }
    return challenge;
  }

  async getChallenges(): Promise<ChallengeModel[] | null> {
    const challenges = await this.challengeRepository.getChallenges();
    return challenges;
  }

  getChallengeByVideoId = async (
    videoID: string
  ): Promise<ChallengeModel[]> => {
    return await this.challengeRepository.getChallengeByVideoId(videoID);
  };

  async updateChallenge(
    id: string,
    challengeData: any
  ): Promise<ChallengeModel> {
    const existingChallenge = await this.challengeRepository.getChallengeById(
      id
    );
    if (!existingChallenge) {
      throw new Error("Challenge not found");
    }
    const updatedChallenge = { ...existingChallenge, ...challengeData };
    const result = await this.challengeRepository.updateChallenge(
      updatedChallenge
    );
    return result;
  }

  async deleteChallenge(id: string): Promise<void> {
    const existingChallenge = await this.challengeRepository.getChallengeById(
      id
    );
    if (!existingChallenge) {
      throw new Error("Challenge not found");
    }
    await this.challengeRepository.deleteChallenge(id);
  }
}
