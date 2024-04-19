const { Router } = require('express');
const UserController = require('../controllers/userController');
const userRouter = Router();

const userController = new UserController();
userRouter.get('/', (req, res) => {
  res.send('Hello User');
});

userRouter.get('/getusers', async (req, res) => {
  const users = await userController.getUsers();
  res.json(users);
});

module.exports = userRouter;
