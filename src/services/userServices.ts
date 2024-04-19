import UserModel from "../models/userModel";
import bcrypt from "bcrypt";
import UserRepository from "../repositories/userRepositories";
import { v4 as uuidv4 } from 'uuid';

export default class UserServices {

  userRepository = new UserRepository()

  constructor() {
  }

  getUsers = async () => {
    const users = await this.userRepository.getUsers();
    console.log(users)
    return users;
  }
  create = async (user: any) : Promise<UserModel> => {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const userID = uuidv4();
    const newUser = new UserModel(userID, user.name, user.email, hashedPassword, user.role);
    const createdUser = await this.userRepository.createUser(newUser);

    return createdUser;
  }
  
}

