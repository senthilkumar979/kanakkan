import { formatCurrency, formatCurrencyWithSign } from '@/utils/currency';
import type {
  DailyReminderEmailData,
  MonthlySummaryEmailData,
  PasswordResetEmailData,
  WelcomeEmailData,
} from './email.types';

export function getWelcomeEmailTemplate(data: WelcomeEmailData): string {
  const name = data.name || 'there';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Kanakkan</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Kanakkan!</h1>
  </div>
  
  <div style="background: #f9fafb; padding: 40px 20px; border-radius: 0 0 8px 8px;">
    <p style="font-size: 16px; margin-bottom: 20px;">Hi ${name},</p>
    
    <p style="font-size: 16px; margin-bottom: 20px;">
      We're thrilled to have you join Kanakkan! Your personal finance management journey starts now.
    </p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #667eea;">
      <h2 style="margin-top: 0; color: #667eea;">Get Started</h2>
      <ul style="padding-left: 20px;">
        <li style="margin-bottom: 10px;">Track your income and expenses</li>
        <li style="margin-bottom: 10px;">Categorize your transactions</li>
        <li style="margin-bottom: 10px;">View insightful dashboards</li>
        <li style="margin-bottom: 10px;">Monitor your financial health</li>
      </ul>
    </div>
    
    <p style="font-size: 16px; margin-bottom: 20px;">
      If you have any questions or need help getting started, feel free to reach out to our support team.
    </p>
    
    <p style="font-size: 16px; margin-bottom: 0;">
      Happy tracking!<br>
      <strong>The Kanakkan Team</strong>
    </p>
  </div>
  
  <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
    <p>© ${new Date().getFullYear()} Kanakkan. All rights reserved.</p>
  </div>
</body>
</html>
  `.trim();
}

export function getMonthlySummaryEmailTemplate(
  data: MonthlySummaryEmailData
): string {
  const name = data.name || 'there';
  const monthName = new Date(
    data.year,
    parseInt(data.month) - 1
  ).toLocaleString('default', { month: 'long' });
  const isPositive = data.netAmount >= 0;
  const netAmountColor = isPositive ? '#10b981' : '#ef4444';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your ${monthName} Summary - Kanakkan</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Your ${monthName} ${data.year} Summary</h1>
  </div>
  
  <div style="background: #f9fafb; padding: 40px 20px; border-radius: 0 0 8px 8px;">
    <p style="font-size: 16px; margin-bottom: 30px;">Hi ${name},</p>
    
    <p style="font-size: 16px; margin-bottom: 30px;">
      Here's a summary of your financial activity for ${monthName} ${data.year}:
    </p>
    
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 30px;">
      <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; border: 2px solid #10b981;">
        <div style="color: #6b7280; font-size: 14px; margin-bottom: 8px;">Total Income</div>
        <div style="color: #10b981; font-size: 24px; font-weight: bold;">${formatCurrency(data.totalIncome)}</div>
      </div>
      
      <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; border: 2px solid #ef4444;">
        <div style="color: #6b7280; font-size: 14px; margin-bottom: 8px;">Total Expense</div>
        <div style="color: #ef4444; font-size: 24px; font-weight: bold;">${formatCurrency(data.totalExpense)}</div>
      </div>
    </div>
    
    <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 30px; text-align: center; border: 2px solid ${netAmountColor};">
      <div style="color: #6b7280; font-size: 14px; margin-bottom: 8px;">Net Amount</div>
      <div style="color: ${netAmountColor}; font-size: 32px; font-weight: bold;">
        ${formatCurrencyWithSign(data.netAmount)}
      </div>
      <div style="color: #6b7280; font-size: 12px; margin-top: 8px;">
        ${data.transactionCount} transaction${data.transactionCount !== 1 ? 's' : ''}
      </div>
    </div>
    
    ${
      data.topCategories.length > 0
        ? `
    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
      <h2 style="margin-top: 0; color: #667eea; font-size: 18px;">Top Categories</h2>
      <ul style="list-style: none; padding: 0; margin: 0;">
        ${data.topCategories
          .map(
            (cat) => `
          <li style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 16px;">${cat.name}</span>
            <span style="font-weight: bold; color: #667eea;">${formatCurrency(cat.amount)}</span>
          </li>
        `
          )
          .join('')}
      </ul>
    </div>
    `
        : ''
    }
    
    <p style="font-size: 16px; margin-bottom: 0;">
      Keep up the great work tracking your finances!<br>
      <strong>The Kanakkan Team</strong>
    </p>
  </div>
  
  <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
    <p>© ${new Date().getFullYear()} Kanakkan. All rights reserved.</p>
  </div>
</body>
</html>
  `.trim();
}

export function getDailyReminderEmailTemplate(
  data: DailyReminderEmailData
): string {
  const name = data.name || 'there';
  const today = new Date();
  const todayFormatted = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const hasTransactions = (data.todayTransactionCount || 0) > 0;
  const todayIncome = data.todayIncome || 0;
  const todayExpense = data.todayExpense || 0;
  const netAmount = todayIncome - todayExpense;
  const isPositive = netAmount >= 0;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Daily Reminder - Track Your Finances - Kanakkan</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
  <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 50px 30px; text-align: center; position: relative; overflow: hidden;">
      <div style="position: relative; z-index: 1;">
        <div style="font-size: 64px; margin-bottom: 20px;">📊</div>
        <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold; text-shadow: 0 2px 10px rgba(0,0,0,0.2);">Daily Reminder</h1>
        <p style="color: rgba(255,255,255,0.95); margin: 10px 0 0 0; font-size: 16px;">${todayFormatted}</p>
      </div>
    </div>
    
    <div style="background: #f9fafb; padding: 40px 30px;">
      <p style="font-size: 18px; margin-bottom: 25px; color: #1f2937; font-weight: 500;">Hi ${name},</p>
      
      <div style="background: white; border-radius: 12px; padding: 25px; margin-bottom: 25px; border-left: 4px solid #667eea; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <p style="font-size: 16px; margin: 0 0 15px 0; color: #4b5563;">
          ${
            hasTransactions
              ? "Great job tracking your finances today! Here's a quick summary:"
              : "Don't forget to track your expenses and income for today! 📝"
          }
        </p>
      </div>

      ${
        hasTransactions
          ? `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 20px; border-radius: 12px; text-align: center; box-shadow: 0 4px 12px rgba(16,185,129,0.3);">
          <div style="font-size: 32px; margin-bottom: 8px;">💰</div>
          <div style="color: rgba(255,255,255,0.9); font-size: 12px; margin-bottom: 5px; font-weight: 500;">Today's Income</div>
          <div style="color: white; font-size: 22px; font-weight: bold;">${formatCurrency(todayIncome)}</div>
        </div>
        
        <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 20px; border-radius: 12px; text-align: center; box-shadow: 0 4px 12px rgba(239,68,68,0.3);">
          <div style="font-size: 32px; margin-bottom: 8px;">💸</div>
          <div style="color: rgba(255,255,255,0.9); font-size: 12px; margin-bottom: 5px; font-weight: 500;">Today's Expense</div>
          <div style="color: white; font-size: 22px; font-weight: bold;">${formatCurrency(todayExpense)}</div>
        </div>
      </div>
      
      <div style="background: ${isPositive ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'}; padding: 25px; border-radius: 12px; text-align: center; margin-bottom: 25px; box-shadow: 0 4px 12px ${isPositive ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'};">
        <div style="color: rgba(255,255,255,0.9); font-size: 14px; margin-bottom: 8px; font-weight: 500;">Net Amount Today</div>
        <div style="color: white; font-size: 36px; font-weight: bold; margin-bottom: 5px;">
          ${formatCurrencyWithSign(netAmount)}
        </div>
        <div style="color: rgba(255,255,255,0.8); font-size: 12px;">
          ${data.todayTransactionCount} transaction${data.todayTransactionCount !== 1 ? 's' : ''} today
        </div>
      </div>
      `
          : ''
      }

      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 30px; text-align: center; margin-bottom: 25px; box-shadow: 0 4px 12px rgba(102,126,234,0.3);">
        <div style="font-size: 48px; margin-bottom: 15px;">✨</div>
        <h2 style="color: white; margin: 0 0 15px 0; font-size: 24px; font-weight: bold;">Time to Track Your Finances!</h2>
        <p style="color: rgba(255,255,255,0.95); margin: 0 0 20px 0; font-size: 16px;">
          ${
            hasTransactions
              ? 'Keep up the momentum! Add any remaining transactions from today.'
              : 'Log your expenses and income to stay on top of your financial goals.'
          }
        </p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/transactions" style="display: inline-block; background: white; color: #667eea; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
          Add Transaction →
        </a>
      </div>

      <div style="background: white; border-radius: 12px; padding: 25px; margin-bottom: 25px; border: 2px solid #e5e7eb;">
        <h3 style="margin: 0 0 15px 0; color: #667eea; font-size: 18px; font-weight: bold;">💡 Quick Tips</h3>
        <ul style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 14px; line-height: 1.8;">
          <li style="margin-bottom: 8px;">Track expenses as soon as they happen</li>
          <li style="margin-bottom: 8px;">Don't forget to log your income</li>
          <li style="margin-bottom: 8px;">Review your spending patterns regularly</li>
          <li>Set financial goals and track your progress</li>
        </ul>
      </div>
    </div>
    
    <div style="background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
        Stay on top of your finances with daily reminders!
      </p>
      <p style="margin: 0; color: #9ca3af; font-size: 12px;">
        © ${new Date().getFullYear()} Kanakkan. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

export function getPasswordResetEmailTemplate(
  data: PasswordResetEmailData
): string {
  const name = data.name || 'there';
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${data.resetToken}`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password - Kanakkan</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
  <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
    <!-- Header with gradient -->
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 50px 30px; text-align: center; position: relative; overflow: hidden;">
      <div style="position: relative; z-index: 1;">
        <div style="font-size: 64px; margin-bottom: 20px;">🔑</div>
        <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold; text-shadow: 0 2px 10px rgba(0,0,0,0.2);">Reset Your Password</h1>
      </div>
    </div>
    
    <!-- Main Content -->
    <div style="background: #f9fafb; padding: 40px 30px;">
      <p style="font-size: 18px; margin-bottom: 25px; color: #1f2937; font-weight: 500;">Hi ${name},</p>
      
      <div style="background: white; border-radius: 12px; padding: 25px; margin-bottom: 25px; border-left: 4px solid #667eea; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <p style="font-size: 16px; margin: 0 0 15px 0; color: #4b5563;">
          We received a request to reset your password. Click the button below to create a new password:
        </p>
      </div>

      <!-- Call to Action -->
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 30px; text-align: center; margin-bottom: 25px; box-shadow: 0 4px 12px rgba(102,126,234,0.3);">
        <a href="${resetUrl}" style="display: inline-block; background: white; color: #667eea; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
          Reset Password →
        </a>
      </div>

      <!-- Alternative Link -->
      <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 25px; border: 2px solid #e5e7eb;">
        <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px; font-weight: 500;">Or copy and paste this link:</p>
        <p style="margin: 0; color: #667eea; font-size: 12px; word-break: break-all; font-family: monospace;">${resetUrl}</p>
      </div>

      <!-- Security Notice -->
      <div style="background: #fef3c7; border-radius: 12px; padding: 20px; margin-bottom: 25px; border-left: 4px solid #f59e0b;">
        <p style="margin: 0 0 10px 0; color: #92400e; font-size: 14px; font-weight: bold;">⚠️ Security Notice</p>
        <ul style="margin: 0; padding-left: 20px; color: #78350f; font-size: 13px; line-height: 1.6;">
          <li style="margin-bottom: 5px;">This link will expire in 1 hour</li>
          <li style="margin-bottom: 5px;">If you didn't request this, please ignore this email</li>
          <li>Your password will remain unchanged if you don't click the link</li>
        </ul>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
        Need help? Contact our support team.
      </p>
      <p style="margin: 0; color: #9ca3af; font-size: 12px;">
        © ${new Date().getFullYear()} Kanakkan. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
