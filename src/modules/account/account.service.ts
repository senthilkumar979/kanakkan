import connectDB from '@/lib/db';
import { BankAccount } from './account.model';
import type {
  BankAccount as BankAccountType,
  CreateBankAccountInput,
  UpdateBankAccountInput,
} from './account.types';

export async function createBankAccount(
  input: CreateBankAccountInput,
  userId: string
): Promise<BankAccountType> {
  await connectDB();

  const existingAccount = await BankAccount.findOne({
    name: input.name,
    userId,
    deletedAt: null,
  });

  if (existingAccount) {
    throw new Error('Bank account with this name already exists');
  }

  const account = await BankAccount.create({
    ...input,
    userId,
  });

  return {
    id: account._id.toString(),
    name: account.name,
    bankName: account.bankName,
    accountNumber: account.accountNumber || undefined,
    ifscCode: account.ifscCode || undefined,
    accountType: account.accountType,
    userId: account.userId,
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
    deletedAt: account.deletedAt || undefined,
  };
}

export async function getBankAccounts(userId: string): Promise<BankAccountType[]> {
  await connectDB();

  const accounts = await BankAccount.find({
    userId,
    deletedAt: null,
  }).sort({ name: 1 });

  return accounts.map((account) => ({
    id: account._id.toString(),
    name: account.name,
    bankName: account.bankName,
    accountNumber: account.accountNumber || undefined,
    ifscCode: account.ifscCode || undefined,
    accountType: account.accountType,
    userId: account.userId,
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
    deletedAt: account.deletedAt || undefined,
  }));
}

export async function getBankAccountById(
  accountId: string,
  userId: string
): Promise<BankAccountType | null> {
  await connectDB();

  const account = await BankAccount.findOne({
    _id: accountId,
    userId,
    deletedAt: null,
  });

  if (!account) {
    return null;
  }

  return {
    id: account._id.toString(),
    name: account.name,
    bankName: account.bankName,
    accountNumber: account.accountNumber || undefined,
    ifscCode: account.ifscCode || undefined,
    accountType: account.accountType,
    userId: account.userId,
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
    deletedAt: account.deletedAt || undefined,
  };
}

export async function updateBankAccount(
  accountId: string,
  input: UpdateBankAccountInput,
  userId: string
): Promise<BankAccountType> {
  await connectDB();

  const account = await BankAccount.findOne({
    _id: accountId,
    userId,
    deletedAt: null,
  });

  if (!account) {
    throw new Error('Bank account not found');
  }

  if (input.name || input.bankName || input.accountType) {
    const existingAccount = await BankAccount.findOne({
      name: input.name || account.name,
      userId,
      deletedAt: null,
      _id: { $ne: accountId },
    });

    if (existingAccount) {
      throw new Error('Bank account with this name already exists');
    }
  }

  if (input.name) {
    account.name = input.name;
  }
  if (input.bankName) {
    account.bankName = input.bankName;
  }
  if (input.accountNumber !== undefined) {
    account.accountNumber = input.accountNumber || null;
  }
  if (input.ifscCode !== undefined) {
    account.ifscCode = input.ifscCode || null;
  }
  if (input.accountType) {
    account.accountType = input.accountType;
  }

  await account.save();

  return {
    id: account._id.toString(),
    name: account.name,
    bankName: account.bankName,
    accountNumber: account.accountNumber || undefined,
    ifscCode: account.ifscCode || undefined,
    accountType: account.accountType,
    userId: account.userId,
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
    deletedAt: account.deletedAt || undefined,
  };
}

export async function deleteBankAccount(accountId: string, userId: string): Promise<void> {
  await connectDB();

  const account = await BankAccount.findOne({
    _id: accountId,
    userId,
    deletedAt: null,
  });

  if (!account) {
    throw new Error('Bank account not found');
  }

  account.deletedAt = new Date();
  await account.save();
}

