'use client';

import { useAuth } from '@/hooks/useAuth';
import {
  deleteExpense,
  deleteIncome,
  getBankAccounts,
  getCards,
  getCategories,
  getExpenses,
  getIncomes,
  getMoneyModes,
  getPaymentTypes,
  getSubCategories,
  updateExpense,
  updateIncome,
  type BankAccount,
  type Card,
  type Category,
  type Expense,
  type Income,
  type MoneyMode,
  type PaymentType,
  type SubCategory,
  type Transaction,
} from '@/services/transaction.service';
import { Button } from '@/ui/atoms/Button';
import { ConfirmModal } from '@/ui/molecules/ConfirmModal';
import type { SelectOption } from '@/ui/organisms/TransactionForm';
import {
  TransactionForm,
  type TransactionFormData,
} from '@/ui/organisms/TransactionForm';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

export default function TransactionsListPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [moneyModes, setMoneyModes] = useState<MoneyMode[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] =
    useState<Transaction | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] =
    useState<Transaction | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [
          categoriesRes,
          subCategoriesRes,
          moneyModesRes,
          cardsRes,
          paymentTypesRes,
          bankAccountsRes,
        ] = await Promise.all([
          getCategories(),
          getSubCategories(),
          getMoneyModes(),
          getCards(),
          getPaymentTypes(),
          getBankAccounts(),
        ]);

        if (categoriesRes.success && categoriesRes.data) {
          setCategories(categoriesRes.data);
        }
        if (subCategoriesRes.success && subCategoriesRes.data) {
          setSubCategories(subCategoriesRes.data);
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
      }
    };

    if (isAuthenticated) {
      loadOptions();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const loadTransactions = async () => {
      if (!isAuthenticated) return;

      setIsLoading(true);
      setError(undefined);

      try {
        const startDate = new Date(selectedYear, selectedMonth - 1, 1)
          .toISOString()
          .split('T')[0];
        const endDate = new Date(selectedYear, selectedMonth, 0)
          .toISOString()
          .split('T')[0];

        const [
          expensesRes,
          incomesRes,
          categoriesRes,
          subCategoriesRes,
          bankAccountsRes,
        ] = await Promise.all([
          getExpenses(startDate, endDate),
          getIncomes(startDate, endDate),
          getCategories(),
          getSubCategories(),
          getBankAccounts(),
        ]);

        const loadedCategories =
          categoriesRes.success && categoriesRes.data ? categoriesRes.data : [];
        const loadedSubCategories =
          subCategoriesRes.success && subCategoriesRes.data
            ? subCategoriesRes.data
            : [];
        const loadedBankAccounts =
          bankAccountsRes.success && bankAccountsRes.data
            ? bankAccountsRes.data
            : [];

        const allTransactions: Transaction[] = [];

        if (expensesRes.success && expensesRes.data) {
          expensesRes.data.forEach((expense: Expense) => {
            const category = loadedCategories.find(
              (c) => c.id === expense.categoryId
            );
            const subCategory = loadedSubCategories.find(
              (s) => s.id === expense.subCategoryId
            );
            const account = loadedBankAccounts.find(
              (a) => a.id === expense.accountId
            );
            allTransactions.push({
              id: expense.id,
              type: 'expense',
              amount: expense.amount,
              date: expense.date,
              category: category?.name,
              subCategory: subCategory?.name,
              note: expense.note,
              createdAt: expense.createdAt,
              categoryId: expense.categoryId,
              subCategoryId: expense.subCategoryId,
              moneyModeId: expense.moneyModeId,
              cardId: expense.cardId,
              paymentTypeId: expense.paymentTypeId,
              accountId: expense.accountId,
              accountName: account
                ? `${account.name} - ${account.bankName}`
                : undefined,
            });
          });
        }

        if (incomesRes.success && incomesRes.data) {
          incomesRes.data.forEach((income: Income) => {
            const category = loadedCategories.find(
              (c) => c.id === income.incomeCategoryId
            );
            const account = loadedBankAccounts.find(
              (a) => a.id === income.accountId
            );
            allTransactions.push({
              id: income.id,
              type: 'income',
              amount: income.amount,
              date: income.date,
              category: category?.name,
              source: income.source,
              createdAt: income.createdAt,
              incomeCategoryId: income.incomeCategoryId,
              accountId: income.accountId,
              accountName: account
                ? `${account.name} - ${account.bankName}`
                : undefined,
            });
          });
        }

        allTransactions.sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return dateB - dateA;
        });

        setTransactions(allTransactions);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load transactions'
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, [selectedMonth, selectedYear, isAuthenticated]);

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const yearsList = [];
    for (let i = currentYear; i >= currentYear - 10; i--) {
      yearsList.push(i);
    }
    return yearsList;
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleEditClick = (transaction: Transaction) => {
    setTransactionToEdit(transaction);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!transactionToDelete) return;

    setIsDeleting(true);
    try {
      const result =
        transactionToDelete.type === 'expense'
          ? await deleteExpense(transactionToDelete.id)
          : await deleteIncome(transactionToDelete.id);

      if (!result.success) {
        setError(result.error || 'Failed to delete transaction');
        setIsDeleteModalOpen(false);
        setIsDeleting(false);
        return;
      }

      setIsDeleteModalOpen(false);
      setTransactionToDelete(null);
      // Reload transactions
      const startDate = new Date(selectedYear, selectedMonth - 1, 1)
        .toISOString()
        .split('T')[0];
      const endDate = new Date(selectedYear, selectedMonth, 0)
        .toISOString()
        .split('T')[0];

      const [
        expensesRes,
        incomesRes,
        categoriesRes,
        subCategoriesRes,
        bankAccountsRes,
      ] = await Promise.all([
        getExpenses(startDate, endDate),
        getIncomes(startDate, endDate),
        getCategories(),
        getSubCategories(),
        getBankAccounts(),
      ]);

      const loadedCategories =
        categoriesRes.success && categoriesRes.data ? categoriesRes.data : [];
      const loadedSubCategories =
        subCategoriesRes.success && subCategoriesRes.data
          ? subCategoriesRes.data
          : [];
      const loadedBankAccounts =
        bankAccountsRes.success && bankAccountsRes.data
          ? bankAccountsRes.data
          : bankAccounts;

      const allTransactions: Transaction[] = [];

      if (expensesRes.success && expensesRes.data) {
        expensesRes.data.forEach((expense: Expense) => {
          const category = loadedCategories.find(
            (c) => c.id === expense.categoryId
          );
          const subCategory = loadedSubCategories.find(
            (s) => s.id === expense.subCategoryId
          );
          const account = loadedBankAccounts.find(
            (a) => a.id === expense.accountId
          );
          allTransactions.push({
            id: expense.id,
            type: 'expense',
            amount: expense.amount,
            date: expense.date,
            category: category?.name,
            subCategory: subCategory?.name,
            note: expense.note,
            createdAt: expense.createdAt,
            categoryId: expense.categoryId,
            subCategoryId: expense.subCategoryId,
            moneyModeId: expense.moneyModeId,
            cardId: expense.cardId,
            paymentTypeId: expense.paymentTypeId,
            accountId: expense.accountId,
            accountName: account
              ? `${account.name} - ${account.bankName}`
              : undefined,
          });
        });
      }

      if (incomesRes.success && incomesRes.data) {
        incomesRes.data.forEach((income: Income) => {
          const category = loadedCategories.find(
            (c) => c.id === income.incomeCategoryId
          );
          const account = loadedBankAccounts.find(
            (a) => a.id === income.accountId
          );
          allTransactions.push({
            id: income.id,
            type: 'income',
            amount: income.amount,
            date: income.date,
            category: category?.name,
            source: income.source,
            createdAt: income.createdAt,
            incomeCategoryId: income.incomeCategoryId,
            accountId: income.accountId,
            accountName: account
              ? `${account.name} - ${account.bankName}`
              : undefined,
          });
        });
      }

      allTransactions.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA;
      });

      setTransactions(allTransactions);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to delete transaction'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditSubmit = async (data: TransactionFormData) => {
    if (!transactionToEdit) return;

    setIsUpdating(true);
    setError(undefined);

    try {
      // Convert date to ISO string format if provided
      const dateISO = data.date ? new Date(data.date).toISOString() : undefined;

      // Build update payload, only including fields that have values
      const updatePayload: Record<string, unknown> = {};
      if (data.amount !== undefined && data.amount > 0) {
        updatePayload.amount = data.amount;
      }
      if (data.categoryId && data.categoryId.trim() !== '') {
        updatePayload.categoryId = data.categoryId;
      }
      if (data.subCategoryId && data.subCategoryId.trim() !== '') {
        updatePayload.subCategoryId = data.subCategoryId;
      }
      if (data.moneyModeId && data.moneyModeId.trim() !== '') {
        updatePayload.moneyModeId = data.moneyModeId;
      }
      if (data.cardId !== undefined) {
        updatePayload.cardId =
          data.cardId && data.cardId.trim() !== '' ? data.cardId : null;
      }
      if (data.paymentTypeId && data.paymentTypeId.trim() !== '') {
        updatePayload.paymentTypeId = data.paymentTypeId;
      }
      if (data.accountId && data.accountId.trim() !== '') {
        updatePayload.accountId = data.accountId;
      }
      if (dateISO) {
        updatePayload.date = dateISO;
      }
      if (data.note !== undefined) {
        updatePayload.note =
          data.note && data.note.trim() !== '' ? data.note : null;
      }

      const result =
        transactionToEdit.type === 'expense'
          ? await updateExpense(
              transactionToEdit.id,
              updatePayload as Parameters<typeof updateExpense>[1]
            )
          : await updateIncome(transactionToEdit.id, {
              ...(data.amount !== undefined &&
                data.amount > 0 && { amount: data.amount }),
              ...(data.incomeCategoryId &&
                data.incomeCategoryId.trim() !== '' && {
                  incomeCategoryId: data.incomeCategoryId,
                }),
              ...(data.source &&
                data.source.trim() !== '' && { source: data.source }),
              ...(data.accountId &&
                data.accountId.trim() !== '' && { accountId: data.accountId }),
              ...(dateISO && { date: dateISO }),
            });

      if (!result.success) {
        setError(result.error || 'Failed to update transaction');
        setIsUpdating(false);
        return;
      }

      setIsEditModalOpen(false);
      setTransactionToEdit(null);

      // Reload transactions
      const startDate = new Date(selectedYear, selectedMonth - 1, 1)
        .toISOString()
        .split('T')[0];
      const endDate = new Date(selectedYear, selectedMonth, 0)
        .toISOString()
        .split('T')[0];

      const [
        expensesRes,
        incomesRes,
        categoriesRes,
        subCategoriesRes,
        bankAccountsRes,
      ] = await Promise.all([
        getExpenses(startDate, endDate),
        getIncomes(startDate, endDate),
        getCategories(),
        getSubCategories(),
        getBankAccounts(),
      ]);

      const loadedCategories =
        categoriesRes.success && categoriesRes.data ? categoriesRes.data : [];
      const loadedSubCategories =
        subCategoriesRes.success && subCategoriesRes.data
          ? subCategoriesRes.data
          : [];
      const loadedBankAccounts =
        bankAccountsRes.success && bankAccountsRes.data
          ? bankAccountsRes.data
          : bankAccounts;

      const allTransactions: Transaction[] = [];

      if (expensesRes.success && expensesRes.data) {
        expensesRes.data.forEach((expense: Expense) => {
          const category = loadedCategories.find(
            (c) => c.id === expense.categoryId
          );
          const subCategory = loadedSubCategories.find(
            (s) => s.id === expense.subCategoryId
          );
          const account = loadedBankAccounts.find(
            (a) => a.id === expense.accountId
          );
          allTransactions.push({
            id: expense.id,
            type: 'expense',
            amount: expense.amount,
            date: expense.date,
            category: category?.name,
            subCategory: subCategory?.name,
            note: expense.note,
            createdAt: expense.createdAt,
            categoryId: expense.categoryId,
            subCategoryId: expense.subCategoryId,
            moneyModeId: expense.moneyModeId,
            cardId: expense.cardId,
            paymentTypeId: expense.paymentTypeId,
            accountId: expense.accountId,
            accountName: account
              ? `${account.name} - ${account.bankName}`
              : undefined,
          });
        });
      }

      if (incomesRes.success && incomesRes.data) {
        incomesRes.data.forEach((income: Income) => {
          const category = loadedCategories.find(
            (c) => c.id === income.incomeCategoryId
          );
          const account = loadedBankAccounts.find(
            (a) => a.id === income.accountId
          );
          allTransactions.push({
            id: income.id,
            type: 'income',
            amount: income.amount,
            date: income.date,
            category: category?.name,
            source: income.source,
            createdAt: income.createdAt,
            incomeCategoryId: income.incomeCategoryId,
            accountId: income.accountId,
            accountName: account
              ? `${account.name} - ${account.bankName}`
              : undefined,
          });
        });
      }

      allTransactions.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA;
      });

      setTransactions(allTransactions);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to update transaction'
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const categoryOptions: SelectOption[] = categories
    .filter((c) => c.type === 'EXPENSE')
    .map((cat) => ({
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

  const incomeCategoryOptions: SelectOption[] = categories
    .filter((c) => c.type === 'INCOME')
    .map((cat) => ({
      value: cat.id,
      label: cat.name,
    }));

  const accountOptions: SelectOption[] = bankAccounts.map((account) => ({
    value: account.id,
    label: `${account.name} - ${account.bankName}${account.accountNumber && account.accountNumber.length >= 4 ? ` (****${account.accountNumber.slice(-4)})` : ''}`,
  }));

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

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-around">
        <div className="flex-1"></div>
        <Link href="/transactions">
          <Button
            variant="primary"
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/50 hover:from-green-700 hover:to-emerald-700 hover:shadow-xl"
          >
            ➕ Add Transaction
          </Button>
        </Link>
      </div>
      <div className="mb-8 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 p-8 text-white shadow-2xl">
        <h1 className="text-4xl font-extrabold sm:text-5xl">
          Transactions List
        </h1>
        <p className="mt-2 text-lg text-blue-100">
          View and manage your income and expenses
        </p>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-4 rounded-xl border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 p-4 shadow-lg">
        <div className="flex items-center gap-2">
          <label
            htmlFor="month-select"
            className="text-sm font-semibold text-gray-700"
          >
            Month:
          </label>
          <select
            id="month-select"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="rounded-lg border-2 border-indigo-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-indigo-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {months.map((month, index) => (
              <option key={month} value={index + 1}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label
            htmlFor="year-select"
            className="text-sm font-semibold text-gray-700"
          >
            Year:
          </label>
          <select
            id="year-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="rounded-lg border-2 border-indigo-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-indigo-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border-2 border-red-300 bg-red-50 p-4 text-red-700 shadow-md">
          <p className="font-semibold">Error: {error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="flex min-h-[400px] items-center justify-center rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/30 shadow-2xl">
          <div className="text-center">
            <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-500 border-r-transparent shadow-lg"></div>
            <p className="text-lg font-semibold text-indigo-700">
              Loading transactions...
            </p>
          </div>
        </div>
      ) : transactions.length === 0 ? (
        <div className="rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/30 p-12 shadow-2xl">
          <div className="text-center">
            <p className="text-xl font-semibold text-gray-600">
              No transactions found for {months[selectedMonth - 1]}{' '}
              {selectedYear}
            </p>
            <p className="mt-2 text-gray-500">
              Try selecting a different month or year
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/30 shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                    Account
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-bold uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-100 bg-white">
                {transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="transition-colors hover:bg-indigo-50"
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          transaction.type === 'income'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {transaction.type === 'income'
                          ? '💰 Income'
                          : '💸 Expense'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                      <div>
                        <div className="font-medium">
                          {transaction.category}
                        </div>
                        {transaction.subCategory && (
                          <div className="text-xs text-gray-500">
                            {transaction.subCategory}
                          </div>
                        )}
                        {transaction.source && (
                          <div className="text-xs text-gray-500">
                            {transaction.source}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {transaction.note || '-'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                      {transaction.accountName || '-'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-bold">
                      <span
                        className={
                          transaction.type === 'income'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }
                      >
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditClick(transaction)}
                          className="rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-blue-600 hover:shadow-md"
                          title="Edit transaction"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteClick(transaction)}
                          className="rounded-lg bg-red-400 px-3 py-1.5 text-xs font-semibold text-red-700 shadow-sm transition-all hover:bg-red-600 hover:shadow-md"
                          title="Delete transaction"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gradient-to-r from-indigo-50 to-purple-50">
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-right text-sm font-bold text-gray-700"
                  >
                    Total:
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-bold">
                    <span className="text-indigo-600">
                      {formatCurrency(
                        transactions.reduce((sum, t) => {
                          return (
                            sum + (t.type === 'income' ? t.amount : -t.amount)
                          );
                        }, 0)
                      )}
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {transactionToDelete && (
        <ConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setTransactionToDelete(null);
          }}
          onConfirm={handleDeleteConfirm}
          title="Delete Transaction"
          message={`Are you sure you want to delete this ${transactionToDelete.type} transaction of ${formatCurrency(transactionToDelete.amount)}? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          isLoading={isDeleting}
        />
      )}

      {transactionToEdit && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm ${isEditModalOpen ? '' : 'hidden'}`}
          onClick={() => {
            setIsEditModalOpen(false);
            setTransactionToEdit(null);
          }}
        >
          <div
            className="relative w-full max-w-2xl scale-100 transform overflow-hidden rounded-2xl border-2 border-indigo-300 bg-white opacity-100 shadow-2xl transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-center text-white">
              <h3 className="text-2xl font-bold">
                Edit{' '}
                {transactionToEdit.type === 'income' ? 'Income' : 'Expense'}
              </h3>
            </div>
            <div className="p-6">
              <TransactionForm
                type={transactionToEdit.type}
                onSubmit={handleEditSubmit}
                isLoading={isUpdating}
                error={error}
                defaultValues={{
                  amount: transactionToEdit.amount,
                  date: transactionToEdit.date.split('T')[0],
                  note: transactionToEdit.note,
                  categoryId: transactionToEdit.categoryId,
                  subCategoryId: transactionToEdit.subCategoryId,
                  moneyModeId: transactionToEdit.moneyModeId,
                  cardId: transactionToEdit.cardId,
                  paymentTypeId: transactionToEdit.paymentTypeId,
                  incomeCategoryId: transactionToEdit.incomeCategoryId,
                  source: transactionToEdit.source,
                  accountId: transactionToEdit.accountId,
                }}
                categoryOptions={categoryOptions}
                subCategoryOptions={subCategoryOptions}
                incomeCategoryOptions={incomeCategoryOptions}
                moneyModeOptions={moneyModeOptions}
                paymentTypeOptions={paymentTypeOptions}
                cardOptions={cardOptions}
                accountOptions={accountOptions}
              />
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setTransactionToEdit(null);
                  }}
                  className="rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50"
                  disabled={isUpdating}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
