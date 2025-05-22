const nodemailer = require('nodemailer');
const OtpModel = require('../models/Otp');

const sendOtpToEmail = async (email) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Verify OTP" <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject: "Verify your Email",
    html: `<h3>Your OTP is: ${otp}</h3>`,
  });

  // Save to DB with 5 minute expiry
  await OtpModel.create({
    email,
    otp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });
};

module.exports = sendOtpToEmail;
