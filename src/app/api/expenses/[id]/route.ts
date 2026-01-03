import { NextRequest } from 'next/server';
import {
  getExpenseController,
  updateExpenseController,
  deleteExpenseController,
} from '@/modules/expense/expense.controller';
import { updateExpenseSchema } from '@/modules/expense/expense.schema';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return getExpenseController(req, params.id);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const validationResult = updateExpenseSchema.safeParse(body);

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

    return updateExpenseController(validationResult.data, params.id);
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return deleteExpenseController(req, params.id);
}

