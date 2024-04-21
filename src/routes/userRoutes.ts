import { Router } from 'express';
import UserController from '../controllers/userController';
const router = Router();

const userController = new UserController();
router.get('/', (req, res) => {
  res.send('Hello User');
});

router.get('/getusers', userController.getUsers);
router.post('/create', userController.createUser);
router.post('/login', userController.login);
router.get('/loggeduser', userController.loggedUser);

export default router;
