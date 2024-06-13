import { Request, Response } from "express";
import ChallengeServices from "../services/challengeService";

export default class ChallengeController {
  challengeServices = new ChallengeServices();

  constructor() {}
  createChallenge = async (req: Request, res: Response) => {
    try {
      const { title, type, description, startDate, endDate, videoID } =
        req.body;
      const fileUrl = req.file ? req.file.filename : req.body.file_url;
      const challengeData = {
        title,
        type,
        description,
        startDate,
        endDate,
        fileUrl,
        videoID,
      };
      const createdChallenge = await this.challengeServices.createChallenge(
        challengeData
      );
      res.status(201).json({ data: createdChallenge });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getChallengeById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const challenge = await this.challengeServices.getChallengeById(id);
      if (!challenge) {
        return res.status(404).json({ error: "Challenge not found" });
      }
      const responseData: any = { data: challenge };
      if (challenge.file_url) {
        responseData.data.file_url = challenge.file_url;
      }
      res.status(200).json(responseData);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getChallenges = async (req: Request, res: Response) => {
    try {
      const challenges = await this.challengeServices.getChallenges();
      const responseData: any = { data: challenges };
      res.status(200).json(responseData);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getChallengeByVideoId = async (req: Request, res: Response) => {
    try {
      const { videoID } = req.params;
      const challenges = await this.challengeServices.getChallengeByVideoId(
        videoID
      );
      res.status(200).json({ data: challenges });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  updateChallenge = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const challengeData = req.body;
      const updatedChallenge = await this.challengeServices.updateChallenge(
        id,
        challengeData
      );
      res.status(200).json({ data: updatedChallenge });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  deleteChallenge = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.challengeServices.deleteChallenge(id);
      res.status(204).end();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}
