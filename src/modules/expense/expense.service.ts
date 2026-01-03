import connectDB from '@/lib/db';
import { Expense } from './expense.model';
import { Category } from '@/modules/category/category.model';
import { SubCategory } from '@/modules/category/category.model';
import { MoneyMode } from '@/modules/payment/payment.model';
import { PaymentType } from '@/modules/payment/payment.model';
import { Card } from '@/modules/payment/payment.model';
import { BankAccount } from '@/modules/account/account.model';
import type {
  Expense as ExpenseType,
  CreateExpenseInput,
  UpdateExpenseInput,
} from './expense.types';

async function validateExpenseReferences(
  input: CreateExpenseInput | UpdateExpenseInput,
  userId: string
): Promise<void> {
  await connectDB();

  if (input.categoryId) {
    const category = await Category.findOne({
      _id: input.categoryId,
      $or: [{ userId }, { userId: 'SYSTEM' }],
      deletedAt: null,
      type: 'EXPENSE',
    });

    if (!category) {
      throw new Error('Category not found');
    }
  }

  if (input.subCategoryId) {
    const subCategory = await SubCategory.findOne({
      _id: input.subCategoryId,
      $or: [{ userId }, { userId: 'SYSTEM' }],
      deletedAt: null,
    });

    if (!subCategory) {
      throw new Error('Subcategory not found');
    }

    if (input.categoryId && subCategory.categoryId !== input.categoryId) {
      throw new Error('Subcategory does not belong to the specified category');
    }
  }

  if (input.moneyModeId) {
    const moneyMode = await MoneyMode.findOne({
      _id: input.moneyModeId,
      $or: [{ userId }, { userId: 'SYSTEM' }],
      deletedAt: null,
    });

    if (!moneyMode) {
      throw new Error('Money mode not found');
    }
  }

  if (input.paymentTypeId) {
    const paymentType = await PaymentType.findOne({
      _id: input.paymentTypeId,
      $or: [{ userId }, { userId: 'SYSTEM' }],
      deletedAt: null,
    });

    if (!paymentType) {
      throw new Error('Payment type not found');
    }
  }

  if (input.cardId) {
    const card = await Card.findOne({
      _id: input.cardId,
      userId,
      deletedAt: null,
    });

    if (!card) {
      throw new Error('Card not found');
    }
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
}

export async function createExpense(
  input: CreateExpenseInput,
  userId: string
): Promise<ExpenseType> {
  await connectDB();

  await validateExpenseReferences(input, userId);

  const expense = await Expense.create({
    amount: input.amount,
    categoryId: input.categoryId,
    subCategoryId: input.subCategoryId,
    moneyModeId: input.moneyModeId,
    cardId: input.cardId || undefined,
    paymentTypeId: input.paymentTypeId,
    accountId: input.accountId,
    date: new Date(input.date),
    note: input.note || undefined,
    userId,
  });

  return {
    id: expense._id.toString(),
    amount: expense.amount,
    categoryId: expense.categoryId,
    subCategoryId: expense.subCategoryId,
    moneyModeId: expense.moneyModeId,
    cardId: expense.cardId || undefined,
    paymentTypeId: expense.paymentTypeId,
    accountId: expense.accountId,
    date: expense.date,
    note: expense.note || undefined,
    userId: expense.userId,
    createdAt: expense.createdAt,
    updatedAt: expense.updatedAt,
    deletedAt: expense.deletedAt || undefined,
  };
}

export async function getExpenses(
  userId: string,
  filters?: {
    categoryId?: string;
    startDate?: Date;
    endDate?: Date;
  }
): Promise<ExpenseType[]> {
  await connectDB();

  const query: {
    userId: string;
    deletedAt: null;
    categoryId?: string;
    date?: { $gte?: Date; $lte?: Date };
  } = {
    userId,
    deletedAt: null,
  };

  if (filters?.categoryId) {
    query.categoryId = filters.categoryId;
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

  const expenses = await Expense.find(query).sort({ date: -1, createdAt: -1 });

  return expenses.map((expense) => ({
    id: expense._id.toString(),
    amount: expense.amount,
    categoryId: expense.categoryId,
    subCategoryId: expense.subCategoryId,
    moneyModeId: expense.moneyModeId,
    cardId: expense.cardId || undefined,
    paymentTypeId: expense.paymentTypeId,
    accountId: expense.accountId,
    date: expense.date,
    note: expense.note || undefined,
    userId: expense.userId,
    createdAt: expense.createdAt,
    updatedAt: expense.updatedAt,
    deletedAt: expense.deletedAt || undefined,
  }));
}

export async function getExpenseById(
  expenseId: string,
  userId: string
): Promise<ExpenseType | null> {
  await connectDB();

  const expense = await Expense.findOne({
    _id: expenseId,
    userId,
    deletedAt: null,
  });

  if (!expense) {
    return null;
  }

  return {
    id: expense._id.toString(),
    amount: expense.amount,
    categoryId: expense.categoryId,
    subCategoryId: expense.subCategoryId,
    moneyModeId: expense.moneyModeId,
    cardId: expense.cardId || undefined,
    paymentTypeId: expense.paymentTypeId,
    accountId: expense.accountId,
    date: expense.date,
    note: expense.note || undefined,
    userId: expense.userId,
    createdAt: expense.createdAt,
    updatedAt: expense.updatedAt,
    deletedAt: expense.deletedAt || undefined,
  };
}

export async function updateExpense(
  expenseId: string,
  input: UpdateExpenseInput,
  userId: string
): Promise<ExpenseType> {
  await connectDB();

  const expense = await Expense.findOne({
    _id: expenseId,
    userId,
    deletedAt: null,
  });

  if (!expense) {
    throw new Error('Expense not found');
  }

  await validateExpenseReferences(input, userId);

  if (input.amount !== undefined) {
    expense.amount = input.amount;
  }

  if (input.categoryId) {
    expense.categoryId = input.categoryId;
  }

  if (input.subCategoryId) {
    expense.subCategoryId = input.subCategoryId;
  }

  if (input.moneyModeId) {
    expense.moneyModeId = input.moneyModeId;
  }

  if (input.cardId !== undefined) {
    expense.cardId = input.cardId || undefined;
  }

  if (input.paymentTypeId) {
    expense.paymentTypeId = input.paymentTypeId;
  }

  if (input.accountId) {
    expense.accountId = input.accountId;
  }

  if (input.date) {
    expense.date = new Date(input.date);
  }

  if (input.note !== undefined) {
    expense.note = input.note || undefined;
  }

  await expense.save();

  return {
    id: expense._id.toString(),
    amount: expense.amount,
    categoryId: expense.categoryId,
    subCategoryId: expense.subCategoryId,
    moneyModeId: expense.moneyModeId,
    cardId: expense.cardId || undefined,
    paymentTypeId: expense.paymentTypeId,
    accountId: expense.accountId,
    date: expense.date,
    note: expense.note || undefined,
    userId: expense.userId,
    createdAt: expense.createdAt,
    updatedAt: expense.updatedAt,
    deletedAt: expense.deletedAt || undefined,
  };
}

export async function deleteExpense(
  expenseId: string,
  userId: string
): Promise<void> {
  await connectDB();

  const expense = await Expense.findOne({
    _id: expenseId,
    userId,
    deletedAt: null,
  });

  if (!expense) {
    throw new Error('Expense not found');
  }

  expense.deletedAt = new Date();
  await expense.save();
}

