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
  const categories = await Category.find({
    _id: { $in: categoryIds },
    userId,
    deletedAt: null,
  });

  const categoryMap = new Map(
    categories.map((cat) => [cat._id.toString(), cat.name])
  );

  return expenses
    .map((expense) => ({
      categoryId: expense._id,
      categoryName: categoryMap.get(expense._id) || 'Unknown',
      total: expense.total,
      count: expense.count,
    }))
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
    SubCategory.find({
      _id: { $in: subcategoryIds },
      userId,
      deletedAt: null,
    }),
    Category.find({
      _id: { $in: [...new Set(categoryIds)] },
      userId,
      deletedAt: null,
    }),
  ]);

  const subcategoryMap = new Map(
    subcategories.map((sub) => [sub._id.toString(), sub.name])
  );
  const categoryMap = new Map(
    categories.map((cat) => [cat._id.toString(), cat.name])
  );

  return expenses
    .map((expense) => ({
      subcategoryId: expense._id.subcategoryId,
      subcategoryName:
        subcategoryMap.get(expense._id.subcategoryId) || 'Unknown',
      categoryId: expense._id.categoryId,
      categoryName: categoryMap.get(expense._id.categoryId) || 'Unknown',
      total: expense.total,
      count: expense.count,
    }))
    .sort((a, b) => b.total - a.total);
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

  const moneyModes = await MoneyMode.find({
    _id: { $in: moneyModeIds },
    userId,
    deletedAt: null,
  });

  const moneyModeMap = new Map(
    moneyModes.map((mode) => [mode._id.toString(), mode.name])
  );

  return expenses[0].modes
    .map((mode: { _id: string; total: number; count: number }) => ({
      moneyModeId: mode._id,
      moneyModeName: moneyModeMap.get(mode._id) || 'Unknown',
      total: mode.total,
      count: mode.count,
      percentage: totalSpend > 0 ? (mode.total / totalSpend) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total);
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

  const cards = await Card.find({
    _id: { $in: cardIds },
    userId,
    deletedAt: null,
  });

  const cardMap = new Map(
    cards.map((card) => [card._id.toString(), card.providerName])
  );

  return expenses[0].cards
    .map((card: { _id: string; total: number; count: number }) => ({
      cardId: card._id,
      cardProviderName: cardMap.get(card._id) || 'Unknown',
      total: card.total,
      count: card.count,
      percentage: totalSpend > 0 ? (card.total / totalSpend) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total);
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
  ] = await Promise.all([
    getTotalSpend(userId, filters),
    getCategoryBreakdown(userId, filters),
    getSubcategoryBreakdown(userId, filters),
    getMoneyModeUsage(userId, filters),
    getCardSpend(userId, filters),
    getIncomeVsExpense(userId, filters),
  ]);

  return {
    totalSpend,
    categoryBreakdown,
    subcategoryBreakdown,
    moneyModeUsage,
    cardSpend,
    incomeVsExpense,
  };
}

