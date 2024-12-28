import nodemailer from "nodemailer";

export const sendEmail = async (options) => {
    
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
    requireTLS: true
  });

  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions, (error, info) => {
    if(error)
        console.log("Error sending email: ", error);
    else
        console.log("Email sent successfully: ", info.response);
  });
};
