import { NextRequest } from 'next/server';
import {
  getPaymentTypeController,
  updatePaymentTypeController,
  deletePaymentTypeController,
} from '@/modules/payment/payment.controller';
import { updatePaymentTypeSchema } from '@/modules/payment/payment.schema';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return getPaymentTypeController(req, params.id);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const validationResult = updatePaymentTypeSchema.safeParse(body);

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

    return updatePaymentTypeController(validationResult.data, params.id);
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
  return deletePaymentTypeController(req, params.id);
}

