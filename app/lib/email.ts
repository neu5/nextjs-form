import nodemailer from 'nodemailer';
import { createGroupMail, createUserMail } from '@/app/lib/email-templates';

export function sendCreateUserEmail({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const transporter = nodemailer.createTransport({
    service: 'Cpanel',
    host: 'mail.emeryk.pttk.pl',
    port: 465,
    secure: true,
    auth: {
      user: 'kontakt@emeryk.pttk.pl',
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: 'kontakt@emeryk.pttk.pl',
    to: email,
    subject: 'Rajd Nocny Świętego Emeryka',
    text: createUserMail({ email, password }),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email: ', error);
    } else {
      console.log('Email sent: ', info.response);
    }
  });
}

export function sendCreateGroupEmail({
  email,
  name,
  password,
}: {
  email: string;
  name: string;
  password: string;
}) {
  const transporter = nodemailer.createTransport({
    service: 'Cpanel',
    host: 'mail.emeryk.pttk.pl',
    port: 465,
    secure: true,
    auth: {
      user: 'kontakt@emeryk.pttk.pl',
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: 'kontakt@emeryk.pttk.pl',
    to: 'neus90@gmail.com',
    subject: 'Rajd Nocny Świętego Emeryka',
    text: createGroupMail({ email, name, password }),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email: ', error);
    } else {
      console.log('Email sent: ', info.response);
    }
  });
}
