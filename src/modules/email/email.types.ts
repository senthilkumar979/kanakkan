export interface WelcomeEmailData {
  email: string;
  name?: string;
}

export interface MonthlySummaryEmailData {
  email: string;
  name?: string;
  month: string;
  year: number;
  totalIncome: number;
  totalExpense: number;
  netAmount: number;
  topCategories: Array<{
    name: string;
    amount: number;
  }>;
  transactionCount: number;
}

export interface DailyReminderEmailData {
  email: string;
  name?: string;
  todayIncome?: number;
  todayExpense?: number;
  todayTransactionCount?: number;
}

export interface PasswordResetEmailData {
  email: string;
  name?: string;
  resetToken: string;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

