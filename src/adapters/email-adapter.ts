import nodemailer from "nodemailer";

export const emailAdapter = {
  sendEmail: async (email: string, subject: string, message: string) => {
    let transporter = await nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'oleksandr.gochu@gmail.com',
        pass: 'xhiflhvcalqlyuea'
      }
    });

    let info = await transporter.sendMail({
      from: `Ya 👻"  <no-reply@email.co>`, // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      text: message, // html body
    });
    return info
  }
}