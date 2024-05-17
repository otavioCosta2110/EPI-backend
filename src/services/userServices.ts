import jwt from 'jsonwebtoken';
import UserModel from "../models/userModel";
import bcrypt from "bcrypt";
import UserRepository from "../repositories/userRepositories";
import { v4 as uuidv4 } from 'uuid';
import TagRepository from '../repositories/tagRepositories';

export default class UserServices {

  userRepository = new UserRepository()

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  getUsers = async () => {
    const users = await this.userRepository.getUsers();
    return users;
  }

  getUserByEmail = async (email: string) => {
    const user = await this.userRepository.getUserByEmail(email);
    return user;
  }

  getUserById = async (id: string) => {
    const user = await this.userRepository.getUserById(id);
    return user;
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

    const tags: string[] = user.tags;

    const tagRepository = new TagRepository()
    
    console.log(tags)
    if(tags){
      for(let i = 0; i < tags.length; i++) {
        const tagExists = await tagRepository.getTagByName(tags[i])   
        if (!tagExists) {
          throw new Error("Tag not found");
        }
      }
    }

    const userExists = await this.userRepository.getUserByEmail(user.email);
    if (userExists) {
      throw new Error("User already exists");
    }
    const hashedPassword = await bcrypt.hash(user.password, 9);
    const userID = uuidv4();
    const newUser = new UserModel(userID, user.name, user.email, hashedPassword, user.role, tags);
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
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, 'secret', { expiresIn: '1h' });
    return token;
  }

  // aq ele verifica se o token ta valido
  loggedUser = async (token: string) => {
    try {
      const decoded = jwt.verify(token, 'secret');
      return decoded;
    } catch (error) {
      throw new Error("Invalid token");
    }
  }

  updatePassword = async (email: string, password: string) =>{
    if (!email || !password) {
      throw new Error("Missing fields");
    }
    if(isValidEmail(email) === false) {
      throw new Error("Invalid email");
    }
    if(isValidPassword(password) === false) {
      throw new Error("Invalid password");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await this.userRepository.updatePassword(email, hashedPassword);
    return updatedUser;
  }

  updateName = async (email: string, name: string, password: string) =>{
    if (!email || !name || !password) {
      throw new Error("Missing fields");
    }
    if(isValidEmail(email) === false) {
      throw new Error("Invalid email");
    }
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }
    const isValid = await validatePassword(password, user.password);
    if (!isValid) {
      throw new Error("Invalid password");
    }
    const updatedUser = await this.userRepository.updateName(email, name);
    return updatedUser;
    
  }

  deleteUser = async (email: string) =>{
    if (!email) {
      throw new Error("Missing fields");
    }
    if(isValidEmail(email) === false) {
      throw new Error("Invalid email");
    }
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }
    const deletedUser = await this.userRepository.deleteUser(email);
    return deletedUser;
  }

  removeTag = async (email: string, tag: string) =>{
    if (!email || !tag) {
      throw new Error("Missing fields");
    }
    if(isValidEmail(email) === false) {
      throw new Error("Invalid email");
    }
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }
    const tagRepository = new TagRepository()
    const tagExists = await tagRepository.getTagByName(tag)   
    if (!tagExists) {
      throw new Error("Tag not found");
    }
    const removedTag = await this.userRepository.removeTag(email, tag);
    return removedTag;
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



