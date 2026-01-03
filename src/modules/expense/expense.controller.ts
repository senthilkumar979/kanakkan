import { NextRequest, NextResponse } from 'next/server';
import {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
} from './expense.service';
import { getCurrentUser } from '@/lib/auth';
import type {
  CreateExpenseInput,
  UpdateExpenseInput,
} from './expense.schema';

export async function createExpenseController(
  input: CreateExpenseInput
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

    const expense = await createExpense(input, user.userId);

    return NextResponse.json(
      {
        success: true,
        data: expense,
      },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to create expense';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 400 }
    );
  }
}

export async function getExpensesController(
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
    const categoryId = searchParams.get('categoryId') || undefined;
    const startDate = searchParams.get('startDate')
      ? new Date(searchParams.get('startDate')!)
      : undefined;
    const endDate = searchParams.get('endDate')
      ? new Date(searchParams.get('endDate')!)
      : undefined;

    const expenses = await getExpenses(user.userId, {
      categoryId,
      startDate,
      endDate,
    });

    return NextResponse.json(
      {
        success: true,
        data: expenses,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch expenses';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function getExpenseController(
  _req: NextRequest,
  expenseId: string
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

    const expense = await getExpenseById(expenseId, user.userId);

    if (!expense) {
      return NextResponse.json(
        {
          success: false,
          error: 'Expense not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: expense,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch expense';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function updateExpenseController(
  input: UpdateExpenseInput,
  expenseId: string
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

    const expense = await updateExpense(expenseId, input, user.userId);

    return NextResponse.json(
      {
        success: true,
        data: expense,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to update expense';

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

export async function deleteExpenseController(
  _req: NextRequest,
  expenseId: string
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

    await deleteExpense(expenseId, user.userId);

    return NextResponse.json(
      {
        success: true,
        data: { message: 'Expense deleted successfully' },
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to delete expense';

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

