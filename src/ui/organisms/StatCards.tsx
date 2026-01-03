'use client';

import type {
  IncomeVsExpense,
  TotalSpend,
} from '@/modules/dashboard/dashboard.types';
import {
  formatCurrencyAbsolute,
  formatCurrencyWithSign,
} from '@/utils/currency';
import Link from 'next/link';

interface StatCardsProps {
  totalSpend: TotalSpend;
  incomeVsExpense: IncomeVsExpense;
}

const statCards = [
  {
    title: 'Total Spend',
    icon: '💸',
    gradient: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-50 to-cyan-50',
    borderColor: 'border-blue-200',
  },
  {
    title: 'Total Income',
    icon: '💰',
    gradient: 'from-emerald-500 to-teal-500',
    bgGradient: 'from-emerald-50 to-teal-50',
    borderColor: 'border-emerald-200',
  },
  {
    title: 'Total Expense',
    icon: '📉',
    gradient: 'from-rose-500 to-pink-500',
    bgGradient: 'from-rose-50 to-pink-50',
    borderColor: 'border-rose-200',
  },
  {
    title: 'Net Amount',
    icon: '📊',
    gradient: 'from-indigo-500 to-purple-500',
    bgGradient: 'from-indigo-50 to-purple-50',
    borderColor: 'border-indigo-200',
  },
];

export function StatCards({ totalSpend, incomeVsExpense }: StatCardsProps) {
  const netAmount = incomeVsExpense.netAmount;
  const isPositive = netAmount >= 0;

  const cards = [
    {
      ...statCards[0],
      value: formatCurrencyAbsolute(totalSpend.total),
      subtitle: `${totalSpend.count} transactions`,
    },
    {
      ...statCards[1],
      value: formatCurrencyAbsolute(incomeVsExpense.totalIncome),
      subtitle: `${incomeVsExpense.incomeCount} transactions`,
    },
    {
      ...statCards[2],
      value: formatCurrencyAbsolute(incomeVsExpense.totalExpense),
      subtitle: `${incomeVsExpense.expenseCount} transactions`,
    },
    {
      ...statCards[3],
      value: formatCurrencyWithSign(netAmount),
      subtitle: isPositive ? 'Surplus' : 'Deficit',
      extra: incomeVsExpense.totalIncome > 0 && (
        <div
          className={`mt-3 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
            isPositive
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-rose-100 text-rose-700'
          }`}
        >
          <span>{isPositive ? '↑' : '↓'}</span>
          <span>
            {Math.abs((netAmount / incomeVsExpense.totalIncome) * 100).toFixed(
              1
            )}
            %
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Link
          href="/transactions-list"
          key={index}
          className={`group relative overflow-hidden rounded-2xl border ${card.borderColor} bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
          ></div>
          <div className="relative">
            <div className="mb-4 flex items-center justify-between">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${card.gradient} text-2xl shadow-lg`}
              >
                {card.icon}
              </div>
            </div>
            <div className="mb-1 text-sm font-medium text-slate-600">
              {card.title}
            </div>
            <div className="mb-2 text-2xl font-bold text-slate-900">
              {card.value}
            </div>
            <div className="text-xs font-medium text-slate-500">
              {card.subtitle}
            </div>
            {/* {card.extra && <div className="mt-3">{card.extra}</div>} */}
          </div>
        </Link>
      ))}
    </div>
  );
}
