import connectDB from '@/lib/db';
import { Expense } from '@/modules/expense/expense.model';
import { Income } from '@/modules/income/income.model';
import { Category } from '@/modules/category/category.model';
import { SubCategory } from '@/modules/category/category.model';
import { MoneyMode } from '@/modules/payment/payment.model';
import { Card } from '@/modules/payment/payment.model';
import type {
  DashboardFilters,
  TotalSpend,
  CategoryBreakdown,
  SubcategoryBreakdown,
  MoneyModeUsage,
  CardSpend,
  IncomeVsExpense,
  IncomeVsExpenseByDate,
  DashboardMetrics,
} from './dashboard.types';

function buildDateFilter(filters: DashboardFilters) {
  const dateFilter: { date?: { $gte?: Date; $lte?: Date } } = {};

  if (filters.startDate || filters.endDate) {
    dateFilter.date = {};
    if (filters.startDate) {
      dateFilter.date.$gte = filters.startDate;
    }
    if (filters.endDate) {
      dateFilter.date.$lte = filters.endDate;
    }
  }

  return dateFilter;
}

export async function getTotalSpend(
  userId: string,
  filters: DashboardFilters
): Promise<TotalSpend> {
  await connectDB();

  const matchFilter = {
    userId,
    deletedAt: null,
    ...buildDateFilter(filters),
  };

  const result = await Expense.aggregate([
    { $match: matchFilter },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
  ]);

  if (result.length === 0) {
    return { total: 0, count: 0 };
  }

  return {
    total: result[0].total,
    count: result[0].count,
  };
}

export async function getCategoryBreakdown(
  userId: string,
  filters: DashboardFilters
): Promise<CategoryBreakdown[]> {
  await connectDB();

  const matchFilter = {
    userId,
    deletedAt: null,
    ...buildDateFilter(filters),
  };

  const expenses = await Expense.aggregate([
    { $match: matchFilter },
    {
      $group: {
        _id: '$categoryId',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
  ]);

  if (expenses.length === 0) {
    return [];
  }

  const categoryIds = expenses.map((e) => e._id);
  const [userCategories, systemCategories] = await Promise.all([
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (Category as any).find({
      _id: { $in: categoryIds },
      userId,
      deletedAt: null,
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (Category as any).find({
      _id: { $in: categoryIds },
      userId: 'SYSTEM',
      deletedAt: null,
    }),
  ]);
  const categories = [...userCategories, ...systemCategories];

  const categoryMap = new Map(
    categories.map((cat) => [cat._id.toString(), cat.name])
  );

  return expenses
    .map((expense) => {
      const categoryId = String(expense._id);
      return {
        categoryId: categoryId,
        categoryName: categoryMap.get(categoryId) || 'Unknown',
        total: expense.total,
        count: expense.count,
      };
    })
    .sort((a, b) => b.total - a.total);
}

export async function getSubcategoryBreakdown(
  userId: string,
  filters: DashboardFilters
): Promise<SubcategoryBreakdown[]> {
  await connectDB();

  const matchFilter = {
    userId,
    deletedAt: null,
    ...buildDateFilter(filters),
  };

  const expenses = await Expense.aggregate([
    { $match: matchFilter },
    {
      $group: {
        _id: {
          subcategoryId: '$subCategoryId',
          categoryId: '$categoryId',
        },
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
  ]);

  if (expenses.length === 0) {
    return [];
  }

  const subcategoryIds = expenses.map((e) => e._id.subcategoryId);
  const categoryIds = expenses.map((e) => e._id.categoryId);

  const [subcategories, categories] = await Promise.all([
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (SubCategory as any).find({
      _id: { $in: subcategoryIds },
      $or: [{ userId }, { userId: 'SYSTEM' }],
      deletedAt: null,
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (Category as any).find({
      _id: { $in: [...new Set(categoryIds)] },
      $or: [{ userId }, { userId: 'SYSTEM' }],
      deletedAt: null,
    }),
  ]);

  const subcategoryMap = new Map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    subcategories.map((sub: any) => [sub._id.toString(), sub.name])
  );
  const categoryMap = new Map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    categories.map((cat: any) => [cat._id.toString(), cat.name])
  );

  return (
    expenses
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((expense: any) => {
        const subcategoryId =
          expense._id.subcategoryId?.toString() || expense._id.subcategoryId;
        const categoryId =
          expense._id.categoryId?.toString() || expense._id.categoryId;
        return {
          subcategoryId: String(subcategoryId),
          subcategoryName: String(
            subcategoryMap.get(String(subcategoryId)) || 'Unknown'
          ),
          categoryId: String(categoryId),
          categoryName: String(
            categoryMap.get(String(categoryId)) || 'Unknown'
          ),
          total: Number(expense.total),
          count: Number(expense.count),
        };
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .sort((a: any, b: any) => b.total - a.total)
  );
}

export async function getMoneyModeUsage(
  userId: string,
  filters: DashboardFilters
): Promise<MoneyModeUsage[]> {
  await connectDB();

  const matchFilter = {
    userId,
    deletedAt: null,
    ...buildDateFilter(filters),
  };

  const expenses = await Expense.aggregate([
    { $match: matchFilter },
    {
      $group: {
        _id: '$moneyModeId',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: null,
        totalSpend: { $sum: '$total' },
        modes: { $push: '$$ROOT' },
      },
    },
  ]);

  if (expenses.length === 0 || expenses[0].modes.length === 0) {
    return [];
  }

  const totalSpend = expenses[0].totalSpend;
  const moneyModeIds = expenses[0].modes.map((m: { _id: string }) => m._id);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const moneyModes = await (MoneyMode as any).find({
    _id: { $in: moneyModeIds },
    $or: [{ userId }, { userId: 'SYSTEM' }],
    deletedAt: null,
  });

  const moneyModeMap = new Map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    moneyModes.map((mode: any) => [mode._id.toString(), mode.name])
  );

  return (
    expenses[0].modes
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((mode: any) => ({
        moneyModeId: String(mode._id),
        moneyModeName: String(moneyModeMap.get(String(mode._id)) || 'Unknown'),
        total: Number(mode.total),
        count: Number(mode.count),
        percentage:
          totalSpend > 0 ? (Number(mode.total) / totalSpend) * 100 : 0,
      }))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .sort((a: any, b: any) => b.total - a.total)
  );
}

export async function getCardSpend(
  userId: string,
  filters: DashboardFilters
): Promise<CardSpend[]> {
  await connectDB();

  const matchFilter = {
    userId,
    deletedAt: null,
    cardId: { $ne: null },
    ...buildDateFilter(filters),
  };

  const expenses = await Expense.aggregate([
    { $match: matchFilter },
    {
      $group: {
        _id: '$cardId',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: null,
        totalSpend: { $sum: '$total' },
        cards: { $push: '$$ROOT' },
      },
    },
  ]);

  if (expenses.length === 0 || expenses[0].cards.length === 0) {
    return [];
  }

  const totalSpend = expenses[0].totalSpend;
  const cardIds = expenses[0].cards.map((c: { _id: string }) => c._id);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cards = await (Card as any).find({
    _id: { $in: cardIds },
    userId,
    deletedAt: null,
  });

  const cardMap = new Map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cards.map((card: any) => [card._id.toString(), card.providerName])
  );

  return (
    expenses[0].cards
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((card: any) => ({
        cardId: String(card._id),
        cardProviderName: String(cardMap.get(String(card._id)) || 'Unknown'),
        total: Number(card.total),
        count: Number(card.count),
        percentage:
          totalSpend > 0 ? (Number(card.total) / totalSpend) * 100 : 0,
      }))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .sort((a: any, b: any) => b.total - a.total)
  );
}

export async function getIncomeVsExpense(
  userId: string,
  filters: DashboardFilters
): Promise<IncomeVsExpense> {
  await connectDB();

  const dateFilter = buildDateFilter(filters);

  const [incomeResult, expenseResult] = await Promise.all([
    Income.aggregate([
      {
        $match: {
          userId,
          deletedAt: null,
          ...dateFilter,
        },
      },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: '$amount' },
          incomeCount: { $sum: 1 },
        },
      },
    ]),
    Expense.aggregate([
      {
        $match: {
          userId,
          deletedAt: null,
          ...dateFilter,
        },
      },
      {
        $group: {
          _id: null,
          totalExpense: { $sum: '$amount' },
          expenseCount: { $sum: 1 },
        },
      },
    ]),
  ]);

  const totalIncome = incomeResult[0]?.totalIncome || 0;
  const incomeCount = incomeResult[0]?.incomeCount || 0;
  const totalExpense = expenseResult[0]?.totalExpense || 0;
  const expenseCount = expenseResult[0]?.expenseCount || 0;

  return {
    totalIncome,
    totalExpense,
    netAmount: totalIncome - totalExpense,
    incomeCount,
    expenseCount,
  };
}

export async function getIncomeVsExpenseByDate(
  userId: string,
  filters: DashboardFilters
): Promise<IncomeVsExpenseByDate[]> {
  await connectDB();

  const dateFilter = buildDateFilter(filters);

  const [incomeResult, expenseResult] = await Promise.all([
    Income.aggregate([
      {
        $match: {
          userId,
          deletedAt: null,
          ...dateFilter,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$date' },
          },
          totalIncome: { $sum: '$amount' },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]),
    Expense.aggregate([
      {
        $match: {
          userId,
          deletedAt: null,
          ...dateFilter,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$date' },
          },
          totalExpense: { $sum: '$amount' },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]),
  ]);

  const incomeMap = new Map(
    incomeResult.map((item) => [item._id, item.totalIncome])
  );
  const expenseMap = new Map(
    expenseResult.map((item) => [item._id, item.totalExpense])
  );

  const allDates = new Set([
    ...incomeResult.map((item) => item._id),
    ...expenseResult.map((item) => item._id),
  ]);

  return Array.from(allDates)
    .sort()
    .map(
      (date): IncomeVsExpenseByDate => ({
        date: String(date),
        income: incomeMap.get(date) || 0,
        expense: expenseMap.get(date) || 0,
      })
    );
}

export async function getDashboardMetrics(
  userId: string,
  filters: DashboardFilters
): Promise<DashboardMetrics> {
  await connectDB();

  const [
    totalSpend,
    categoryBreakdown,
    subcategoryBreakdown,
    moneyModeUsage,
    cardSpend,
    incomeVsExpense,
    incomeVsExpenseByDate,
  ] = await Promise.all([
    getTotalSpend(userId, filters),
    getCategoryBreakdown(userId, filters),
    getSubcategoryBreakdown(userId, filters),
    getMoneyModeUsage(userId, filters),
    getCardSpend(userId, filters),
    getIncomeVsExpense(userId, filters),
    getIncomeVsExpenseByDate(userId, filters),
  ]);

  return {
    totalSpend,
    categoryBreakdown,
    subcategoryBreakdown,
    moneyModeUsage,
    cardSpend,
    incomeVsExpense,
    incomeVsExpenseByDate,
  };
}
