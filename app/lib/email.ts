import nodemailer from 'nodemailer';

export function sendEmail({ emailTo }: { emailTo: string }) {
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
    to: emailTo,
    subject: 'Hello from Nodemailer',
    text: 'This is a test email sent using Nodemailer.',
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email: ', error);
    } else {
      console.log('Email sent: ', info.response);
    }
  });
}
