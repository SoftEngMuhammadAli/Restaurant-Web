import nodemailer from 'nodemailer';
import { config } from '../config/index.js';
import { logger } from './logger.js';

const hasSmtp = Boolean(config.mail.host && config.mail.user && config.mail.pass);

export const sendEmail = async ({ to, subject, html }) => {
  if (!hasSmtp) {
    logger.info('SMTP is not configured. Email skipped.', { to, subject });
    return;
  }

  const transporter = nodemailer.createTransport({
    host: config.mail.host,
    port: config.mail.port,
    secure: config.mail.port === 465,
    auth: { user: config.mail.user, pass: config.mail.pass },
  });

  await transporter.sendMail({ from: config.mail.from, to, subject, html });
};
