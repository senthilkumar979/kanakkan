export interface Income {
  id: string;
  amount: number;
  incomeCategoryId: string;
  source: string;
  accountId: string;
  date: Date;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface CreateIncomeInput {
  amount: number;
  incomeCategoryId: string;
  source: string;
  accountId: string;
  date: string;
}

export interface UpdateIncomeInput {
  amount?: number;
  incomeCategoryId?: string;
  source?: string;
  accountId?: string;
  date?: string;
}

