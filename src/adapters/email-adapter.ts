import nodemailer from "nodemailer";
import {settings} from "../settings";

export class EmailAdapter {
  async sendEmail (email: string, subject: string, message: string) {
    let transporter = await nodemailer.createTransport({
      service: settings.EMAIL_SERVICE,
      auth: {
        user: settings.EMAIL,
        pass: settings.EMAIL_AUTH,
      }
    });

    let info = await transporter.sendMail({
      from: `Ya 👻  <no-reply@email.co>`, // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      html: message, // html body
    });
    return info
  }
}
export const emailAdapter = new EmailAdapter()