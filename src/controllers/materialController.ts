import { Request, Response } from "express";
import MaterialServices from "../services/materialServices";

export default class MaterialController {
  materialServices = new MaterialServices();

  constructor() {}
  createMaterial = async (req: Request, res: Response) => {
    try {
      const { title, type, description, videoID } = req.body;
      const fileUrl = req.file ? req.file.filename : undefined;
      const materialData = { title, type, description, fileUrl, videoID };
      const createdMaterial = await this.materialServices.createMaterial(
        materialData
      );
      res.status(201).json({ data: createdMaterial });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getMaterialById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const material = await this.materialServices.getMaterialById(id);
      if (!material) {
        return res.status(404).json({ error: "Material not found" });
      }
      const responseData: any = { data: material };
      if (material.file_url) {
        responseData.data.file_url = material.file_url;
      }
      res.status(200).json(responseData);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getMaterials = async (req: Request, res: Response) => {
    try {
      const materials = await this.materialServices.getMaterials();
      const responseData: any = { data: materials };
      res.status(200).json(responseData);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };


  getMaterialByVideoId = async (req: Request, res: Response) => {
    try {
      const { videoID } = req.params;
      console.log("vsdasdasideoID:", videoID)
      const materials = await this.materialServices.getMaterialByVideoId(videoID);
      res.status(200).json({ data: materials });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  updateMaterial = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const materialData = req.body;
      const updatedMaterial = await this.materialServices.updateMaterial(
        id,
        materialData
      );
      res.status(200).json({ data: updatedMaterial });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  deleteMaterial = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.materialServices.deleteMaterial(id);
      res.status(204).end();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}
