/* eslint-disable @typescript-eslint/no-explicit-any */
// Seed script - TypeScript strict checking disabled for Mongoose compatibility

import bcrypt from 'bcrypt';
import connectDB from '../src/lib/db';
import { BankAccount } from '../src/modules/account/account.model';
import { User } from '../src/modules/auth/auth.model';
import { Category, SubCategory } from '../src/modules/category/category.model';
import { Expense } from '../src/modules/expense/expense.model';
import { Income } from '../src/modules/income/income.model';
import {
  Card,
  MoneyMode,
  PaymentType,
} from '../src/modules/payment/payment.model';

const SALT_ROUNDS = 12;

async function seed() {
  try {
    console.log('🌱 Starting database seed...');

    await connectDB();
    console.log('✅ Connected to database');

    // Clear existing data
    // @ts-expect-error - Mongoose type system false positive
    await User.deleteMany({});
    // @ts-expect-error - Mongoose type system false positive
    await Category.deleteMany({});
    // @ts-expect-error - Mongoose type system false positive
    await SubCategory.deleteMany({});
    // @ts-expect-error - Mongoose type system false positive
    await MoneyMode.deleteMany({});
    // @ts-expect-error - Mongoose type system false positive
    await PaymentType.deleteMany({});
    // @ts-expect-error - Mongoose type system false positive
    await Card.deleteMany({});
    // @ts-expect-error - Mongoose type system false positive
    await BankAccount.deleteMany({});
    // @ts-expect-error - Mongoose type system false positive
    await Expense.deleteMany({});
    // @ts-expect-error - Mongoose type system false positive
    await Income.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Create test user
    const hashedPassword = await bcrypt.hash('password123', SALT_ROUNDS);
    // @ts-expect-error - Mongoose type system false positive
    const user = await User.create({
      email: 'demo@kanakkan.com',
      password: hashedPassword,
    });
    console.log('👤 Created test user: demo@kanakkan.com / password123');

    const userId = user._id.toString();

    const dateDetails = {
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const categories = await Category.insertMany([
      {
        userId,
        name: 'Food & Dining',
        type: 'EXPENSE' as const,
        ...dateDetails,
      },
      {
        userId,
        name: 'Transportation',
        type: 'EXPENSE' as const,
        ...dateDetails,
      },
      { userId, name: 'Shopping', type: 'EXPENSE' as const, ...dateDetails },
      {
        userId,
        name: 'Bills & Utilities',
        type: 'EXPENSE' as const,
        ...dateDetails,
      },
      {
        userId,
        name: 'Entertainment',
        type: 'EXPENSE' as const,
        ...dateDetails,
      },
      { userId, name: 'Healthcare', type: 'EXPENSE' as const, ...dateDetails },
      { userId, name: 'Salary', type: 'INCOME' as const, ...dateDetails },
      { userId, name: 'Freelance', type: 'INCOME' as const, ...dateDetails },
      {
        userId,
        name: 'Investment Returns',
        type: 'INCOME' as const,
        ...dateDetails,
      },
    ] as any);
    console.log('📁 Created categories');

    // Create subcategories (only for expense categories)
    const expenseCategories = categories.filter(
      (cat) => cat.type === 'EXPENSE'
    );
    const subcategories = [];
    for (const category of expenseCategories) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const subs = await SubCategory.insertMany([
        {
          userId,
          categoryId: category._id.toString(),
          name: `${category.name} - Primary`,
        },
        {
          userId,
          categoryId: category._id.toString(),
          name: `${category.name} - Secondary`,
        },
      ] as any);
      subcategories.push(...subs);
    }
    console.log('📂 Created subcategories');

    // Create money modes
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const moneyModes = await MoneyMode.insertMany([
      { userId, name: 'Cash' },
      { userId, name: 'UPI' },
      { userId, name: 'Bank Transfer' },
    ] as any);
    console.log('💳 Created money modes');

    // Create payment types
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const paymentTypes = await PaymentType.insertMany([
      { userId, name: 'One-time' },
      { userId, name: 'Recurring' },
      { userId, name: 'Subscription' },
    ] as any);
    console.log('💳 Created payment types');

    // Create cards
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cards = await Card.insertMany([
      { userId, providerName: 'HDFC Bank' },
      { userId, providerName: 'ICICI Bank' },
      { userId, providerName: 'SBI' },
    ] as any);
    console.log('💳 Created cards');

    // Create bank accounts
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bankAccounts = await BankAccount.insertMany([
      {
        userId,
        name: 'Primary Savings',
        bankName: 'HDFC Bank',
        accountNumber: '1234567890',
        accountType: 'SAVINGS' as const,
      },
      {
        userId,
        name: 'Salary Account',
        bankName: 'ICICI Bank',
        accountNumber: '0987654321',
        accountType: 'CURRENT' as const,
      },
    ] as any);
    console.log('🏦 Created bank accounts');

    // Create sample expenses
    const expenses = [];
    const expenseDates = [];
    const now = new Date();

    for (let i = 0; i < 30; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      expenseDates.push(date);

      const category =
        expenseCategories[Math.floor(Math.random() * expenseCategories.length)];
      const subcategory = subcategories.find(
        (sub) => sub.categoryId.toString() === category._id.toString()
      );
      const moneyMode =
        moneyModes[Math.floor(Math.random() * moneyModes.length)];
      const paymentType =
        paymentTypes[Math.floor(Math.random() * paymentTypes.length)];
      const account =
        bankAccounts[Math.floor(Math.random() * bankAccounts.length)];
      const card =
        Math.random() > 0.5
          ? cards[Math.floor(Math.random() * cards.length)]
          : null;

      expenses.push({
        userId,
        amount: Math.floor(Math.random() * 5000) + 100,
        note: `Sample expense ${i + 1}`,
        date,
        categoryId: category._id.toString(),
        subCategoryId: subcategory?._id.toString(),
        moneyModeId: moneyMode._id.toString(),
        paymentTypeId: paymentType._id.toString(),
        accountId: account._id.toString(),
        cardId: card?._id.toString() || undefined,
        deletedAt: null,
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await Expense.insertMany(expenses as any);
    console.log('💰 Created 30 sample expenses');

    // Create sample incomes
    const incomeCategories = categories.filter((cat) => cat.type === 'INCOME');
    const incomes = [];
    for (let i = 0; i < 3; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i * 10);

      const category =
        incomeCategories[Math.floor(Math.random() * incomeCategories.length)];
      const account =
        bankAccounts[Math.floor(Math.random() * bankAccounts.length)];

      incomes.push({
        userId,
        amount: Math.floor(Math.random() * 50000) + 20000,
        source: `Salary ${i + 1}`,
        date,
        incomeCategoryId: category._id.toString(),
        accountId: account._id.toString(),
        deletedAt: null,
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await Income.insertMany(incomes as any);
    console.log('💵 Created 3 sample incomes');

    console.log('✅ Database seeded successfully!');
    console.log('\n📝 Login credentials:');
    console.log('   Email: demo@kanakkan.com');
    console.log('   Password: password123');
    console.log('\n🚀 You can now start the app with: npm run dev');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
