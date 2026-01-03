import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import connectDB from '@/lib/db';
import { User } from '@/modules/auth/auth.model';
import { Expense } from '@/modules/expense/expense.model';
import { Income } from '@/modules/income/income.model';
import { sendDailyReminderEmail } from '@/modules/email/email.service';

/**
 * Daily reminder cron job
 * Should be called every day at 9PM CET
 * 
 * To set up with Vercel Cron:
 * Add to vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/daily-reminder",
 *     "schedule": "0 21 * * *"
 *   }]
 * }
 * 
 * Note: Vercel cron uses UTC, so 9PM CET = 8PM UTC (20:00) = "0 20 * * *"
 * But CET is UTC+1 in winter and UTC+2 in summer, so adjust accordingly.
 * For 9PM CET (21:00 CET) = 20:00 UTC in winter or 19:00 UTC in summer
 * 
 * For external cron services, call this endpoint daily at 9PM CET
 */
export async function GET() {
  try {
    // Verify this is a cron request (optional security check)
    const headersList = await headers();
    const authHeader = headersList.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    // Get all users (include name for email personalization)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const users = await (User as any).find({}).select('email _id name');

    if (users.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No users found',
        sent: 0,
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    // Send reminder to each user
    for (const user of users) {
      try {
        const userId = user._id.toString();

        // Get today's transactions
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const todayExpenses = await (Expense as any).find({
          userId,
          date: { $gte: today, $lt: tomorrow },
          deletedAt: null,
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const todayIncomes = await (Income as any).find({
          userId,
          date: { $gte: today, $lt: tomorrow },
          deletedAt: null,
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const todayIncome = todayIncomes.reduce((sum: number, income: any) => sum + income.amount, 0);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const todayExpense = todayExpenses.reduce((sum: number, expense: any) => sum + expense.amount, 0);
        const todayTransactionCount = todayExpenses.length + todayIncomes.length;

        const result = await sendDailyReminderEmail({
          email: user.email,
          name: user.name || undefined,
          todayIncome,
          todayExpense,
          todayTransactionCount,
        });

        if (result.success) {
          successCount++;
        } else {
          errorCount++;
          errors.push(`${user.email}: ${result.error || 'Unknown error'}`);
        }
      } catch (error) {
        errorCount++;
        errors.push(`${user.email}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Daily reminders sent`,
      sent: successCount,
      failed: errorCount,
      total: users.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Error sending daily reminders:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

