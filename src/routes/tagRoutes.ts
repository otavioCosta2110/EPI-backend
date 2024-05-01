import { Router } from "express";
import TagController from "../controllers/tagController";

const router = Router()

const tagController = new TagController();
router.get('/gettags', tagController.getTags);
router.post('/create', tagController.createTag);

export default router;
