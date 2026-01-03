import { NextRequest, NextResponse } from 'next/server';
import {
  getDashboardMetrics,
  getTotalSpend,
  getCategoryBreakdown,
  getSubcategoryBreakdown,
  getMoneyModeUsage,
  getCardSpend,
  getIncomeVsExpense,
} from './dashboard.service';
import { getCurrentUser } from '@/lib/auth';
import type { DashboardFilters } from './dashboard.types';

function parseFilters(req: NextRequest): DashboardFilters {
  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get('startDate')
    ? new Date(searchParams.get('startDate')!)
    : undefined;
  const endDate = searchParams.get('endDate')
    ? new Date(searchParams.get('endDate')!)
    : undefined;

  return {
    startDate,
    endDate,
  };
}

export async function getDashboardMetricsController(
  req: NextRequest
): Promise<NextResponse> {
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

    const filters = parseFilters(req);
    const metrics = await getDashboardMetrics(user.userId, filters);

    return NextResponse.json(
      {
        success: true,
        data: metrics,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Failed to fetch dashboard metrics';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function getTotalSpendController(
  req: NextRequest
): Promise<NextResponse> {
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

    const filters = parseFilters(req);
    const totalSpend = await getTotalSpend(user.userId, filters);

    return NextResponse.json(
      {
        success: true,
        data: totalSpend,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch total spend';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function getCategoryBreakdownController(
  req: NextRequest
): Promise<NextResponse> {
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

    const filters = parseFilters(req);
    const breakdown = await getCategoryBreakdown(user.userId, filters);

    return NextResponse.json(
      {
        success: true,
        data: breakdown,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Failed to fetch category breakdown';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function getSubcategoryBreakdownController(
  req: NextRequest
): Promise<NextResponse> {
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

    const filters = parseFilters(req);
    const breakdown = await getSubcategoryBreakdown(user.userId, filters);

    return NextResponse.json(
      {
        success: true,
        data: breakdown,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Failed to fetch subcategory breakdown';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function getMoneyModeUsageController(
  req: NextRequest
): Promise<NextResponse> {
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

    const filters = parseFilters(req);
    const usage = await getMoneyModeUsage(user.userId, filters);

    return NextResponse.json(
      {
        success: true,
        data: usage,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Failed to fetch money mode usage';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function getCardSpendController(
  req: NextRequest
): Promise<NextResponse> {
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

    const filters = parseFilters(req);
    const cardSpend = await getCardSpend(user.userId, filters);

    return NextResponse.json(
      {
        success: true,
        data: cardSpend,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch card spend';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function getIncomeVsExpenseController(
  req: NextRequest
): Promise<NextResponse> {
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

    const filters = parseFilters(req);
    const comparison = await getIncomeVsExpense(user.userId, filters);

    return NextResponse.json(
      {
        success: true,
        data: comparison,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Failed to fetch income vs expense';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

