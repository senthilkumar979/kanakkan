export interface DashboardFilters {
  startDate?: Date;
  endDate?: Date;
}

export interface TotalSpend {
  total: number;
  count: number;
}

export interface CategoryBreakdown {
  categoryId: string;
  categoryName: string;
  total: number;
  count: number;
}

export interface SubcategoryBreakdown {
  subcategoryId: string;
  subcategoryName: string;
  categoryId: string;
  categoryName: string;
  total: number;
  count: number;
}

export interface MoneyModeUsage {
  moneyModeId: string;
  moneyModeName: string;
  total: number;
  count: number;
  percentage: number;
}

export interface CardSpend {
  cardId: string;
  cardProviderName: string;
  total: number;
  count: number;
  percentage: number;
}

export interface IncomeVsExpense {
  totalIncome: number;
  totalExpense: number;
  netAmount: number;
  incomeCount: number;
  expenseCount: number;
}

export interface DashboardMetrics {
  totalSpend: TotalSpend;
  categoryBreakdown: CategoryBreakdown[];
  subcategoryBreakdown: SubcategoryBreakdown[];
  moneyModeUsage: MoneyModeUsage[];
  cardSpend: CardSpend[];
  incomeVsExpense: IncomeVsExpense;
}

