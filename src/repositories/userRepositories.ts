import pool from "../database";
import UserModel from "../models/userModel";

export default class UserRepository {


  constructor() {
  }
  getUsers = (): any => {
    
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
