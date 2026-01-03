'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { CategoriesTab } from '@/ui/organisms/settings/CategoriesTab';
import { SubCategoriesTab } from '@/ui/organisms/settings/SubCategoriesTab';
import { MoneyModesTab } from '@/ui/organisms/settings/MoneyModesTab';
import { PaymentTypesTab } from '@/ui/organisms/settings/PaymentTypesTab';
import { BankAccountsTab } from '@/ui/organisms/settings/BankAccountsTab';
import { ProfileTab } from '@/ui/organisms/settings/ProfileTab';

type TabType = 'profile' | 'categories' | 'subcategories' | 'money-modes' | 'payment-types' | 'bank-accounts';

export default function SettingsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('profile');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

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

  const tabs: Array<{ id: TabType; label: string }> = [
    { id: 'profile', label: 'Profile' },
    { id: 'categories', label: 'Categories' },
    { id: 'subcategories', label: 'Subcategories' },
    { id: 'money-modes', label: 'Money Modes' },
    { id: 'payment-types', label: 'Payment Types' },
    { id: 'bank-accounts', label: 'Bank Accounts' },
  ];

  const tabColors = {
    profile: 'from-pink-500 to-rose-500',
    categories: 'from-blue-500 to-cyan-500',
    subcategories: 'from-purple-500 to-pink-500',
    'money-modes': 'from-green-500 to-emerald-500',
    'payment-types': 'from-orange-500 to-red-500',
    'bank-accounts': 'from-indigo-500 to-blue-500',
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 text-white shadow-2xl">
          <h1 className="text-4xl font-extrabold sm:text-5xl">⚙️ Settings</h1>
          <p className="mt-2 text-lg text-purple-100">
            Manage your profile, categories, subcategories, money modes, payment types, and bank accounts
          </p>
        </div>

        <div className="mb-6 rounded-xl bg-gradient-to-r from-white via-purple-50/50 to-pink-50/50 p-2 shadow-lg">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap rounded-lg border-2 px-6 py-3 text-sm font-bold transition-all ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${tabColors[tab.id]} border-transparent text-white shadow-lg`
                    : 'border-purple-200 bg-white text-gray-700 hover:border-purple-400 hover:bg-purple-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 p-8 shadow-2xl">
          {activeTab === 'profile' && <ProfileTab />}
          {activeTab === 'categories' && <CategoriesTab />}
          {activeTab === 'subcategories' && <SubCategoriesTab />}
          {activeTab === 'money-modes' && <MoneyModesTab />}
          {activeTab === 'payment-types' && <PaymentTypesTab />}
          {activeTab === 'bank-accounts' && <BankAccountsTab />}
        </div>
      </div>
    </div>
  );
}

