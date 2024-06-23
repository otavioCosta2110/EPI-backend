import pool from '../database';
import jwt from 'jsonwebtoken';
import UserModel from '../models/userModel';
import TagRepository from './tagRepositories';

export default class UserRepository {
  constructor() {}
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
        tags: tags.map((tag) => tag.name),
        image_url: row.image_url,
      };
      users.push(user);
    }
    return users;
  };

  getUserByEmail = async (email: string): Promise<any> => {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL',
      [email]
    );
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
      tags: tags.map((tag) => tag.name),
      image_url: userRow.image_url,
    };
    return user;
  };
  getUserById = async (id: string): Promise<any> => {
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1 AND deleted_at IS NULL',
      [id]
    );
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
      tags: tags.map((tag) => tag.name),
      image_url: userRow.image_url,
    };
    return user;
  };

  getLastLogin = async (id: string): Promise<Date> => {
    const result = await pool.query(
      'SELECT last_login FROM users WHERE id = $1',
      [id]
    );
    const lastLogin = result.rows[0].last_login;
    return lastLogin;
  };

  createUser = async (user: UserModel): Promise<UserModel> => {
    const result = await pool.query(
      'INSERT INTO users (id, name, email, password, role, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [user.id, user.name, user.email, user.password, user.role, user.image_url]
    );

    const tagRepository = new TagRepository();
    if (user.tags) {
      user.tags.forEach(async (tag) => {
        const tagFound = await tagRepository.getTagByName(tag);
        const resultUsersTags = await pool.query(
          'INSERT INTO users_tags (user_id, tag_id) VALUES ($1, $2) RETURNING *',
          [user.id, tagFound.id]
        );
      });
    }
    const createdUserRow = await result.rows[0];
    const createdUser: UserModel = {
      id: createdUserRow.id,
      name: createdUserRow.name,
      email: createdUserRow.email,
      password: createdUserRow.password,
      role: createdUserRow.role,
      tags: user.tags,
      image_url: createdUserRow.image_url,
    };
    return createdUser;
  };

  login = async (id: string, email: string, name: string): Promise<string> => {
    const token = jwt.sign({ id: id, email: email, name: name }, 'secret', {
      expiresIn: '1h',
    });
    console.log(token);
    const result = await pool.query(
      'UPDATE users SET last_login = $1 WHERE id = $2',
      [new Date(), id]
    );
    return token;
  };

  updatePassword = async (
    email: string,
    password: string
  ): Promise<UserModel> => {
    const result = await pool.query(
      'UPDATE users SET password = $1, updated_at = $2 WHERE email = $3 RETURNING *',
      [password, new Date(), email]
    );
    const updatedUserRow = result.rows[0];
    if (result.rows.length === 0) {
      throw new Error('User not found');
    } else if (updatedUserRow.deleted_at) {
      throw new Error('User not found');
    }
    const tagRepository = new TagRepository();
    const tags = await tagRepository.getTagByUserId(updatedUserRow.id);
    const updatedUser: UserModel = {
      id: updatedUserRow.id,
      name: updatedUserRow.name,
      email: updatedUserRow.email,
      password: updatedUserRow.password,
      role: updatedUserRow.role,
      tags: tags.map((tag) => tag.name),
    };
    return updatedUser;
  };

  updateName = async (email: string, name: string): Promise<UserModel> => {
    const result = await pool.query(
      'UPDATE users SET name = $1, updated_at = $2 WHERE email = $3 RETURNING *',
      [name, new Date(), email]
    );
    const updatedUserRow = result.rows[0];
    if (updatedUserRow.deleted_at) {
      throw new Error('User not found');
    }
    const tagRepository = new TagRepository();
    const tags = await tagRepository.getTagByUserId(updatedUserRow.id);
    const updatedUser: UserModel = {
      id: updatedUserRow.id,
      name: updatedUserRow.name,
      email: updatedUserRow.email,
      password: updatedUserRow.password,
      role: updatedUserRow.role,
      tags: tags.map((tag) => tag.name),
    };
    return updatedUser;
  };

  deleteUser = async (email: string): Promise<UserModel> => {
    const result = await pool.query(
      'UPDATE users set deleted_at = $1 WHERE email = $2 RETURNING *',
      [new Date(), email]
    );
    const deletedUserRow = result.rows[0];
    const tagRepository = new TagRepository();
    const tags = await tagRepository.getTagByUserId(deletedUserRow.id);
    const deletedUser: UserModel = {
      id: deletedUserRow.id,
      name: deletedUserRow.name,
      email: deletedUserRow.email,
      password: deletedUserRow.password,
      role: deletedUserRow.role,
      tags: tags.map((tag) => tag.name),
      image_url: deletedUserRow.image_url,
    };
    return deletedUser;
  };

  removeTag = async (email: string, tag: string): Promise<UserModel> => {
    const resultUser = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL',
      [email]
    );
    if (resultUser.rows.length === 0) {
      throw new Error('User not found');
    }
    const userRow = resultUser.rows[0];
    const tagRepository = new TagRepository();
    const tagFound = await tagRepository.getTagByName(tag);
    const result = await pool.query(
      'DELETE FROM users_tags WHERE user_id = $1 AND tag_id = $2 RETURNING *',
      [userRow.id, tagFound.id]
    );
    if (result.rows.length === 0) {
      throw new Error('Tag not found');
    }
    const tags = await tagRepository.getTagByUserId(userRow.id);
    const user: UserModel = {
      id: userRow.id,
      name: userRow.name,
      email: userRow.email,
      password: userRow.password,
      role: userRow.role,
      tags: tags.map((tag) => tag.name),
    };
    return user;
  };

  updateUserImage = async (
    email: string,
    imageUrl: string
  ): Promise<UserModel> => {
    const result = await pool.query(
      'UPDATE users SET image_url = $1, updated_at = $2 WHERE email = $3 RETURNING *',
      [imageUrl, new Date(), email]
    );
    const updatedUserRow = result.rows[0];
    if (result.rows.length === 0) {
      throw new Error('User not found');
    } else if (updatedUserRow.deleted_at) {
      throw new Error('User not found');
    }
    const tagRepository = new TagRepository();
    const tags = await tagRepository.getTagByUserId(updatedUserRow.id);
    const updatedUser: UserModel = {
      id: updatedUserRow.id,
      name: updatedUserRow.name,
      email: updatedUserRow.email,
      password: updatedUserRow.password,
      role: updatedUserRow.role,
      tags: tags.map((tag) => tag.name),
      image_url: updatedUserRow.image_url,
    };
    return updatedUser;
  };
}
