import { NextRequest } from 'next/server';
import {
  createMoneyModeController,
  getMoneyModesController,
} from '@/modules/payment/payment.controller';
import { createMoneyModeSchema } from '@/modules/payment/payment.schema';

export async function GET(req: NextRequest) {
  return getMoneyModesController(req);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validationResult = createMoneyModeSchema.safeParse(body);

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

    return createMoneyModeController(validationResult.data);
  } catch {
    return Response.json(
      {
        success: false,
        error: 'Invalid request',
      },
      { status: 400 }
    );
  }
}

