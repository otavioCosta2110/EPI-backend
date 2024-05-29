import { Router } from 'express';
import UserController from '../controllers/userController';
const router = Router();

const userController = new UserController();
router.get('/', (req, res) => {
  res.send('Hello User');
});

router.get('/getusers', userController.getUsers);
router.get('/getuserbyemail', userController.getUserByEmail);
router.get('/getuserbyid', userController.getUserById);
router.post('/create', userController.createUser);
router.post('/login', userController.login);
router.get('/loggeduser', userController.loggedUser);
router.put('/updatepassword', userController.updatePassword);
router.put('/updatename', userController.updateName);
router.delete('/delete', userController.deleteUser);
router.put('/removetag', userController.removeTag);

export default router;
