
const UserRepository = require('../repositories/userRepositories');
const UserServices = require('../services/userServices');

 class UserController {
   constructor() {
     this.userRepository = new UserRepository();
     this.userServices = new UserServices(this.userRepository);
   }
   async getUsers() {
     return this.userServices.getUsers();
   }
 }
module.exports = UserController;
