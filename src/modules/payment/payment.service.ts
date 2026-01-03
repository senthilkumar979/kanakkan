import connectDB from '@/lib/db';
import { MoneyMode, PaymentType, Card } from './payment.model';
import type {
  MoneyMode as MoneyModeType,
  PaymentType as PaymentTypeType,
  Card as CardType,
  CreateMoneyModeInput,
  UpdateMoneyModeInput,
  CreatePaymentTypeInput,
  UpdatePaymentTypeInput,
  CreateCardInput,
  UpdateCardInput,
} from './payment.types';

// MoneyMode Services
export async function createMoneyMode(
  input: CreateMoneyModeInput,
  userId: string
): Promise<MoneyModeType> {
  await connectDB();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const existingMoneyMode = await (MoneyMode as any).findOne({
    name: input.name,
    userId,
    deletedAt: null,
  });

  if (existingMoneyMode) {
    throw new Error('Money mode with this name already exists');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const moneyMode = await (MoneyMode as any).create({
    name: input.name,
    userId,
  });

  return {
    id: moneyMode._id.toString(),
    name: moneyMode.name,
    userId: moneyMode.userId,
    createdAt: moneyMode.createdAt,
    updatedAt: moneyMode.updatedAt,
    deletedAt: moneyMode.deletedAt || undefined,
  };
}

export async function getMoneyModes(userId: string): Promise<MoneyModeType[]> {
  await connectDB();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const moneyModes = await (MoneyMode as any).find({
    $or: [{ userId }, { userId: 'SYSTEM' }],
    deletedAt: null,
  }).sort({ name: 1 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return moneyModes.map((mode: any) => ({
    id: mode._id.toString(),
    name: mode.name,
    userId: mode.userId,
    createdAt: mode.createdAt,
    updatedAt: mode.updatedAt,
    deletedAt: mode.deletedAt || undefined,
  }));
}

export async function getMoneyModeById(
  moneyModeId: string,
  userId: string
): Promise<MoneyModeType | null> {
  await connectDB();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const moneyMode = await (MoneyMode as any).findOne({
    _id: moneyModeId,
    $or: [{ userId }, { userId: 'SYSTEM' }],
    deletedAt: null,
  });

  if (!moneyMode) {
    return null;
  }

  return {
    id: moneyMode._id.toString(),
    name: moneyMode.name,
    userId: moneyMode.userId,
    createdAt: moneyMode.createdAt,
    updatedAt: moneyMode.updatedAt,
    deletedAt: moneyMode.deletedAt || undefined,
  };
}

export async function updateMoneyMode(
  moneyModeId: string,
  input: UpdateMoneyModeInput,
  userId: string
): Promise<MoneyModeType> {
  await connectDB();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const moneyMode = await (MoneyMode as any).findOne({
    _id: moneyModeId,
    $or: [{ userId }, { userId: 'SYSTEM' }],
    deletedAt: null,
  });

  if (!moneyMode) {
    throw new Error('Money mode not found');
  }

  if (input.name) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const existingMoneyMode = await (MoneyMode as any).findOne({
      name: input.name,
      userId,
      deletedAt: null,
      _id: { $ne: moneyModeId },
    });

    if (existingMoneyMode) {
      throw new Error('Money mode with this name already exists');
    }

    moneyMode.name = input.name;
  }

  await moneyMode.save();

  return {
    id: moneyMode._id.toString(),
    name: moneyMode.name,
    userId: moneyMode.userId,
    createdAt: moneyMode.createdAt,
    updatedAt: moneyMode.updatedAt,
    deletedAt: moneyMode.deletedAt || undefined,
  };
}

export async function deleteMoneyMode(
  moneyModeId: string,
  userId: string
): Promise<void> {
  await connectDB();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const moneyMode = await (MoneyMode as any).findOne({
    _id: moneyModeId,
    $or: [{ userId }, { userId: 'SYSTEM' }],
    deletedAt: null,
  });

  if (!moneyMode) {
    throw new Error('Money mode not found');
  }

  moneyMode.deletedAt = new Date();
  await moneyMode.save();
}

// PaymentType Services
export async function createPaymentType(
  input: CreatePaymentTypeInput,
  userId: string
): Promise<PaymentTypeType> {
  await connectDB();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const existingPaymentType = await (PaymentType as any).findOne({
    name: input.name,
    userId,
    deletedAt: null,
  });

  if (existingPaymentType) {
    throw new Error('Payment type with this name already exists');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const paymentType = await (PaymentType as any).create({
    name: input.name,
    userId,
  });

  return {
    id: paymentType._id.toString(),
    name: paymentType.name,
    userId: paymentType.userId,
    createdAt: paymentType.createdAt,
    updatedAt: paymentType.updatedAt,
    deletedAt: paymentType.deletedAt || undefined,
  };
}

export async function getPaymentTypes(userId: string): Promise<PaymentTypeType[]> {
  await connectDB();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const paymentTypes = await (PaymentType as any).find({
    $or: [{ userId }, { userId: 'SYSTEM' }],
    deletedAt: null,
  }).sort({ name: 1 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return paymentTypes.map((type: any) => ({
    id: type._id.toString(),
    name: type.name,
    userId: type.userId,
    createdAt: type.createdAt,
    updatedAt: type.updatedAt,
    deletedAt: type.deletedAt || undefined,
  }));
}

export async function getPaymentTypeById(
  paymentTypeId: string,
  userId: string
): Promise<PaymentTypeType | null> {
  await connectDB();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const paymentType = await (PaymentType as any).findOne({
    _id: paymentTypeId,
    $or: [{ userId }, { userId: 'SYSTEM' }],
    deletedAt: null,
  });

  if (!paymentType) {
    return null;
  }

  return {
    id: paymentType._id.toString(),
    name: paymentType.name,
    userId: paymentType.userId,
    createdAt: paymentType.createdAt,
    updatedAt: paymentType.updatedAt,
    deletedAt: paymentType.deletedAt || undefined,
  };
}

export async function updatePaymentType(
  paymentTypeId: string,
  input: UpdatePaymentTypeInput,
  userId: string
): Promise<PaymentTypeType> {
  await connectDB();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const paymentType = await (PaymentType as any).findOne({
    _id: paymentTypeId,
    $or: [{ userId }, { userId: 'SYSTEM' }],
    deletedAt: null,
  });

  if (!paymentType) {
    throw new Error('Payment type not found');
  }

  if (input.name) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const existingPaymentType = await (PaymentType as any).findOne({
      name: input.name,
      userId,
      deletedAt: null,
      _id: { $ne: paymentTypeId },
    });

    if (existingPaymentType) {
      throw new Error('Payment type with this name already exists');
    }

    paymentType.name = input.name;
  }

  await paymentType.save();

  return {
    id: paymentType._id.toString(),
    name: paymentType.name,
    userId: paymentType.userId,
    createdAt: paymentType.createdAt,
    updatedAt: paymentType.updatedAt,
    deletedAt: paymentType.deletedAt || undefined,
  };
}

export async function deletePaymentType(
  paymentTypeId: string,
  userId: string
): Promise<void> {
  await connectDB();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const paymentType = await (PaymentType as any).findOne({
    _id: paymentTypeId,
    $or: [{ userId }, { userId: 'SYSTEM' }],
    deletedAt: null,
  });

  if (!paymentType) {
    throw new Error('Payment type not found');
  }

  paymentType.deletedAt = new Date();
  await paymentType.save();
}

// Card Services
export async function createCard(
  input: CreateCardInput,
  userId: string
): Promise<CardType> {
  await connectDB();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const existingCard = await (Card as any).findOne({
    providerName: input.providerName,
    userId,
    deletedAt: null,
  });

  if (existingCard) {
    throw new Error('Card with this provider name already exists');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const card = await (Card as any).create({
    providerName: input.providerName,
    userId,
  });

  return {
    id: card._id.toString(),
    providerName: card.providerName,
    userId: card.userId,
    createdAt: card.createdAt,
    updatedAt: card.updatedAt,
    deletedAt: card.deletedAt || undefined,
  };
}

export async function getCards(userId: string): Promise<CardType[]> {
  await connectDB();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cards = await (Card as any).find({
    userId,
    deletedAt: null,
  }).sort({ providerName: 1 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return cards.map((card: any) => ({
    id: card._id.toString(),
    providerName: card.providerName,
    userId: card.userId,
    createdAt: card.createdAt,
    updatedAt: card.updatedAt,
    deletedAt: card.deletedAt || undefined,
  }));
}

export async function getCardById(
  cardId: string,
  userId: string
): Promise<CardType | null> {
  await connectDB();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const card = await (Card as any).findOne({
    _id: cardId,
    userId,
    deletedAt: null,
  });

  if (!card) {
    return null;
  }

  return {
    id: card._id.toString(),
    providerName: card.providerName,
    userId: card.userId,
    createdAt: card.createdAt,
    updatedAt: card.updatedAt,
    deletedAt: card.deletedAt || undefined,
  };
}

export async function updateCard(
  cardId: string,
  input: UpdateCardInput,
  userId: string
): Promise<CardType> {
  await connectDB();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const card = await (Card as any).findOne({
    _id: cardId,
    userId,
    deletedAt: null,
  });

  if (!card) {
    throw new Error('Card not found');
  }

  if (input.providerName) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const existingCard = await (Card as any).findOne({
      providerName: input.providerName,
      userId,
      deletedAt: null,
      _id: { $ne: cardId },
    });

    if (existingCard) {
      throw new Error('Card with this provider name already exists');
    }

    card.providerName = input.providerName;
  }

  await card.save();

  return {
    id: card._id.toString(),
    providerName: card.providerName,
    userId: card.userId,
    createdAt: card.createdAt,
    updatedAt: card.updatedAt,
    deletedAt: card.deletedAt || undefined,
  };
}

export async function deleteCard(cardId: string, userId: string): Promise<void> {
  await connectDB();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const card = await (Card as any).findOne({
    _id: cardId,
    userId,
    deletedAt: null,
  });

  if (!card) {
    throw new Error('Card not found');
  }

  card.deletedAt = new Date();
  await card.save();
}

