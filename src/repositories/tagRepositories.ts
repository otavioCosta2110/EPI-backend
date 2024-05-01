import pool from "../database";
import TagModel from "../models/tagModel";

export default class TagRepository{
  constructor() {
  }

  getTags = async (): Promise<TagModel[]> => {
    const result = await pool.query('SELECT * FROM tags');
    const tags: TagModel[] = [];
    for (const row of result.rows) {
      const tag: TagModel = {
        id: row.id,
        name: row.name
      };
      tags.push(tag);
    }
    return tags;
  }

  getTagByName = async (name: string): Promise<any> => {
    const result = await pool.query('SELECT * FROM tags WHERE name = $1', [name]);
    if (result.rows.length === 0) {
      return null;
    }
    const tagRow = result.rows[0];
    const tag: TagModel = {
      id: tagRow.id,
      name: tagRow.name
    };
    return tag;
  }

  createTag = async (tag: TagModel): Promise<TagModel> => {
    const result = await pool.query('INSERT INTO tags (id, name) VALUES ($1, $2) RETURNING *', [tag.id, tag.name]);
    const createdTagRow = await result.rows[0];
    const createdTag: TagModel = {
      id: createdTagRow.id,
      name: createdTagRow.name
    };
    return createdTag;
  }

  getTagByUserId = async (userId: string): Promise<TagModel[]> => {
    const result = await pool.query('SELECT tags.id, tags.name FROM tags INNER JOIN users_tags ON tags.id = users_tags.tag_id WHERE users_tags.user_id = $1', [userId]);
    const tags: TagModel[] = [];
    for (const row of result.rows) {
      const tag: TagModel = {
        id: row.id,
        name: row.name
      };
      tags.push(tag);
    }
    console.log(tags);
    return tags;
  }

  updateName = async (name: string, newName: string): Promise<TagModel> => {
    const result = await pool.query('UPDATE tags SET name = $1 WHERE name = $2 RETURNING *', [newName, name]);
    const updatedTagRow = result.rows[0];
    if (result.rows.length === 0) {
      throw new Error("Tag not found");
    }
    const updatedTag: TagModel = {
      id: updatedTagRow.id,
      name: updatedTagRow.name
    };
    return updatedTag;
  }

  deleteTag = async (name: string): Promise<TagModel> => {
    const result = await pool.query('UPDATE tags set deleted_at = $1 WHERE name = $2 RETURNING *', [new Date(), name]);
    const deletedTagRow = result.rows[0];
    if (result.rows.length === 0) {
      throw new Error("Tag not found");
    }
    const deletedTag: TagModel = {
      id: deletedTagRow.id,
      name: deletedTagRow.name
    };
    return deletedTag;
  }


}
