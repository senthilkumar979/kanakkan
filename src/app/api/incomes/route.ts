import { NextRequest } from 'next/server';
import {
  createIncomeController,
  getIncomesController,
} from '@/modules/income/income.controller';
import { createIncomeSchema } from '@/modules/income/income.schema';

export async function GET(req: NextRequest) {
  return getIncomesController(req);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validationResult = createIncomeSchema.safeParse(body);

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

    return createIncomeController(validationResult.data);
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

