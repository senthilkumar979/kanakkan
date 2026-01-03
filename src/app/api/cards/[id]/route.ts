import { NextRequest } from 'next/server';
import {
  getCardController,
  updateCardController,
  deleteCardController,
} from '@/modules/payment/payment.controller';
import { updateCardSchema } from '@/modules/payment/payment.schema';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return getCardController(req, params.id);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const validationResult = updateCardSchema.safeParse(body);

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

    return updateCardController(validationResult.data, params.id);
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return deleteCardController(req, params.id);
}

