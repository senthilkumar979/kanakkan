export interface Expense {
  id: string;
  amount: number;
  categoryId: string;
  subCategoryId: string;
  moneyModeId: string;
  cardId?: string;
  paymentTypeId: string;
  accountId: string;
  date: Date;
  note?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface CreateExpenseInput {
  amount: number;
  categoryId: string;
  subCategoryId: string;
  moneyModeId: string;
  cardId?: string;
  paymentTypeId: string;
  accountId: string;
  date: string;
  note?: string;
}

export interface UpdateExpenseInput {
  amount?: number;
  categoryId?: string;
  subCategoryId?: string;
  moneyModeId?: string;
  cardId?: string | null;
  paymentTypeId?: string;
  accountId?: string;
  date?: string;
  note?: string | null;
}

