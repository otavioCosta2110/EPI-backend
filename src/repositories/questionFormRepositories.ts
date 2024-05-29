const { google } = require('googleapis');
import nodemailer from 'nodemailer';
import QuestionFormModel from "../models/questionFormModel";
import VideoRepository from './videoRepositories';

const OAuth2 = google.auth.OAuth2;

require('dotenv').config();


const oauth2Client = new OAuth2(
  process.env.GOOGLE_API_ID,
  process.env.GOOGLE_API_SECRET,
  process.env.GOOGLE_API_REFRESH_TOKEN,
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_API_REFRESH_TOKEN,
});


export default class QuestionFormRepository {
  constructor() {}
  videoRepository = new VideoRepository();

  sendMail = async (questionForm: QuestionFormModel): Promise<string> => {
    const accessToken = await oauth2Client.getAccessToken();

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: process.env.SENDER_EMAIL,
        clientId: process.env.GOOGLE_API_ID,
        clientSecret: process.env.GOOGLE_API_SECRET,
        refreshToken: process.env.GOOGLE_API_REFRESH_TOKEN,
        accessToken: accessToken.token
      }
    });

    let mailOptions = {
      from: questionForm.useremail,
      to: 'otaviocosta23212@gmail.com',
      subject: `Necessito de suporte no vídeo ${this.videoRepository.getVideoById(questionForm.videoid).title}`,
      text: questionForm.message,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        throw new Error("Erro ao enviar email");
      }
    });
    return "Email enviado com sucesso";
  }
}

