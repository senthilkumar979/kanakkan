export interface BankAccount {
  id: string;
  name: string;
  bankName: string;
  accountNumber?: string;
  ifscCode?: string;
  accountType: 'SAVINGS' | 'CURRENT' | 'FIXED_DEPOSIT' | 'RECURRING_DEPOSIT' | 'OTHER';
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface CreateBankAccountInput {
  name: string;
  bankName: string;
  accountNumber?: string;
  ifscCode?: string;
  accountType: 'SAVINGS' | 'CURRENT' | 'FIXED_DEPOSIT' | 'RECURRING_DEPOSIT' | 'OTHER';
}

export interface UpdateBankAccountInput {
  name?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  accountType?: 'SAVINGS' | 'CURRENT' | 'FIXED_DEPOSIT' | 'RECURRING_DEPOSIT' | 'OTHER';
}

