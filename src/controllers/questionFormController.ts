import QuestionFormRepository from "../repositories/questionFormRepositories";
import QuestionFormServices from "../services/questionFormServices";

 export default class QuestionFormController {
   questionFormRepository = new QuestionFormRepository();
   questionFormService = new QuestionFormServices(this.questionFormRepository);

   constructor() {
   }

   sendMail = async (req: any, res: any) => {
     try {
       const form = req.body;
       const response = await this.questionFormService.sendMail(form);
       res.status(201).json({data: response});
     }catch (error: any) {
       res.status(500).json({error: error.message});
     }
   }

}


