import { createTransport, SendMailOptions } from 'nodemailer';

import { mailer } from '../config';

const templatesOptions = {
  verify: {
    subject: 'Fakebook email verification',
    html: (url: string) =>
      `<style> h1 { font-size: large; font-weight: 800; } p { font-size: 16px; font-weight: 400; } a { font-size: 16px; color: #1c7ed6; font-size: 14px; font-weight: 700; padding: 12px; text-align: center; cursor: pointer; margin: 12px auto; } p:last-of-type { font-size: 14px; margin-top: 16px; } h2 { font-size: 16px; font-weight: 800; font-style: italic; } hr { background-color: #e8e8e8; width: 100%; } div { display: flex; flex-direction: column; align-items: center; justify-content: center; } </style> <div> <h1>Welcome to Fakebook!</h1> <p> Thank you for signing up. Please verify your email address by clicking the following link: </p> <a <a href="${url}"> Verify your Email</a> <p> Your link is active for 48 hours. After that, you will need to resend the verification email. </p> <p>Thanks</p> <hr /> <p>If you have questions, please don't contact us.</p> <h2>Fakebook Team</h2> </div>`,
  },
  reset: {
    subject: 'Reset fakebook password',
    html: (url: string) =>
      `<style> h1 { font-size: large; font-weight: 800; } p { font-size: 16px; font-weight: 400; } a { font-size: 16px; color: #1c7ed6; font-size: 14px; font-weight: 700; padding: 12px; text-align: center; cursor: pointer; margin: 12px auto; } p:last-of-type { font-size: 14px; margin-top: 16px; } h2 { font-size: 16px; font-weight: 800; font-style: italic; } hr { background-color: #e8e8e8; width: 100%; } div { display: flex; flex-direction: column; align-items: center; justify-content: center; } </style> <div><p> Someone (hopefully you) has requested a password reset for your account. Follow the link below to set a new password:</p> <a href="${url}">Reset password</a> <p>If you did not request a password reset, please ignore this email.</p> <p>Thanks</p> <hr /> <p>If you have questions, please don't contact us.</p> <h2>Fakebook Team</h2> </div>`,
  },
};

export enum EmailTemplate {
  ACCOUNT_VERIFICATION = 'verify',
  PASSWORD_RESET = 'reset',
}

const sendEmail = async (
  template: EmailTemplate,
  recipient: string,
  url: string
) => {
  const transporter = createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: mailer.EMAIL,
      clientId: mailer.ID,
      clientSecret: mailer.SECRET,
      refreshToken: mailer.REFRESH_TOKEN,
    },
  });

  const mailOptions: SendMailOptions = {
    from: mailer.EMAIL,
    to: recipient,
    subject: templatesOptions[template].subject,
    html: templatesOptions[template].html(url),
  };

  const result = await transporter.sendMail(mailOptions);
  return result;
};

export default { sendEmail };
