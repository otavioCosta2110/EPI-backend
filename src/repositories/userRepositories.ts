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

}
