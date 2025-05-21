import nodemailer from "nodemailer";

export const sendVerificaitionEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const link = `http://localhost:5000/api/verify/${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Email Verification - SimpleAuth",
    html: `<p>Please Click the link below to verify your email:</p><a href="${link}">${link}</a>`,
  };

  await transporter.sendMail(mailOptions);
};
