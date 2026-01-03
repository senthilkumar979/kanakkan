import type {
  CategoryBreakdown,
  MoneyModeUsage,
  CardSpend,
} from '@/modules/dashboard/dashboard.types';

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

