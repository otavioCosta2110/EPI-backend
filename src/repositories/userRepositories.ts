import pool from "../database";
import UserModel from "../models/userModel";
import TagRepository from "./tagRepositories";

export default class UserRepository {


  constructor() {
  }
  getUsers = async (): Promise<UserModel[]> => {
    const result = await pool.query('SELECT * FROM users');

    const users: UserModel[] = [];
    for (const row of result.rows) {
      const tagRepository = new TagRepository();
      const tags = await tagRepository.getTagByUserId(row.id);
      const user: UserModel = {
        id: row.id,
        name: row.name,
        email: row.email,
        password: row.password,
        role: row.role,
        tags: tags.map(tag => tag.name)
      };
      users.push(user);
    }
    return users;
  }

  getUserByEmail = async (email: string): Promise<any> => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL', [email]);
    if (result.rows.length === 0) {
      return null;
    }
    const userRow = result.rows[0];
    const tagRepository = new TagRepository();
    const tags = await tagRepository.getTagByUserId(userRow.id);
    const user: UserModel = {
      id: userRow.id,
      name: userRow.name,
      email: userRow.email,
      password: userRow.password,
      role: userRow.role,
      tags: tags.map(tag => tag.name)
    };
    return user;
  }

  createUser = async (user: UserModel): Promise<UserModel> => {
    const result = await pool.query('INSERT INTO users (id, name, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *', [user.id, user.name, user.email, user.password, user.role]);
    
    const tagRepository = new TagRepository()
    user.tags.forEach(async (tag) => {
      const tagFound = await tagRepository.getTagByName(tag)   
      const resultUsersTags = await pool.query('INSERT INTO users_tags (user_id, tag_id) VALUES ($1, $2) RETURNING *', [user.id, tagFound.id]);
    })
    const createdUserRow = await result.rows[0];
    const createdUser: UserModel = {
      id: createdUserRow.id,
      name: createdUserRow.name,
      email: createdUserRow.email,
      password: createdUserRow.password,
      role: createdUserRow.role,
      tags: user.tags
    };
    return createdUser;
  }

  updatePassword = async (email: string, password: string): Promise<UserModel> => {
    const result = await pool.query('UPDATE users SET password = $1, updated_at = $2 WHERE email = $3 RETURNING *', [password, new Date(), email]);
    const updatedUserRow = result.rows[0];
    if (result.rows.length === 0) {
      throw new Error("User not found");
    }else if(updatedUserRow.deleted_at) {
      throw new Error("User not found");
    }
    const tagRepository = new TagRepository();
    const tags = await tagRepository.getTagByUserId(updatedUserRow.id);
    const updatedUser: UserModel = {
      id: updatedUserRow.id,
      name: updatedUserRow.name,
      email: updatedUserRow.email,
      password: updatedUserRow.password,
      role: updatedUserRow.role,
      tags: tags.map(tag => tag.name)
    };
    return updatedUser;
  }
  
  updateName = async (email: string, name: string): Promise<UserModel> => {
    const result = await pool.query('UPDATE users SET name = $1, updated_at = $2 WHERE email = $3 RETURNING *', [name, new Date(), email]);
    const updatedUserRow = result.rows[0];
    if(updatedUserRow.deleted_at) {
      throw new Error("User not found");
    }
    const tagRepository = new TagRepository();
    const tags = await tagRepository.getTagByUserId(updatedUserRow.id);
    const updatedUser: UserModel = {
      id: updatedUserRow.id,
      name: updatedUserRow.name,
      email: updatedUserRow.email,
      password: updatedUserRow.password,
      role: updatedUserRow.role,
      tags: tags.map(tag => tag.name)
    };
    return updatedUser;
  }
  
  deleteUser = async (email: string): Promise<UserModel> => {
    const result = await pool.query('UPDATE users set deleted_at = $1 WHERE email = $2 RETURNING *', [new Date(), email]);
    const deletedUserRow = result.rows[0];
    const tagRepository = new TagRepository();
    const tags = await tagRepository.getTagByUserId(deletedUserRow.id);
    const deletedUser: UserModel = {
      id: deletedUserRow.id,
      name: deletedUserRow.name,
      email: deletedUserRow.email,
      password: deletedUserRow.password,
      role: deletedUserRow.role,
      tags: tags.map(tag => tag.name)
    };
    return deletedUser;
  }

  removeTag = async (email: string, tag: string): Promise<UserModel> => {
    const resultUser = await pool.query('SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL', [email]);
    if (resultUser.rows.length === 0) {
      throw new Error("User not found");
    }
    const userRow = resultUser.rows[0];
    const tagRepository = new TagRepository();
    const tagFound = await tagRepository.getTagByName(tag);
    const result = await pool.query('DELETE FROM users_tags WHERE user_id = $1 AND tag_id = $2 RETURNING *', [userRow.id, tagFound.id]);
    if (result.rows.length === 0) {
      throw new Error("Tag not found");
    }
    const tags = await tagRepository.getTagByUserId(userRow.id);
    const user: UserModel = {
      id: userRow.id,
      name: userRow.name,
      email: userRow.email,
      password: userRow.password,
      role: userRow.role,
      tags: tags.map(tag => tag.name)
    };
    return user;
  }

}
