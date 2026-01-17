import nodemailer from 'nodemailer';

if (!process.env.RESEND_API_KEY) {
  throw new Error('env RESEND_API_KEY is missing');
}

export const mailer = nodemailer.createTransport({
  host: 'smtp.resend.com',
  port: 587,
  auth: {
    user: 'resend',
    pass: process.env.RESEND_API_KEY,
  },
});
