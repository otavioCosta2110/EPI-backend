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
    if (!user.email || !user.password || !user.name || !user.role) {
      throw new Error("Missing fields");
    }
    if(isValidEmail(user.email) === false) {
      throw new Error("Invalid email");
    }
    if(isValidPassword(user.password) === false) {
      throw new Error("Invalid password");
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const userID = uuidv4();
    const newUser = new UserModel(userID, user.name, user.email, hashedPassword, user.role);
    const createdUser = await this.userRepository.createUser(newUser);

    return createdUser;
  }
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPassword(password: string) {
  return /^(?=.*[a-zA-Z0-9])(?=.*[@#$%^&+=])(?=\S+$).{8,}$/.test(password);
}