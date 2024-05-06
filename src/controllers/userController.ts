import { Request, Response } from "express";
import UserServices from "../services/userServices";
import UserRepository from "../repositories/userRepositories";

 export default class UserController {
   userRepositories = new UserRepository();
   userServices = new UserServices(this.userRepositories);

   constructor() {
   }

   getUsers = async (req: Request, res: Response) => {
     try {
       const users = await this.userServices.getUsers();
       res.status(200).json({data: users});
     }catch (error: any) {
       res.status(500).json({error: error.message});
     }
   }
   createUser = async (req: Request, res: Response) => {
     try {
       const user = req.body;
       const createdUser = await this.userServices.create(user);
       res.status(201).json({data: createdUser});
     }catch (error: any) {
       res.status(500).json({error: error.message});
     }
   }

   login = async (req: Request, res: Response) => {
     try {
       const { email, password } = req.body;
       const token = await this.userServices.login(email, password);
       res.cookie("jwt", token, {httpOnly: true});
       res.status(200).json({data: token});
     }catch (error: any) {
       res.status(500).json({error: error.message});
     }
   }

   loggedUser = async (req: Request, res: Response) => {
     try {
       const authHeader = req.headers['authorization'];
       if (!authHeader || !authHeader.startsWith('Bearer ')) {
         throw new Error("Bearer token not found");
       }
       const token = authHeader.split(' ')[1];
       const decoded = await this.userServices.loggedUser(token);
       res.status(200).json({ data: decoded });
     } catch (error: any) {
       throw new Error("Invalid token");
     }
   }
    updatePassword = async (req: Request, res: Response) => {
      try {
        const { email, password } = req.body;
        const updatedUser = await this.userServices.updatePassword(email, password);
        res.status(200).json({data: updatedUser});
      }catch (error: any) {
        res.status(500).json({error: error.message});
      }
    }

    updateName = async (req: Request, res: Response) => {
      try {
        const { email, name, password } = req.body;
        const updatedUser = await this.userServices.updateName(email, name, password);
        res.status(200).json({data: updatedUser});
      }catch (error: any) {
        res.status(500).json({error: error.message});
      }
    }

    deleteUser = async (req: Request, res: Response) => {
      try {
        const { email } = req.body;
        const deletedUser = await this.userServices.deleteUser(email);
        res.status(200).json({data: deletedUser});
      }catch (error: any) {
        res.status(500).json({error: error.message});
      }
    }

    removeTag = async (req: Request, res: Response) => {
      try {
        const { email, tag } = req.body;
        const removedTag = await this.userServices.removeTag(email, tag);
        res.status(200).json({data: removedTag});
      }catch (error: any) {
        res.status(500).json({error: error.message});
      }
    }
 }


