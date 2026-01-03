import { NextRequest } from 'next/server';
import {
  createCardController,
  getCardsController,
} from '@/modules/payment/payment.controller';
import { createCardSchema } from '@/modules/payment/payment.schema';

export async function GET(req: NextRequest) {
  return getCardsController(req);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validationResult = createCardSchema.safeParse(body);

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

    return createCardController(validationResult.data);
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

