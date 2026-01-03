'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { Button } from '@/ui/atoms/Button';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent shadow-lg"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="flex min-h-[80vh] flex-col items-center justify-center p-8 sm:p-24">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8">
            <h1 className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-6xl font-extrabold text-transparent sm:text-7xl md:text-8xl">
              Kanakkan
            </h1>
            <div className="mt-4 flex items-center justify-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-purple-500"></div>
              <div className="h-2 w-2 animate-pulse rounded-full bg-pink-500 delay-75"></div>
              <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500 delay-150"></div>
            </div>
          </div>
          <p className="mt-6 text-xl text-gray-700 sm:text-2xl md:text-3xl">
            Take control of your finances with intelligent expense tracking and
            powerful analytics
          </p>
          <p className="mt-4 text-lg text-gray-600 sm:text-xl">
            Understand where your money goes, make informed decisions, and
            achieve your financial goals
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50 transition-all hover:from-purple-700 hover:to-pink-700 hover:shadow-xl hover:shadow-purple-500/60"
              >
                Get Started Free
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-purple-500 text-purple-600 transition-all hover:border-purple-600 hover:bg-purple-50"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Track Expenses Section */}
      <section className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-8">
          <div className="text-center">
            <h2 className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl">
              Why Track Your Expenses?
            </h2>
            <p className="mt-4 text-lg text-gray-700 sm:text-xl">
              Financial awareness is the first step toward financial freedom
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-xl">
              <div className="mb-4 text-4xl">🎯</div>
              <h3 className="text-xl font-bold text-gray-900">
                Achieve Your Goals
              </h3>
              <p className="mt-3 text-gray-600">
                Whether it&apos;s saving for a vacation, buying a home, or building an
                emergency fund, tracking expenses helps you understand your
                spending patterns and make progress toward your financial goals.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-xl">
              <div className="mb-4 text-4xl">💡</div>
              <h3 className="text-xl font-bold text-gray-900">
                Identify Spending Patterns
              </h3>
              <p className="mt-3 text-gray-600">
                Discover where your money actually goes. Many people are
                surprised to find they spend more on certain categories than
                they realize. Awareness leads to better decisions.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-xl">
              <div className="mb-4 text-4xl">📈</div>
              <h3 className="text-xl font-bold text-gray-900">
                Build Better Habits
              </h3>
              <p className="mt-3 text-gray-600">
                Regular tracking creates mindfulness around spending. You&apos;ll
                naturally start making more conscious choices and develop
                healthier financial habits over time.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-xl">
              <div className="mb-4 text-4xl">🛡️</div>
              <h3 className="text-xl font-bold text-gray-900">
                Emergency Preparedness
              </h3>
              <p className="mt-3 text-gray-600">
                Understanding your expenses helps you build an accurate budget
                and emergency fund. You&apos;ll know exactly how much you need to
                cover unexpected situations.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-xl">
              <div className="mb-4 text-4xl">💰</div>
              <h3 className="text-xl font-bold text-gray-900">
                Reduce Unnecessary Spending
              </h3>
              <p className="mt-3 text-gray-600">
                When you see your spending in black and white, you can easily
                identify areas where you can cut back without impacting your
                quality of life.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-lg transition-all hover:shadow-xl">
              <div className="mb-4 text-4xl">📊</div>
              <h3 className="text-xl font-bold text-gray-900">
                Make Data-Driven Decisions
              </h3>
              <p className="mt-3 text-gray-600">
                Instead of guessing, use real data to make financial decisions.
                See trends, compare months, and understand the impact of your
                choices over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-8">
          <div className="text-center">
            <h2 className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl">
              Powerful Features
            </h2>
            <p className="mt-4 text-lg text-gray-700 sm:text-xl">
              Everything you need to manage your finances effectively
            </p>
          </div>

          <div className="mt-16 space-y-12">
            {/* Feature 1 */}
            <div className="flex flex-col items-center gap-8 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 p-8 shadow-lg md:flex-row">
              <div className="flex-shrink-0 text-6xl">💰</div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-purple-900">
                  Comprehensive Transaction Tracking
                </h3>
                <p className="mt-3 text-purple-800">
                  Record every income and expense with detailed categorization.
                  Track by date, category, subcategory, payment method, and bank
                  account. Add notes to remember the context of each
                  transaction. Edit or delete transactions anytime to keep your
                  records accurate.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center gap-8 rounded-2xl bg-gradient-to-br from-pink-100 to-pink-200 p-8 shadow-lg md:flex-row-reverse">
              <div className="flex-shrink-0 text-6xl">📊</div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-pink-900">
                  Interactive Dashboards & Analytics
                </h3>
                <p className="mt-3 text-pink-800">
                  Visualize your financial data with beautiful charts and
                  graphs. See income vs expenses over time, category breakdowns,
                  payment method usage, and spending trends. Get insights at a
                  glance with our intuitive dashboard that updates in real-time.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center gap-8 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 p-8 shadow-lg md:flex-row">
              <div className="flex-shrink-0 text-6xl">🏷️</div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-blue-900">
                  Smart Category Management
                </h3>
                <p className="mt-3 text-blue-800">
                  Organize your finances with custom categories and
                  subcategories. Pre-loaded with common categories like Food &
                  Dining, Transportation, Shopping, and more. Create your own
                  categories to match your unique spending patterns. Full
                  control to edit or delete any category as needed.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col items-center gap-8 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-200 p-8 shadow-lg md:flex-row-reverse">
              <div className="flex-shrink-0 text-6xl">💳</div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-emerald-900">
                  Multiple Payment Methods & Accounts
                </h3>
                <p className="mt-3 text-emerald-800">
                  Track expenses across different payment methods including
                  Cash, UPI, Credit Cards, Debit Cards, Bank Transfers, and
                  more. Manage multiple bank accounts and credit cards. See
                  spending patterns by payment method to understand your
                  financial behavior better.
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="flex flex-col items-center gap-8 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 p-8 shadow-lg md:flex-row">
              <div className="flex-shrink-0 text-6xl">📅</div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-amber-900">
                  Transaction History & Filtering
                </h3>
                <p className="mt-3 text-amber-800">
                  View all your transactions in a comprehensive table format.
                  Filter by month and year to analyze specific time periods.
                  See complete transaction details including date, type,
                  category, amount, and account. Edit or delete transactions
                  directly from the list for easy management.
                </p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="flex flex-col items-center gap-8 rounded-2xl bg-gradient-to-br from-rose-100 to-rose-200 p-8 shadow-lg md:flex-row-reverse">
              <div className="flex-shrink-0 text-6xl">📧</div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-rose-900">
                  Email Reminders & Summaries
                </h3>
                <p className="mt-3 text-rose-800">
                  Stay on top of your finances with daily reminder emails
                  showing today&apos;s transactions. Receive monthly summaries with
                  total income, expenses, net amount, and top spending
                  categories. Never miss tracking your expenses with automated
                  reminders.
                </p>
              </div>
            </div>

            {/* Feature 7 */}
            <div className="flex flex-col items-center gap-8 rounded-2xl bg-gradient-to-br from-indigo-100 to-indigo-200 p-8 shadow-lg md:flex-row">
              <div className="flex-shrink-0 text-6xl">🔐</div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-indigo-900">
                  Secure & Private
                </h3>
                <p className="mt-3 text-indigo-800">
                  Your financial data is protected with industry-standard
                  security. JWT-based authentication ensures your account is
                  secure. All data is encrypted and stored safely. You have full
                  control over your information with the ability to update your
                  profile, change password, and manage all your data.
                </p>
              </div>
            </div>

            {/* Feature 8 */}
            <div className="flex flex-col items-center gap-8 rounded-2xl bg-gradient-to-br from-cyan-100 to-cyan-200 p-8 shadow-lg md:flex-row-reverse">
              <div className="flex-shrink-0 text-6xl">📱</div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-cyan-900">
                  Responsive Design
                </h3>
                <p className="mt-3 text-cyan-800">
                  Access your finances from any device - desktop, tablet, or
                  mobile. Our responsive design ensures a seamless experience
                  whether you&apos;re at home or on the go. Track expenses
                  conveniently from anywhere, anytime.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-8 text-center">
          <h2 className="text-4xl font-bold text-white sm:text-5xl">
            Ready to Take Control of Your Finances?
          </h2>
          <p className="mt-6 text-xl text-white/90 sm:text-2xl">
            Join thousands of users who are already managing their money smarter
            with Kanakkan
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-white text-purple-600 shadow-xl transition-all hover:bg-gray-100 hover:shadow-2xl"
              >
                Start Tracking Free
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white bg-purple-300 transition-all hover:bg-white/10"
              >
                Sign In
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm text-white/80">
            No credit card required • Free forever • Your data, your control
          </p>
        </div>
      </section>
    </div>
  );
}
