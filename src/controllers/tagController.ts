import { Request, Response } from "express"
import TagRepository from "../repositories/tagRepositories"
import TagServices from "../services/tagServices"

export default class TagController{
  tagRepository = new TagRepository()
  tagServices = new TagServices(this.tagRepository)
  constructor(){}

  getTags = async (req: Request, res: Response) => {
    try {
      const tags = await this.tagServices.getTags();
      res.status(200).json({data: tags});
    }catch (error: any) {
      res.status(500).json({error: error.message});
    }
  }
  
  createTag = async (req: Request, res: Response) => {
    try {
      const tag = req.body;
      const createdTag = await this.tagServices.create(tag);
      res.status(201).json({data: createdTag});
    }catch (error: any) {
      res.status(500).json({error: error.message});
    }
  }

  deleteTag = async (req: Request, res: Response) => {
    try {
      const tagId = req.body.id;
      const deletedTag = await this.tagServices.delete(tagId);
      res.status(201).json({data: deletedTag});
    }catch (error: any) {
      res.status(500).json({error: error.message});
    }
  }

}
