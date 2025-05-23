import nodemailer from 'nodemailer';
import {
  groupCreateMail,
  groupCreateMailAdmin,
  groupUpdateMailAdmin,
  userCreateMail,
  groupDeleteMail,
} from '@/app/lib/email-templates';
import { ADMIN_EMAIL_ADDRESS } from '@/app/lib/constants';

const getTransporter = () => {
  return nodemailer.createTransport({
    host: 'host897071.hostido.net.pl',
    port: 465,
    secure: true,
    auth: {
      user: ADMIN_EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export function sendUserCreateEmail({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const transporter = getTransporter();

  const mailOptions = {
    from: ADMIN_EMAIL_ADDRESS,
    to: email,
    subject: 'Rajd Nocny Świętego Emeryka',
    text: userCreateMail({ email, password }),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email: ', error);
    } else {
      console.log('Email sent: ', info.response);
    }
  });
}

export async function sendGroupCreateEmail({
  chefGroupPhoneNumber,
  creationTime,
  email,
  leavingHour,
  members,
  name,
  password,
  pathName,
  pathType,
  shirts,
}: {
  chefGroupPhoneNumber: string;
  creationTime: string;
  email: string;
  leavingHour: string;
  name: string;
  members: { name: string; birthdayDate: string; PTTKCardNumber: string }[];
  password: string;
  pathName: string;
  pathType: string;
  shirts: { shirtType: string; shirtSize: string }[];
}) {
  const transporter = getTransporter();

  const mailOptions = {
    from: ADMIN_EMAIL_ADDRESS,
    to: email,
    subject: 'Rajd Nocny Świętego Emeryka',
    html: groupCreateMail({
      chefGroupPhoneNumber,
      creationTime,
      email,
      leavingHour,
      members,
      name,
      password,
      pathName,
      pathType,
      shirts,
    }),
  };

  return transporter.sendMail(mailOptions);
}

export async function sendGroupCreateEmailToAdmin({
  chefGroupPhoneNumber,
  creationTime,
  email,
  leavingHour,
  members,
  name,
  password,
  pathName,
  pathType,
  shirts,
}: {
  chefGroupPhoneNumber: string;
  creationTime: string;
  email: string;
  leavingHour: string;
  name: string;
  members: { name: string; birthdayDate: string; PTTKCardNumber: string }[];
  password: string;
  pathName: string;
  pathType: string;
  shirts: { shirtType: string; shirtSize: string }[];
}) {
  const transporter = getTransporter();

  const mailOptions = {
    from: ADMIN_EMAIL_ADDRESS,
    to: ADMIN_EMAIL_ADDRESS,
    subject: 'Rajd Nocny Świętego Emeryka',
    html: groupCreateMailAdmin({
      chefGroupPhoneNumber,
      creationTime,
      email,
      leavingHour,
      members,
      name,
      password,
      pathName,
      pathType,
      shirts,
    }),
  };

  return transporter.sendMail(mailOptions);
}

export async function sendGroupUpdateEmailToAdmin({ name }: { name: string }) {
  const transporter = getTransporter();

  const mailOptions = {
    from: ADMIN_EMAIL_ADDRESS,
    to: ADMIN_EMAIL_ADDRESS,
    subject: 'Rajd Nocny Świętego Emeryka',
    text: groupUpdateMailAdmin({ name }),
  };

  return transporter.sendMail(mailOptions);
}

export function sendGroupDeleteEmail({
  email,
  name,
}: {
  email: string;
  name: string;
}) {
  const transporter = getTransporter();

  const mailOptions = {
    from: ADMIN_EMAIL_ADDRESS,
    to: email,
    subject: 'Rajd Nocny Świętego Emeryka',
    text: groupDeleteMail({ name }),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email: ', error);
    } else {
      console.log('Email sent: ', info.response);
    }
  });
}

export function sendGroupDeleteEmailToAdmin({ name }: { name: string }) {
  const transporter = getTransporter();

  const mailOptions = {
    from: ADMIN_EMAIL_ADDRESS,
    to: ADMIN_EMAIL_ADDRESS,
    subject: 'Rajd Nocny Świętego Emeryka',
    text: groupDeleteMail({ name }),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email: ', error);
    } else {
      console.log('Email sent: ', info.response);
    }
  });
}
