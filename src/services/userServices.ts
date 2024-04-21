import jwt from 'jsonwebtoken';
import UserModel from "../models/userModel";
import bcrypt, { hash } from "bcrypt";
import UserRepository from "../repositories/userRepositories";
import { v4 as uuidv4 } from 'uuid';

export default class UserServices {

  userRepository = new UserRepository()

  constructor() {
  }

  getUsers = async () => {
    const users = await this.userRepository.getUsers();
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

  login = async (email: string, password: string) : Promise<string> => {
    if (!email || !password) {
      throw new Error("Missing fields");
    }
    if(isValidEmail(email) === false) {
      throw new Error("Invalid email");
    }
    if(isValidPassword(password) === false) {
      throw new Error("Invalid password");
    }
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }
    const isValid = await validatePassword(password, user.password);
    if (!isValid) {
      throw new Error("Invalid password");
    }

    // esse jwt eh o json web token, basicamente um token que avisa se o user ta logado ou n,
    // ele expira em 1h (acho legal pq o admin n deveria ficar logado por muito tempo)
    // no controller ele vai setar esse token como um cookie
    const token = jwt.sign({ id: user.id, email: user.email }, 'secret', { expiresIn: '1h' });
    return token;
  }

  // aq ele verifica se o token ta valido
  loggedUser = async (token: string) => {
    try {
      const decoded = jwt.verify(token, 'secret');
      console.log(decoded)
      return decoded;
    } catch (error) {
      console.log(error)
      throw new Error("Invalid token");
    }
  }

}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPassword(password: string) {
  return /^(?=.*[a-zA-Z0-9])(?=.*[@#$%^&+=])(?=\S+$).{8,}$/.test(password);
}

async function validatePassword(password: string, hashedPassword: string): Promise<boolean>{
  const result = await bcrypt.compare(password, hashedPassword)
  return result;
}
