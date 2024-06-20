import { Router } from 'express';
import UserController from '../controllers/userController';
import multer from 'multer';
import express from 'express';
import path from 'path';
const router = Router();

const userController = new UserController();
router.get('/', (req, res) => {
  res.send('Hello User');
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'user-images/');
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

router.get('/getusers', userController.getUsers);
router.get('/getuserbyemail', userController.getUserByEmail);
router.get('/getuserbyid', userController.getUserById);
router.post('/create', upload.single('image_url'), userController.createUser);
router.post('/login', userController.login);
router.get('/loggeduser', userController.loggedUser);
router.put('/updatepassword', userController.updatePassword);
router.put('/updatename', userController.updateName);
router.delete('/delete', userController.deleteUser);
router.put('/removetag', userController.removeTag);

router.use(
  '/user-images',
  express.static(path.resolve(__dirname, '../user-images'))
);

export default router;
