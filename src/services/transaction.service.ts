// Types removed - not currently used in this file

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: unknown;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      // Redirect to login if unauthorized and clear tokens
      if (response.status === 401) {
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          const { clearTokens } = await import('@/utils/storage');
          clearTokens();
          window.location.href = '/login';
        }
      }
      return {
        success: false,
        error: data.error || 'Request failed',
        details: data.details,
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error occurred',
    };
  }
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  userId?: string;
  type?: 'EXPENSE' | 'INCOME';
}

export interface SubCategory {
  id: string;
  name: string;
  categoryId: string;
  userId?: string;
}

export interface MoneyMode {
  id: string;
  name: string;
  icon?: string;
  userId?: string;
}

export interface Card {
  id: string;
  providerName: string;
  last4Digits: string;
  cardType: string;
}

export interface PaymentType {
  id: string;
  name: string;
  userId?: string;
}

export interface BankAccount {
  id: string;
  name: string;
  bankName: string;
  accountNumber?: string;
  ifscCode?: string;
  accountType: 'SAVINGS' | 'CURRENT' | 'FIXED_DEPOSIT' | 'RECURRING_DEPOSIT' | 'OTHER';
}

export interface IncomeCategory {
  id: string;
  name: string;
}

export async function getCategories(): Promise<ApiResponse<Category[]>> {
  return apiRequest<Category[]>('/api/categories');
}

export async function getSubCategories(
  categoryId?: string
): Promise<ApiResponse<SubCategory[]>> {
  const url = categoryId
    ? `/api/subcategories?categoryId=${categoryId}`
    : '/api/subcategories';
  return apiRequest<SubCategory[]>(url);
}

export async function getMoneyModes(): Promise<ApiResponse<MoneyMode[]>> {
  return apiRequest<MoneyMode[]>('/api/money-modes');
}

export async function getCards(): Promise<ApiResponse<Card[]>> {
  return apiRequest<Card[]>('/api/cards');
}

export async function getPaymentTypes(): Promise<ApiResponse<PaymentType[]>> {
  return apiRequest<PaymentType[]>('/api/payment-types');
}

export async function getBankAccounts(): Promise<ApiResponse<BankAccount[]>> {
  return apiRequest<BankAccount[]>('/api/bank-accounts');
}

export async function createExpense(
  input: {
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
): Promise<ApiResponse<unknown>> {
  return apiRequest('/api/expenses', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function createIncome(
  input: {
    amount: number;
    incomeCategoryId: string;
    accountId: string;
    date: string;
    source: string;
  }
): Promise<ApiResponse<unknown>> {
  return apiRequest('/api/incomes', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export interface Expense {
  id: string;
  amount: number;
  categoryId: string;
  subCategoryId: string;
  moneyModeId: string;
  cardId?: string;
  paymentTypeId: string;
  accountId: string;
  date: string;
  note?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface Income {
  id: string;
  amount: number;
  incomeCategoryId: string;
  source: string;
  accountId: string;
  date: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface Transaction {
  id: string;
  type: 'expense' | 'income';
  amount: number;
  date: string;
  category?: string;
  subCategory?: string;
  source?: string;
  note?: string;
  createdAt: string;
  // Additional fields for editing
  categoryId?: string;
  subCategoryId?: string;
  incomeCategoryId?: string;
  moneyModeId?: string;
  cardId?: string;
  paymentTypeId?: string;
  accountId?: string;
  accountName?: string;
}

export async function getExpenses(
  startDate?: string,
  endDate?: string
): Promise<ApiResponse<Expense[]>> {
  let url = '/api/expenses';
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  if (params.toString()) url += `?${params.toString()}`;
  return apiRequest<Expense[]>(url);
}

export async function getIncomes(
  startDate?: string,
  endDate?: string
): Promise<ApiResponse<Income[]>> {
  let url = '/api/incomes';
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  if (params.toString()) url += `?${params.toString()}`;
  return apiRequest<Income[]>(url);
}

export async function updateExpense(
  expenseId: string,
  input: {
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
): Promise<ApiResponse<Expense>> {
  return apiRequest<Expense>(`/api/expenses/${expenseId}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export async function deleteExpense(
  expenseId: string
): Promise<ApiResponse<{ message: string }>> {
  return apiRequest<{ message: string }>(`/api/expenses/${expenseId}`, {
    method: 'DELETE',
  });
}

export async function updateIncome(
  incomeId: string,
  input: {
    amount?: number;
    incomeCategoryId?: string;
    source?: string;
    accountId?: string;
    date?: string;
  }
): Promise<ApiResponse<Income>> {
  return apiRequest<Income>(`/api/incomes/${incomeId}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export async function deleteIncome(
  incomeId: string
): Promise<ApiResponse<{ message: string }>> {
  return apiRequest<{ message: string }>(`/api/incomes/${incomeId}`, {
    method: 'DELETE',
  });
}

