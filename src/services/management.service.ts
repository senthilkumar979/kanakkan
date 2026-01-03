import type { Category, SubCategory, MoneyMode, PaymentType, BankAccount } from './transaction.service';

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

// Categories
export async function createCategory(input: { name: string; type: 'EXPENSE' | 'INCOME' }): Promise<ApiResponse<Category>> {
  return apiRequest<Category>('/api/categories', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function updateCategory(id: string, input: { name: string; type: 'EXPENSE' | 'INCOME' }): Promise<ApiResponse<Category>> {
  return apiRequest<Category>(`/api/categories/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export async function deleteCategory(id: string): Promise<ApiResponse<{ message: string }>> {
  return apiRequest<{ message: string }>(`/api/categories/${id}`, {
    method: 'DELETE',
  });
}

// Subcategories
export async function createSubCategory(input: { name: string; categoryId: string }): Promise<ApiResponse<SubCategory>> {
  return apiRequest<SubCategory>('/api/subcategories', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function updateSubCategory(id: string, input: { name: string; categoryId: string }): Promise<ApiResponse<SubCategory>> {
  return apiRequest<SubCategory>(`/api/subcategories/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export async function deleteSubCategory(id: string): Promise<ApiResponse<{ message: string }>> {
  return apiRequest<{ message: string }>(`/api/subcategories/${id}`, {
    method: 'DELETE',
  });
}

// Money Modes
export async function createMoneyMode(input: { name: string }): Promise<ApiResponse<MoneyMode>> {
  return apiRequest<MoneyMode>('/api/money-modes', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function updateMoneyMode(id: string, input: { name: string }): Promise<ApiResponse<MoneyMode>> {
  return apiRequest<MoneyMode>(`/api/money-modes/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export async function deleteMoneyMode(id: string): Promise<ApiResponse<{ message: string }>> {
  return apiRequest<{ message: string }>(`/api/money-modes/${id}`, {
    method: 'DELETE',
  });
}

// Payment Types
export async function createPaymentType(input: { name: string }): Promise<ApiResponse<PaymentType>> {
  return apiRequest<PaymentType>('/api/payment-types', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function updatePaymentType(id: string, input: { name: string }): Promise<ApiResponse<PaymentType>> {
  return apiRequest<PaymentType>(`/api/payment-types/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export async function deletePaymentType(id: string): Promise<ApiResponse<{ message: string }>> {
  return apiRequest<{ message: string }>(`/api/payment-types/${id}`, {
    method: 'DELETE',
  });
}

// Bank Accounts
export async function createBankAccount(input: {
  name: string;
  bankName: string;
  accountNumber?: string;
  ifscCode?: string;
  accountType: 'SAVINGS' | 'CURRENT' | 'FIXED_DEPOSIT' | 'RECURRING_DEPOSIT' | 'OTHER';
}): Promise<ApiResponse<BankAccount>> {
  return apiRequest<BankAccount>('/api/bank-accounts', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function updateBankAccount(
  id: string,
  input: {
    name?: string;
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
    accountType?: 'SAVINGS' | 'CURRENT' | 'FIXED_DEPOSIT' | 'RECURRING_DEPOSIT' | 'OTHER';
  }
): Promise<ApiResponse<BankAccount>> {
  return apiRequest<BankAccount>(`/api/bank-accounts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  });
}

export async function deleteBankAccount(id: string): Promise<ApiResponse<{ message: string }>> {
  return apiRequest<{ message: string }>(`/api/bank-accounts/${id}`, {
    method: 'DELETE',
  });
}

