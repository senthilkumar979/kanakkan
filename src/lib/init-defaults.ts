import connectDB from './db';
import { Category, SubCategory } from '@/modules/category/category.model';
import { MoneyMode, PaymentType } from '@/modules/payment/payment.model';

const SYSTEM_USER_ID = 'SYSTEM';

const DEFAULT_CATEGORIES = [
  { name: 'Food & Dining', type: 'EXPENSE' as const },
  { name: 'Transportation', type: 'EXPENSE' as const },
  { name: 'Shopping', type: 'EXPENSE' as const },
  { name: 'Bills & Utilities', type: 'EXPENSE' as const },
  { name: 'Entertainment', type: 'EXPENSE' as const },
  { name: 'Healthcare', type: 'EXPENSE' as const },
  { name: 'Education', type: 'EXPENSE' as const },
  { name: 'Personal Care', type: 'EXPENSE' as const },
  { name: 'Salary', type: 'INCOME' as const },
  { name: 'Freelance', type: 'INCOME' as const },
  { name: 'Investment Returns', type: 'INCOME' as const },
  { name: 'Other Income', type: 'INCOME' as const },
];

const DEFAULT_SUBCATEGORIES = [
  // Food & Dining
  { name: 'Groceries', categoryName: 'Food & Dining' },
  { name: 'Restaurants', categoryName: 'Food & Dining' },
  { name: 'Fast Food', categoryName: 'Food & Dining' },
  { name: 'Coffee & Tea', categoryName: 'Food & Dining' },
  // Transportation
  { name: 'Fuel', categoryName: 'Transportation' },
  { name: 'Public Transport', categoryName: 'Transportation' },
  { name: 'Taxi/Ride Share', categoryName: 'Transportation' },
  { name: 'Parking', categoryName: 'Transportation' },
  // Shopping
  { name: 'Clothing', categoryName: 'Shopping' },
  { name: 'Electronics', categoryName: 'Shopping' },
  { name: 'Home & Garden', categoryName: 'Shopping' },
  { name: 'Online Shopping', categoryName: 'Shopping' },
  // Bills & Utilities
  { name: 'Electricity', categoryName: 'Bills & Utilities' },
  { name: 'Water', categoryName: 'Bills & Utilities' },
  { name: 'Internet', categoryName: 'Bills & Utilities' },
  { name: 'Phone', categoryName: 'Bills & Utilities' },
  // Entertainment
  { name: 'Movies', categoryName: 'Entertainment' },
  { name: 'Streaming Services', categoryName: 'Entertainment' },
  { name: 'Sports & Recreation', categoryName: 'Entertainment' },
  { name: 'Hobbies', categoryName: 'Entertainment' },
  // Healthcare
  { name: 'Doctor Visits', categoryName: 'Healthcare' },
  { name: 'Medications', categoryName: 'Healthcare' },
  { name: 'Health Insurance', categoryName: 'Healthcare' },
  { name: 'Fitness', categoryName: 'Healthcare' },
  // Education
  { name: 'Tuition', categoryName: 'Education' },
  { name: 'Books & Supplies', categoryName: 'Education' },
  { name: 'Courses', categoryName: 'Education' },
  // Personal Care
  { name: 'Haircut', categoryName: 'Personal Care' },
  { name: 'Skincare', categoryName: 'Personal Care' },
  { name: 'Gym Membership', categoryName: 'Personal Care' },
];

const DEFAULT_MONEY_MODES = [
  'Cash',
  'UPI',
  'Credit Card',
  'Debit Card',
  'Bank Transfer',
  'Net Banking',
  'Wallet',
];

const DEFAULT_PAYMENT_TYPES = [
  'One-time',
  'Recurring',
  'Installment',
  'Subscription',
];

let initializationPromise: Promise<void> | null = null;

async function initializeDefaults(): Promise<void> {
  try {
    // Connection is already established when this is called from db.ts
    // Check and initialize Categories
    const categoryCount = await Category.countDocuments({ deletedAt: null });
    if (categoryCount === 0) {
      const categories = await Category.insertMany(
        DEFAULT_CATEGORIES.map((cat) => ({
          ...cat,
          userId: SYSTEM_USER_ID,
        }))
      );
      console.log(`✅ Initialized ${categories.length} default categories`);

      // Create subcategories after categories are created
      const categoryMap = new Map<string, string>();
      categories.forEach((cat) => {
        categoryMap.set(cat.name, cat._id.toString());
      });

      const subCategoriesToCreate = DEFAULT_SUBCATEGORIES.map((sub) => {
        const categoryId = categoryMap.get(sub.categoryName);
        if (!categoryId) {
          throw new Error(`Category not found: ${sub.categoryName}`);
        }
        return {
          name: sub.name,
          categoryId,
          userId: SYSTEM_USER_ID,
        };
      });

      await SubCategory.insertMany(subCategoriesToCreate);
      console.log(`✅ Initialized ${subCategoriesToCreate.length} default subcategories`);
    }

    // Check and initialize Money Modes
    const moneyModeCount = await MoneyMode.countDocuments({ deletedAt: null });
    if (moneyModeCount === 0) {
      await MoneyMode.insertMany(
        DEFAULT_MONEY_MODES.map((name) => ({
          name,
          userId: SYSTEM_USER_ID,
        }))
      );
      console.log(`✅ Initialized ${DEFAULT_MONEY_MODES.length} default money modes`);
    }

    // Check and initialize Payment Types
    const paymentTypeCount = await PaymentType.countDocuments({ deletedAt: null });
    if (paymentTypeCount === 0) {
      await PaymentType.insertMany(
        DEFAULT_PAYMENT_TYPES.map((name) => ({
          name,
          userId: SYSTEM_USER_ID,
        }))
      );
      console.log(`✅ Initialized ${DEFAULT_PAYMENT_TYPES.length} default payment types`);
    }
  } catch (error) {
    console.error('❌ Error initializing defaults:', error);
    throw error;
  }
}

export function ensureDefaultsInitialized(): Promise<void> {
  if (!initializationPromise) {
    initializationPromise = initializeDefaults();
  }
  return initializationPromise;
}

