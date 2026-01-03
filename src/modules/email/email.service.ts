import { Resend } from 'resend';
import {
  getWelcomeEmailTemplate,
  getMonthlySummaryEmailTemplate,
  getDailyReminderEmailTemplate,
  getPasswordResetEmailTemplate,
} from './email.templates';
import type {
  WelcomeEmailData,
  MonthlySummaryEmailData,
  DailyReminderEmailData,
  PasswordResetEmailData,
  EmailResult,
} from './email.types';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
const FROM_NAME = process.env.RESEND_FROM_NAME || 'Kanakkan';

async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<EmailResult> {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured. Email not sent.');
    return {
      success: false,
      error: 'Email service not configured',
    };
  }

  try {
    const result = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to,
      subject,
      html,
    });

    if (result.error) {
      return {
        success: false,
        error: result.error.message || 'Failed to send email',
      };
    }

    return {
      success: true,
      messageId: result.data?.id,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function sendWelcomeEmail(
  data: WelcomeEmailData
): Promise<EmailResult> {
  const html = getWelcomeEmailTemplate(data);
  return sendEmail(data.email, 'Welcome to Kanakkan!', html);
}

export async function sendMonthlySummaryEmail(
  data: MonthlySummaryEmailData
): Promise<EmailResult> {
  const html = getMonthlySummaryEmailTemplate(data);
  const monthName = new Date(
    data.year,
    parseInt(data.month) - 1
  ).toLocaleString('default', { month: 'long' });

  return sendEmail(
    data.email,
    `Your ${monthName} ${data.year} Financial Summary - Kanakkan`,
    html
  );
}

export async function sendDailyReminderEmail(
  data: DailyReminderEmailData
): Promise<EmailResult> {
  const html = getDailyReminderEmailTemplate(data);
  return sendEmail(
    data.email,
    '📊 Daily Reminder: Track Your Finances Today - Kanakkan',
    html
  );
}

export async function sendPasswordResetEmail(
  data: PasswordResetEmailData
): Promise<EmailResult> {
  const html = getPasswordResetEmailTemplate(data);
  return sendEmail(
    data.email,
    '🔑 Reset Your Password - Kanakkan',
    html
  );
}
