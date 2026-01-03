import { NextRequest, NextResponse } from 'next/server';
import {
  createIncome,
  getIncomes,
  getIncomeById,
  updateIncome,
  deleteIncome,
} from './income.service';
import { getCurrentUser } from '@/lib/auth';
import type { CreateIncomeInput, UpdateIncomeInput } from './income.schema';

export async function createIncomeController(
  input: CreateIncomeInput
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

    const income = await createIncome(input, user.userId);

    return NextResponse.json(
      {
        success: true,
        data: income,
      },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to create income';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 400 }
    );
  }
}

export async function getIncomesController(
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

    const { searchParams } = new URL(req.url);
    const incomeCategoryId =
      searchParams.get('incomeCategoryId') || undefined;
    const startDate = searchParams.get('startDate')
      ? new Date(searchParams.get('startDate')!)
      : undefined;
    const endDate = searchParams.get('endDate')
      ? new Date(searchParams.get('endDate')!)
      : undefined;

    const incomes = await getIncomes(user.userId, {
      incomeCategoryId,
      startDate,
      endDate,
    });

    return NextResponse.json(
      {
        success: true,
        data: incomes,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch incomes';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function getIncomeController(
  _req: NextRequest,
  incomeId: string
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

    const income = await getIncomeById(incomeId, user.userId);

    if (!income) {
      return NextResponse.json(
        {
          success: false,
          error: 'Income not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: income,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch income';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function updateIncomeController(
  input: UpdateIncomeInput,
  incomeId: string
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

    const income = await updateIncome(incomeId, input, user.userId);

    return NextResponse.json(
      {
        success: true,
        data: income,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to update income';

    const statusCode =
      error instanceof Error && error.message.includes('not found') ? 404 : 400;

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: statusCode }
    );
  }
}

export async function deleteIncomeController(
  _req: NextRequest,
  incomeId: string
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

    await deleteIncome(incomeId, user.userId);

    return NextResponse.json(
      {
        success: true,
        data: { message: 'Income deleted successfully' },
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to delete income';

    const statusCode =
      error instanceof Error && error.message.includes('not found') ? 404 : 400;

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: statusCode }
    );
  }
}

