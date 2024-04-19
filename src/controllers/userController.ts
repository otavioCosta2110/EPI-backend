import { Request, Response } from "express";
import UserServices from "../services/userServices";

 export default class UserController {
   userServices = new UserServices();

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
 }
