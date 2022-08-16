import nodemailer from "nodemailer";

export const emailAdapter = {
  sendEmail: (email: string, subject: string, message: string) => {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'oleksandr.gochu@gmail.com',
        pass: 'xhiflhvcalqlyuea'
      }
    });

    let info = transporter.sendMail({
      from: `Ya 👻"  <gochualex@gmail.com>`, // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      html: message, // html body
    });
    return info
  }
}