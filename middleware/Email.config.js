import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: "bahawallkhann@gmail.com",
    pass: "xisj pjgz sqzs dtor",
  },
});
