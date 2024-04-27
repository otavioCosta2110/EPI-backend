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
       // aq ele coloca como cookie
       res.cookie("jwt", token, {httpOnly: true});
       res.status(200).json({data: token});
     }catch (error: any) {
       res.status(500).json({error: error.message});
     }
   }

   loggedUser = async (req: Request, res: Response) => {
     try {
       // pega o token dos cookies
       const token = req.cookies.jwt;
       console.log(token);
       if (!token) {
         throw new Error("Token not found");
       }
       const decoded = await this.userServices.loggedUser(token);
       res.status(200).json({data: decoded});

     } catch (error: any) {
       console.log(error)
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
 }


