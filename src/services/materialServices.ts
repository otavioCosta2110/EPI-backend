import MaterialModel from "../models/materialModel";
import { v4 as uuidv4 } from "uuid";
import MaterialRepository from "../repositories/materialRepositories";

export default class MaterialServices {
  materialRepository = new MaterialRepository();

  constructor() {}

  async createMaterial(materialData: any): Promise<MaterialModel> {
    const { title, type, description, fileUrl, videoID } = materialData;
    if (!title || !type) {
      throw new Error("Missing fields");
    }
    const materialID = uuidv4();
    const newMaterial = new MaterialModel(
      materialID,
      title,
      type,
      description,
      videoID,
      fileUrl
    );
    const createdMaterial = await this.materialRepository.createMaterial(
      newMaterial
    );
    return createdMaterial;
  }

  async getMaterialById(id: string): Promise<MaterialModel | null> {
    const material = await this.materialRepository.getMaterialById(id);
    if (!material) {
      throw new Error("Material not found");
    }
    return material;
  }

  getMaterialByVideoId = async (videoID: string): Promise<MaterialModel[]> => {
    return await this.materialRepository.getMaterialByVideoId(videoID);
  };

  async updateMaterial(id: string, materialData: any): Promise<MaterialModel> {
    const existingMaterial = await this.materialRepository.getMaterialById(id);
    if (!existingMaterial) {
      throw new Error("Material not found");
    }
    const updatedMaterial = { ...existingMaterial, ...materialData };
    const result = await this.materialRepository.updateMaterial(
      updatedMaterial
    );
    return result;
  }

  async deleteMaterial(id: string): Promise<void> {
    const existingMaterial = await this.materialRepository.getMaterialById(id);
    if (!existingMaterial) {
      throw new Error("Material not found");
    }
    await this.materialRepository.deleteMaterial(id);
  }
}
