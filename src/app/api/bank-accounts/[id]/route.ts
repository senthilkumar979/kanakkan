import { NextRequest } from 'next/server';
import {
  getBankAccountController,
  updateBankAccountController,
  deleteBankAccountController,
} from '@/modules/account/account.controller';
import { updateBankAccountSchema } from '@/modules/account/account.schema';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return getBankAccountController(req, params.id);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const validationResult = updateBankAccountSchema.safeParse(body);

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

    return updateBankAccountController(validationResult.data, params.id);
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
  return deleteBankAccountController(req, params.id);
}

