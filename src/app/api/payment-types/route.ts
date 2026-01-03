import { NextRequest } from 'next/server';
import {
  createPaymentTypeController,
  getPaymentTypesController,
} from '@/modules/payment/payment.controller';
import { createPaymentTypeSchema } from '@/modules/payment/payment.schema';

export async function GET(req: NextRequest) {
  return getPaymentTypesController(req);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validationResult = createPaymentTypeSchema.safeParse(body);

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

    return createPaymentTypeController(validationResult.data);
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

