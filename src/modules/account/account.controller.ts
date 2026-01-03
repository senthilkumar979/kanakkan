import { NextRequest, NextResponse } from 'next/server';
import {
  createBankAccount,
  getBankAccounts,
  getBankAccountById,
  updateBankAccount,
  deleteBankAccount,
} from './account.service';
import { getCurrentUser } from '@/lib/auth';
import type {
  CreateBankAccountInput,
  UpdateBankAccountInput,
} from './account.schema';

export async function createBankAccountController(
  input: CreateBankAccountInput
): Promise<NextResponse> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    const account = await createBankAccount(input, user.userId);

    return NextResponse.json(
      {
        success: true,
        data: account,
      },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to create bank account';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 400 }
    );
  }
}

export async function getBankAccountsController(
  _req: NextRequest
): Promise<NextResponse> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    const accounts = await getBankAccounts(user.userId);

    return NextResponse.json(
      {
        success: true,
        data: accounts,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch bank accounts';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function getBankAccountController(
  _req: NextRequest,
  accountId: string
): Promise<NextResponse> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    const account = await getBankAccountById(accountId, user.userId);

    if (!account) {
      return NextResponse.json(
        {
          success: false,
          error: 'Bank account not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: account,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch bank account';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function updateBankAccountController(
  input: UpdateBankAccountInput,
  accountId: string
): Promise<NextResponse> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    const account = await updateBankAccount(accountId, input, user.userId);

    return NextResponse.json(
      {
        success: true,
        data: account,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to update bank account';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 400 }
    );
  }
}

export async function deleteBankAccountController(
  _req: NextRequest,
  accountId: string
): Promise<NextResponse> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    await deleteBankAccount(accountId, user.userId);

    return NextResponse.json(
      {
        success: true,
        data: {
          message: 'Bank account deleted successfully',
        },
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to delete bank account';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 400 }
    );
  }
}

