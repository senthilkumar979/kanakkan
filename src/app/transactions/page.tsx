'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
  TransactionForm,
  type TransactionFormData,
  type TransactionType,
} from '@/ui/organisms/TransactionForm';
import {
  getCategories,
  getSubCategories,
  getMoneyModes,
  getCards,
  getPaymentTypes,
  getBankAccounts,
  createExpense,
  createIncome,
  type Category,
  type SubCategory,
  type MoneyMode,
  type Card,
  type PaymentType,
  type BankAccount,
} from '@/services/transaction.service';
import type { SelectOption } from '@/ui/organisms/TransactionForm';

export default function TransactionsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [transactionType, setTransactionType] =
    useState<TransactionType>('expense');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [moneyModes, setMoneyModes] = useState<MoneyMode[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    const loadOptions = async () => {
      setIsLoadingOptions(true);
      try {
        const [
          categoriesRes,
          moneyModesRes,
          cardsRes,
          paymentTypesRes,
          bankAccountsRes,
        ] = await Promise.all([
          getCategories(),
          getMoneyModes(),
          getCards(),
          getPaymentTypes(),
          getBankAccounts(),
        ]);

        if (categoriesRes.success && categoriesRes.data) {
          setCategories(categoriesRes.data);
        }
        if (moneyModesRes.success && moneyModesRes.data) {
          setMoneyModes(moneyModesRes.data);
        }
        if (cardsRes.success && cardsRes.data) {
          setCards(cardsRes.data);
        }
        if (paymentTypesRes.success && paymentTypesRes.data) {
          setPaymentTypes(paymentTypesRes.data);
        }
        if (bankAccountsRes.success && bankAccountsRes.data) {
          setBankAccounts(bankAccountsRes.data);
        }
      } catch (err) {
        console.error('Failed to load options:', err);
      } finally {
        setIsLoadingOptions(false);
      }
    };

    loadOptions();
  }, []);

  useEffect(() => {
    const loadSubCategories = async () => {
      if (categories.length > 0) {
        const res = await getSubCategories();
        if (res.success && res.data) {
          setSubCategories(res.data);
        }
      }
    };

    loadSubCategories();
  }, [categories]);

  const categoryOptions: SelectOption[] = categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

  const subCategoryOptions: SelectOption[] = subCategories.map((sub) => ({
    value: sub.id,
    label: sub.name,
  }));

  const moneyModeOptions: SelectOption[] = moneyModes.map((mode) => ({
    value: mode.id,
    label: mode.name,
  }));

  const cardOptions: SelectOption[] = cards.map((card) => ({
    value: card.id,
    label: `${card.providerName} ****${card.last4Digits} (${card.cardType})`,
  }));

  const paymentTypeOptions: SelectOption[] = paymentTypes.map((type) => ({
    value: type.id,
    label: type.name,
  }));

  const incomeCategoryOptions: SelectOption[] = categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

  const accountOptions: SelectOption[] = bankAccounts.map((account) => ({
    value: account.id,
    label: `${account.name} - ${account.bankName}${account.accountNumber && account.accountNumber.length >= 4 ? ` (****${account.accountNumber.slice(-4)})` : ''}`,
  }));

  const handleSubmit = async (data: TransactionFormData) => {
    setIsLoading(true);
    setError(undefined);

    try {
      if (transactionType === 'expense') {
        if (
          !data.categoryId ||
          !data.subCategoryId ||
          !data.moneyModeId ||
          !data.paymentTypeId ||
          !data.accountId
        ) {
          setError('Please fill in all required fields');
          setIsLoading(false);
          return;
        }

        const result = await createExpense({
          amount: data.amount,
          categoryId: data.categoryId,
          subCategoryId: data.subCategoryId,
          moneyModeId: data.moneyModeId,
          cardId: data.cardId || undefined,
          paymentTypeId: data.paymentTypeId,
          accountId: data.accountId,
          date: new Date(data.date).toISOString(),
          note: data.note,
        });

        if (!result.success) {
          setError(result.error || 'Failed to create expense');
          setIsLoading(false);
          return;
        }
      } else {
        if (!data.incomeCategoryId || !data.source || !data.accountId) {
          setError('Please fill in all required fields');
          setIsLoading(false);
          return;
        }

        const result = await createIncome({
          amount: data.amount,
          incomeCategoryId: data.incomeCategoryId,
          accountId: data.accountId,
          date: new Date(data.date).toISOString(),
          source: data.source,
        });

        if (!result.success) {
          setError(result.error || 'Failed to create income');
          setIsLoading(false);
          return;
        }
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred'
      );
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-500 border-r-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (isLoadingOptions) {
    return (
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-green-500 border-r-transparent shadow-lg"></div>
            <p className="text-lg font-semibold text-green-700">
              Loading form options...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 rounded-2xl bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 p-8 text-white shadow-2xl">
          <h1 className="text-4xl font-extrabold sm:text-5xl">
            Add Transaction
          </h1>
          <p className="mt-2 text-lg text-green-100">
            Record your income or expense
          </p>
        </div>

        <div className="mb-6 flex gap-2 rounded-xl border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 p-1 shadow-lg">
          <button
            type="button"
            onClick={() => setTransactionType('expense')}
            className={`flex-1 rounded-lg px-4 py-3 text-sm font-bold transition-all ${
              transactionType === 'expense'
                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/50'
                : 'text-gray-600 hover:bg-white/50'
            }`}
          >
            💸 Expense
          </button>
          <button
            type="button"
            onClick={() => setTransactionType('income')}
            className={`flex-1 rounded-lg px-4 py-3 text-sm font-bold transition-all ${
              transactionType === 'income'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/50'
                : 'text-gray-600 hover:bg-white/50'
            }`}
          >
            💰 Income
          </button>
        </div>

        <div className="rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 p-8 shadow-2xl">
          <TransactionForm
            type={transactionType}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
            categoryOptions={categoryOptions}
            subCategoryOptions={subCategoryOptions}
            moneyModeOptions={moneyModeOptions}
            cardOptions={cardOptions}
            paymentTypeOptions={paymentTypeOptions}
            incomeCategoryOptions={incomeCategoryOptions}
            accountOptions={accountOptions}
          />
        </div>
      </div>
    </div>
  );
}
