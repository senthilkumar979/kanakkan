import { NextRequest, NextResponse } from 'next/server';
import {
  createMoneyMode,
  getMoneyModes,
  getMoneyModeById,
  updateMoneyMode,
  deleteMoneyMode,
  createPaymentType,
  getPaymentTypes,
  getPaymentTypeById,
  updatePaymentType,
  deletePaymentType,
  createCard,
  getCards,
  getCardById,
  updateCard,
  deleteCard,
} from './payment.service';
import { getCurrentUser } from '@/lib/auth';
import type {
  CreateMoneyModeInput,
  UpdateMoneyModeInput,
  CreatePaymentTypeInput,
  UpdatePaymentTypeInput,
  CreateCardInput,
  UpdateCardInput,
} from './payment.schema';

// MoneyMode Controllers
export async function createMoneyModeController(
  input: CreateMoneyModeInput
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

    const moneyMode = await createMoneyMode(input, user.userId);

    return NextResponse.json(
      {
        success: true,
        data: moneyMode,
      },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Failed to create money mode';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 400 }
    );
  }
}

export async function getMoneyModesController(
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

    const moneyModes = await getMoneyModes(user.userId);

    return NextResponse.json(
      {
        success: true,
        data: moneyModes,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch money modes';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function getMoneyModeController(
  _req: NextRequest,
  moneyModeId: string
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

    const moneyMode = await getMoneyModeById(moneyModeId, user.userId);

    if (!moneyMode) {
      return NextResponse.json(
        {
          success: false,
          error: 'Money mode not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: moneyMode,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch money mode';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function updateMoneyModeController(
  input: UpdateMoneyModeInput,
  moneyModeId: string
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

    const moneyMode = await updateMoneyMode(moneyModeId, input, user.userId);

    return NextResponse.json(
      {
        success: true,
        data: moneyMode,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to update money mode';

    const statusCode =
      error instanceof Error && error.message.includes('not found') ? 404 : 400;

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: statusCode }
    );
  }
}

export async function deleteMoneyModeController(
  _req: NextRequest,
  moneyModeId: string
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

    await deleteMoneyMode(moneyModeId, user.userId);

    return NextResponse.json(
      {
        success: true,
        data: { message: 'Money mode deleted successfully' },
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to delete money mode';

    const statusCode =
      error instanceof Error && error.message.includes('not found') ? 404 : 400;

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: statusCode }
    );
  }
}

// PaymentType Controllers
export async function createPaymentTypeController(
  input: CreatePaymentTypeInput
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

    const paymentType = await createPaymentType(input, user.userId);

    return NextResponse.json(
      {
        success: true,
        data: paymentType,
      },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to create payment type';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 400 }
    );
  }
}

export async function getPaymentTypesController(
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

    const paymentTypes = await getPaymentTypes(user.userId);

    return NextResponse.json(
      {
        success: true,
        data: paymentTypes,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch payment types';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function getPaymentTypeController(
  _req: NextRequest,
  paymentTypeId: string
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

    const paymentType = await getPaymentTypeById(paymentTypeId, user.userId);

    if (!paymentType) {
      return NextResponse.json(
        {
          success: false,
          error: 'Payment type not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: paymentType,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch payment type';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function updatePaymentTypeController(
  input: UpdatePaymentTypeInput,
  paymentTypeId: string
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

    const paymentType = await updatePaymentType(
      paymentTypeId,
      input,
      user.userId
    );

    return NextResponse.json(
      {
        success: true,
        data: paymentType,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to update payment type';

    const statusCode =
      error instanceof Error && error.message.includes('not found') ? 404 : 400;

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: statusCode }
    );
  }
}

export async function deletePaymentTypeController(
  _req: NextRequest,
  paymentTypeId: string
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

    await deletePaymentType(paymentTypeId, user.userId);

    return NextResponse.json(
      {
        success: true,
        data: { message: 'Payment type deleted successfully' },
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to delete payment type';

    const statusCode =
      error instanceof Error && error.message.includes('not found') ? 404 : 400;

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: statusCode }
    );
  }
}

// Card Controllers
export async function createCardController(
  input: CreateCardInput
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

    const card = await createCard(input, user.userId);

    return NextResponse.json(
      {
        success: true,
        data: card,
      },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to create card';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 400 }
    );
  }
}

export async function getCardsController(
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

    const cards = await getCards(user.userId);

    return NextResponse.json(
      {
        success: true,
        data: cards,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch cards';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function getCardController(
  _req: NextRequest,
  cardId: string
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

    const card = await getCardById(cardId, user.userId);

    if (!card) {
      return NextResponse.json(
        {
          success: false,
          error: 'Card not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: card,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch card';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function updateCardController(
  input: UpdateCardInput,
  cardId: string
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

    const card = await updateCard(cardId, input, user.userId);

    return NextResponse.json(
      {
        success: true,
        data: card,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to update card';

    const statusCode =
      error instanceof Error && error.message.includes('not found') ? 404 : 400;

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: statusCode }
    );
  }
}

export async function deleteCardController(
  _req: NextRequest,
  cardId: string
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

    await deleteCard(cardId, user.userId);

    return NextResponse.json(
      {
        success: true,
        data: { message: 'Card deleted successfully' },
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to delete card';

    const statusCode =
      error instanceof Error && error.message.includes('not found') ? 404 : 400;

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: statusCode }
    );
  }
}

