import pool from "../database";
import UserModel from "../models/userModel";

export default class UserRepository {


  constructor() {
  }
  getUsers = async (): Promise<UserModel[]> => {
    const result = await pool.query('SELECT * FROM users');
    const users: UserModel[] = [];
    for (const row of result.rows) {
      const user: UserModel = {
        id: row.id,
        name: row.name,
        email: row.email,
        password: row.password,
        role: row.role
      };
      users.push(user);
    }
    return users;
  }

  getUserByEmail = async (email: string): Promise<UserModel> => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      throw new Error("User not found");
    }
    const userRow = result.rows[0];
    const user: UserModel = {
      id: userRow.id,
      name: userRow.name,
      email: userRow.email,
      password: userRow.password,
      role: userRow.role
    };
    return user;
  }

  createUser = async (user: UserModel): Promise<UserModel> => {
    const result = await pool.query('INSERT INTO users (id, name, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *', [user.id, user.name, user.email, user.password, user.role]);
    const createdUserRow = await result.rows[0];
    const createdUser: UserModel = {
      id: createdUserRow.id,
      name: createdUserRow.name,
      email: createdUserRow.email,
      password: createdUserRow.password,
      role: createdUserRow.role
    };
    return createdUser;
  }

  updatePassword = async (email: string, password: string): Promise<UserModel> => {
    const result = await pool.query('UPDATE users SET password = $1, updated_at = $2 WHERE email = $3 RETURNING *', [password, new Date(), email]);
    const updatedUserRow = result.rows[0];
    const updatedUser: UserModel = {
      id: updatedUserRow.id,
      name: updatedUserRow.name,
      email: updatedUserRow.email,
      password: updatedUserRow.password,
      role: updatedUserRow.role
    };
    return updatedUser;
  }
  
  updateName = async (email: string, name: string): Promise<UserModel> => {
    const result = await pool.query('UPDATE users SET name = $1, updated_at = $2 WHERE email = $3 RETURNING *', [name, new Date(), email]);
    const updatedUserRow = result.rows[0];
    const updatedUser: UserModel = {
      id: updatedUserRow.id,
      name: updatedUserRow.name,
      email: updatedUserRow.email,
      password: updatedUserRow.password,
      role: updatedUserRow.role
    };
    return updatedUser;
  }
  
  deleteUser = async (email: string): Promise<UserModel> => {
    const result = await pool.query('UPDATE users set deleted_at = $1 WHERE email = $2 RETURNING *', [new Date(), email]);
    const deletedUserRow = result.rows[0];
    const deletedUser: UserModel = {
      id: deletedUserRow.id,
      name: deletedUserRow.name,
      email: deletedUserRow.email,
      password: deletedUserRow.password,
      role: deletedUserRow.role
    };
    return deletedUser;
  }

}
