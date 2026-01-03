import { NextRequest } from 'next/server';
import {
  getIncomeController,
  updateIncomeController,
  deleteIncomeController,
} from '@/modules/income/income.controller';
import { updateIncomeSchema } from '@/modules/income/income.schema';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return getIncomeController(req, params.id);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const validationResult = updateIncomeSchema.safeParse(body);

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

    return updateIncomeController(validationResult.data, params.id);
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
  return deleteIncomeController(req, params.id);
}

