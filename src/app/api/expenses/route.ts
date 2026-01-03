import { NextRequest } from 'next/server';
import {
  createExpenseController,
  getExpensesController,
} from '@/modules/expense/expense.controller';
import { createExpenseSchema } from '@/modules/expense/expense.schema';

export async function GET(req: NextRequest) {
  return getExpensesController(req);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validationResult = createExpenseSchema.safeParse(body);

    if (!validationResult.success) {
      return Response.json(
        {
          success: false,
          error: 'Validation failed',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    return createExpenseController(validationResult.data);
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: 'Invalid request',
      },
      { status: 400 }
    );
  }
}

