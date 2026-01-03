import connectDB from '@/lib/db';
import { Income } from './income.model';
import { Category } from '@/modules/category/category.model';
import { BankAccount } from '@/modules/account/account.model';
import type {
  Income as IncomeType,
  CreateIncomeInput,
  UpdateIncomeInput,
} from './income.types';

async function validateIncomeCategory(
  categoryId: string,
  userId: string
): Promise<void> {
  await connectDB();

  const category = await Category.findOne({
    _id: categoryId,
    $or: [{ userId }, { userId: 'SYSTEM' }],
    deletedAt: null,
    type: 'INCOME',
  });

  if (!category) {
    throw new Error('Income category not found');
  }
}

export async function createIncome(
  input: CreateIncomeInput,
  userId: string
): Promise<IncomeType> {
  await connectDB();

  await validateIncomeCategory(input.incomeCategoryId, userId);

  const account = await BankAccount.findOne({
    _id: input.accountId,
    userId,
    deletedAt: null,
  });

  if (!account) {
    throw new Error('Bank account not found');
  }

  const income = await Income.create({
    amount: input.amount,
    incomeCategoryId: input.incomeCategoryId,
    source: input.source,
    accountId: input.accountId,
    date: new Date(input.date),
    userId,
  });

  return {
    id: income._id.toString(),
    amount: income.amount,
    incomeCategoryId: income.incomeCategoryId,
    source: income.source,
    accountId: income.accountId,
    date: income.date,
    userId: income.userId,
    createdAt: income.createdAt,
    updatedAt: income.updatedAt,
    deletedAt: income.deletedAt || undefined,
  };
}

export async function getIncomes(
  userId: string,
  filters?: {
    incomeCategoryId?: string;
    startDate?: Date;
    endDate?: Date;
  }
): Promise<IncomeType[]> {
  await connectDB();

  const query: {
    userId: string;
    deletedAt: null;
    incomeCategoryId?: string;
    date?: { $gte?: Date; $lte?: Date };
  } = {
    userId,
    deletedAt: null,
  };

  if (filters?.incomeCategoryId) {
    query.incomeCategoryId = filters.incomeCategoryId;
  }

  if (filters?.startDate || filters?.endDate) {
    query.date = {};
    if (filters.startDate) {
      query.date.$gte = filters.startDate;
    }
    if (filters.endDate) {
      query.date.$lte = filters.endDate;
    }
  }

  const incomes = await Income.find(query).sort({ date: -1, createdAt: -1 });

  return incomes.map((income) => ({
    id: income._id.toString(),
    amount: income.amount,
    incomeCategoryId: income.incomeCategoryId,
    source: income.source,
    accountId: income.accountId,
    date: income.date,
    userId: income.userId,
    createdAt: income.createdAt,
    updatedAt: income.updatedAt,
    deletedAt: income.deletedAt || undefined,
  }));
}

export async function getIncomeById(
  incomeId: string,
  userId: string
): Promise<IncomeType | null> {
  await connectDB();

  const income = await Income.findOne({
    _id: incomeId,
    userId,
    deletedAt: null,
  });

  if (!income) {
    return null;
  }

  return {
    id: income._id.toString(),
    amount: income.amount,
    incomeCategoryId: income.incomeCategoryId,
    source: income.source,
    accountId: income.accountId,
    date: income.date,
    userId: income.userId,
    createdAt: income.createdAt,
    updatedAt: income.updatedAt,
    deletedAt: income.deletedAt || undefined,
  };
}

export async function updateIncome(
  incomeId: string,
  input: UpdateIncomeInput,
  userId: string
): Promise<IncomeType> {
  await connectDB();

  const income = await Income.findOne({
    _id: incomeId,
    userId,
    deletedAt: null,
  });

  if (!income) {
    throw new Error('Income not found');
  }

  if (input.incomeCategoryId) {
    await validateIncomeCategory(input.incomeCategoryId, userId);
  }

  if (input.accountId) {
    const account = await BankAccount.findOne({
      _id: input.accountId,
      userId,
      deletedAt: null,
    });

    if (!account) {
      throw new Error('Bank account not found');
    }
  }

  if (input.amount !== undefined) {
    income.amount = input.amount;
  }

  if (input.incomeCategoryId) {
    income.incomeCategoryId = input.incomeCategoryId;
  }

  if (input.source) {
    income.source = input.source;
  }

  if (input.accountId) {
    income.accountId = input.accountId;
  }

  if (input.date) {
    income.date = new Date(input.date);
  }

  await income.save();

  return {
    id: income._id.toString(),
    amount: income.amount,
    incomeCategoryId: income.incomeCategoryId,
    source: income.source,
    accountId: income.accountId,
    date: income.date,
    userId: income.userId,
    createdAt: income.createdAt,
    updatedAt: income.updatedAt,
    deletedAt: income.deletedAt || undefined,
  };
}

export async function deleteIncome(
  incomeId: string,
  userId: string
): Promise<void> {
  await connectDB();

  const income = await Income.findOne({
    _id: incomeId,
    userId,
    deletedAt: null,
  });

  if (!income) {
    throw new Error('Income not found');
  }

  income.deletedAt = new Date();
  await income.save();
}

