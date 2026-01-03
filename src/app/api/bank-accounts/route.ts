import { NextRequest } from 'next/server';
import {
  createBankAccountController,
  getBankAccountsController,
} from '@/modules/account/account.controller';
import { createBankAccountSchema } from '@/modules/account/account.schema';

export async function GET(req: NextRequest) {
  return getBankAccountsController(req);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validationResult = createBankAccountSchema.safeParse(body);

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

    return createBankAccountController(validationResult.data);
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

