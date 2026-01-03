import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { isFeatureEnabled } from '@/lib/feature-flags';
import { sendMonthlySummaryEmail } from '@/modules/email/email.service';
import { getDashboardMetrics } from '@/modules/dashboard/dashboard.service';
import type { MonthlySummaryEmailData } from '@/modules/email/email.types';
import type { DashboardFilters } from '@/modules/dashboard/dashboard.types';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    if (!isFeatureEnabled('MONTHLY_SUMMARY_EMAIL')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Monthly summary email feature is disabled',
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { month, year } = body;

    if (!month || !year) {
      return NextResponse.json(
        {
          success: false,
          error: 'Month and year are required',
        },
        { status: 400 }
      );
    }

    const startDate = new Date(year, parseInt(month) - 1, 1);
    const endDate = new Date(year, parseInt(month), 0, 23, 59, 59, 999);

    const filters: DashboardFilters = {
      startDate,
      endDate,
    };

    const metrics = await getDashboardMetrics(user.userId, filters);

    const topCategories = metrics.categoryBreakdown
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)
      .map((cat) => ({
        name: cat.categoryName,
        amount: cat.total,
      }));

    const emailData: MonthlySummaryEmailData = {
      email: user.email,
      month: month.toString(),
      year: parseInt(year),
      totalIncome: metrics.incomeVsExpense.totalIncome,
      totalExpense: metrics.incomeVsExpense.totalExpense,
      netAmount: metrics.incomeVsExpense.netAmount,
      topCategories,
      transactionCount:
        metrics.incomeVsExpense.incomeCount +
        metrics.incomeVsExpense.expenseCount,
    };

    const result = await sendMonthlySummaryEmail(emailData);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to send email',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          message: 'Monthly summary email sent successfully',
          messageId: result.messageId,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Failed to send monthly summary email';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

