'use client';

import type {
  CardSpend,
  CategoryBreakdown,
  IncomeVsExpense,
  IncomeVsExpenseByDate,
  MoneyModeUsage,
  SubcategoryBreakdown,
} from '@/modules/dashboard/dashboard.types';
import { RadialBarChart, SankeyChart, StackedAreaChart } from './charts';
import type {
  ChartDataPoint,
  SankeyData,
  TimeSeriesDataPoint,
} from './charts/chart.types';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
}

const chartCardGradients = [
  'from-blue-500/10 via-cyan-500/10 to-teal-500/10 border-blue-300',
  'from-purple-500/10 via-pink-500/10 to-rose-500/10 border-purple-300',
  'from-green-500/10 via-emerald-500/10 to-teal-500/10 border-green-300',
  'from-orange-500/10 via-red-500/10 to-pink-500/10 border-orange-300',
  'from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-indigo-300',
];

let cardIndex = 0;

function ChartCard({ title, children }: ChartCardProps) {
  const gradient = chartCardGradients[cardIndex % chartCardGradients.length];
  cardIndex++;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-5`}
      ></div>
      <div className="relative">
        <h3 className="mb-6 text-lg font-semibold text-slate-900">{title}</h3>
        {children}
      </div>
    </div>
  );
}

interface ChartCardsProps {
  categoryBreakdown: CategoryBreakdown[];
  subcategoryBreakdown: SubcategoryBreakdown[];
  moneyModeUsage: MoneyModeUsage[];
  cardSpend: CardSpend[];
  incomeVsExpense: IncomeVsExpense;
  incomeVsExpenseByDate: IncomeVsExpenseByDate[];
}

export function ChartCards({
  categoryBreakdown,
  subcategoryBreakdown,
  moneyModeUsage,
  cardSpend,
  incomeVsExpense,
  incomeVsExpenseByDate,
}: ChartCardsProps) {
  const categoryChartData: ChartDataPoint[] = categoryBreakdown.map((item) => ({
    name: item.categoryName,
    value: item.total,
  }));

  const moneyModeChartData: ChartDataPoint[] = moneyModeUsage.map((item) => ({
    name: item.moneyModeName,
    value: item.total,
  }));

  const cardChartData: ChartDataPoint[] = cardSpend.map((item) => ({
    name: item.cardProviderName,
    value: item.total,
  }));

  const incomeVsExpenseData: TimeSeriesDataPoint[] =
    incomeVsExpenseByDate.length > 0
      ? (incomeVsExpenseByDate.map((item) => ({
          date: item.date,
          income: item.income,
          expense: item.expense,
        })) as TimeSeriesDataPoint[])
      : ([
          {
            date: new Date().toISOString().split('T')[0],
            income: incomeVsExpense.totalIncome,
            expense: incomeVsExpense.totalExpense,
          },
        ] as TimeSeriesDataPoint[]);

  const sankeyNodes = new Map<string, { id: string; name: string }>();

  categoryBreakdown.forEach((cat) => {
    sankeyNodes.set(cat.categoryId, {
      id: cat.categoryId,
      name: cat.categoryName,
    });
  });

  subcategoryBreakdown.forEach((sub) => {
    if (!sankeyNodes.has(sub.subcategoryId)) {
      sankeyNodes.set(sub.subcategoryId, {
        id: sub.subcategoryId,
        name: sub.subcategoryName,
      });
    }
  });

  const sankeyData: SankeyData = {
    nodes: Array.from(sankeyNodes.values()),
    links: subcategoryBreakdown
      .filter((sub) => sankeyNodes.has(sub.categoryId))
      .map((sub) => ({
        source: sub.categoryId,
        target: sub.subcategoryId,
        value: sub.total,
      })),
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <ChartCard title="Category Breakdown">
        <RadialBarChart
          data={categoryChartData}
          height={300}
          showLegend={true}
        />
      </ChartCard>

      <ChartCard title="Money Mode Usage">
        <RadialBarChart
          data={moneyModeChartData}
          height={300}
          showLegend={true}
        />
      </ChartCard>

      <ChartCard title="Card Spend">
        <RadialBarChart data={cardChartData} height={300} showLegend={true} />
      </ChartCard>

      <ChartCard title="Income vs Expense">
        <StackedAreaChart
          data={incomeVsExpenseData}
          dataKeys={['income', 'expense']}
          height={300}
        />
      </ChartCard>

      {sankeyData.nodes.length > 0 && sankeyData.links.length > 0 && (
        <ChartCard title="Category Flow">
          <SankeyChart data={sankeyData} height={300} />
        </ChartCard>
      )}
    </div>
  );
}
