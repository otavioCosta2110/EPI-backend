import pool from "../database";
import MaterialModel from "../models/materialModel";

export default class MaterialRepository {
  constructor() {}

  async createMaterial(material: MaterialModel): Promise<MaterialModel> {
    const { id, title, type, description, file_url, video_id } = material;

    const result = await pool.query(
      "INSERT INTO materials (id, title, type, description, video_id, file_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [id, title, type, description, video_id, file_url]
    );

    const createdMaterialRow = result.rows[0];
    const createdMaterial: MaterialModel = {
      id: createdMaterialRow.id,
      title: createdMaterialRow.title,
      type: createdMaterialRow.type,
      description: createdMaterialRow.description,
      video_id: createdMaterialRow.video_id,
      file_url: createdMaterialRow.file_url,
    };

    return createdMaterial;
  }

  async getMaterialById(id: string): Promise<MaterialModel | null> {
    try {
      const result = await pool.query("SELECT * FROM materials WHERE id = $1", [
        id,
      ]);
      if (result.rows.length === 0) {
        return null;
      }
      const materialRow = result.rows[0];
      console.log("Material Row:", materialRow);
      const material: MaterialModel = {
        id: materialRow.id,
        title: materialRow.title,
        type: materialRow.type,
        description: materialRow.description,
        file_url: materialRow.file_url,
      };
      console.log("Material:", material);
      return material;
    } catch (error) {
      console.error("Error fetching material:", error);
      return null;
    }
  }

  async updateMaterial(material: MaterialModel): Promise<MaterialModel> {
    const result = await pool.query(
      "UPDATE materials SET title = $1, type = $2, file_url = $3, description = $4 WHERE id = $5 RETURNING *",
      [material.title, material.type, material.description, material.id]
    );
    const updatedMaterialRow = result.rows[0];
    if (!updatedMaterialRow) {
      throw new Error("Material not found");
    }
    const updatedMaterial: MaterialModel = {
      id: updatedMaterialRow.id,
      title: updatedMaterialRow.title,
      type: updatedMaterialRow.type,
      description: updatedMaterialRow.description,
    };
    return updatedMaterial;
  }

  getMaterialByVideoId = async (videoID: string): Promise<MaterialModel[]> => {
    console.log("videoID:", videoID);
    const result = await pool.query(
      "SELECT * FROM materials WHERE video_id = $1",
      [videoID]
    );
    return result.rows.map(
      (row) =>
        new MaterialModel(
          row.id,
          row.title,
          row.type,
          row.description,
          videoID,
          row.file_url,
        )
    );
  };

  async deleteMaterial(id: string): Promise<void> {
    await pool.query("DELETE FROM materials WHERE id = $1", [id]);
  }
}
