import QuestionFormModel from "../models/questionFormModel";
import QuestionFormRepository from "../repositories/questionFormRepositories";

export default class QuestionFormServices {

  questionFormRepository = new QuestionFormRepository()

  constructor(questionFormRepository: QuestionFormRepository) {
    this.questionFormRepository = questionFormRepository;
  }

  sendMail = async (questionForm: QuestionFormModel): Promise<string> => {
    if (!questionForm.userid || !questionForm.message || !questionForm.videoid) {
      throw new Error("Missing fields");
    }
    const response = await this.questionFormRepository.sendMail(questionForm);
    return response;
  }
}

