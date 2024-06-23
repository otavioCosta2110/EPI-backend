import { Request, Response } from 'express';
import UserServices from '../services/userServices';
import UserRepository from '../repositories/userRepositories';
import jwt, { JwtPayload } from 'jsonwebtoken';
import path from 'path';

export default class UserController {
  userRepositories = new UserRepository();
  userServices = new UserServices(this.userRepositories);

  constructor() {}

  getUsers = async (req: Request, res: Response) => {
    try {
      const users = await this.userServices.getUsers();
      res.status(200).json({ data: users });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getUserByEmail = async (req: Request, res: Response) => {
    try {
      const email = req.query.email as string;
      const user = await this.userServices.getUserByEmail(email);
      res.status(200).json({ data: user });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getUserById = async (req: Request, res: Response) => {
    try {
      const id = req.query.id as string;
      const user = await this.userServices.getUserById(id);
      res.status(200).json({ data: user });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getLastLogin = async (req: Request, res: Response) => {
    try {
      const id = req.query.id as string;
      const lastLogin = await this.userServices.getLastLogin(id);
      res.status(200).json({ data: lastLogin });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  createUser = async (req: Request, res: Response) => {
    try {
      const user = req.body;
      user.image_url = req.file ? req.file.path : null;
      const createdUser = await this.userServices.create(user);
      res.status(201).json({ data: createdUser });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const token = await this.userServices.login(email, password);
      res.cookie('jwt', token, { httpOnly: true });
      res.status(200).json({ data: token });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  loggedUser = async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Bearer token not found');
      }
      const token = authHeader.split(' ')[1];
      const decoded = await this.userServices.loggedUser(token);
      res.status(200).json({ data: decoded });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  updatePassword = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const updatedUser = await this.userServices.updatePassword(
        email,
        password
      );
      res.status(200).json({ data: updatedUser });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  updateName = async (req: Request, res: Response) => {
    try {
      const { email, name, password } = req.body;
      const updatedUser = await this.userServices.updateName(
        email,
        name,
        password
      );
      res.status(200).json({ data: updatedUser });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  deleteUser = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const deletedUser = await this.userServices.deleteUser(email);
      res.status(200).json({ data: deletedUser });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  removeTag = async (req: Request, res: Response) => {
    try {
      const { email, tag } = req.body;
      const removedTag = await this.userServices.removeTag(email, tag);
      res.status(200).json({ data: removedTag });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getUserImage = async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Bearer token not found');
      }
      const token = authHeader.split(' ')[1];
      const decoded = await this.userServices.loggedUser(token);

      if (!decoded.email) {
        throw new Error('Email not found in token');
      }

      const user = await this.userServices.getUserByEmail(decoded.email);
      if (!user || !user.image_url) {
        throw new Error('User or user image not found');
      }

      const imagePath = path.resolve(__dirname, '../../', user.image_url);
      res.sendFile(imagePath);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  updateUserImage = async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Bearer token not found');
      }
      const token = authHeader.split(' ')[1];
      const decoded = await this.userServices.loggedUser(token);

      if (!decoded.email) {
        throw new Error('Email not found in token');
      }

      const email = decoded.email;
      const imageUrl = req.file ? req.file.path : null;

      if (!imageUrl) {
        throw new Error('Image file not found');
      }

      const updatedUser = await this.userServices.updateUserImage(
        email,
        imageUrl
      );
      res.status(200).json({ data: updatedUser });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}
