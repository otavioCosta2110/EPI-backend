import { Router } from "express";
import TagController from "../controllers/tagController";

const router = Router()

const tagController = new TagController();
router.get('/gettags', tagController.getTags);
router.post('/create', tagController.createTag);
router.post('/delete', tagController.deleteTag);

export default router;
