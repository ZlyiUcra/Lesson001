import nodemailer from "nodemailer";
import {settings} from "../settings";

export const emailAdapter = {
  sendEmail:  (email: string, subject: string, message: string) => {
    let transporter = nodemailer.createTransport({
      service: settings.EMAIL_SERVICE,
      auth: {
        user: settings.EMAIL,
        pass: settings.EMAIL_AUTH,
      }
    });

    let info =  transporter.sendMail({
      from: `Ya 👻"  <no-reply@email.co>`, // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      html: message, // html body
    });
    return info
  }
}