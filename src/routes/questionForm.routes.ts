import { Router } from "express";
import QuestionFormController from "../controllers/questionFormController";

const router = Router()

const questionFormController = new QuestionFormController();
router.post('/send', questionFormController.sendMail);

export default router;
