import connectDB from '@/lib/db';
import { Category, SubCategory } from './category.model';
import type {
  Category as CategoryType,
  SubCategory as SubCategoryType,
  CreateCategoryInput,
  UpdateCategoryInput,
  CreateSubCategoryInput,
  UpdateSubCategoryInput,
} from './category.types';

async function findCategoryById(
  categoryId: string,
  userId: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (Category as any).findOne({
    _id: categoryId,
    $or: [{ userId }, { userId: 'SYSTEM' }],
    deletedAt: null,
  });
}

export async function createCategory(
  input: CreateCategoryInput,
  userId: string
): Promise<CategoryType> {
  await connectDB();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const existingCategory = await (Category as any).findOne({
    name: input.name,
    type: input.type,
    userId,
    deletedAt: null,
  });

  if (existingCategory) {
    throw new Error('Category with this name and type already exists');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const category = await (Category as any).create({
    name: input.name,
    type: input.type,
    userId,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const categoryDoc = category as any;

  return {
    id: categoryDoc._id.toString(),
    name: category.name,
    type: category.type,
    userId: category.userId,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
    deletedAt: category.deletedAt || undefined,
  };
}

export async function getCategories(
  userId: string,
  type?: 'EXPENSE' | 'INCOME'
): Promise<CategoryType[]> {
  await connectDB();

  const orConditions: Array<{ userId: string; deletedAt: null; type?: 'EXPENSE' | 'INCOME' }> = [
    { userId, deletedAt: null },
    { userId: 'SYSTEM', deletedAt: null },
  ];

  if (type) {
    orConditions.forEach((condition) => {
      condition.type = type;
    });
  }

  const query: {
    $or: Array<{ userId: string; deletedAt: null; type?: 'EXPENSE' | 'INCOME' }>;
  } = {
    $or: orConditions,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const categories = await (Category as any).find(query).sort({ createdAt: -1 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return categories.map((cat: any) => ({
    id: cat._id.toString(),
    name: cat.name,
    type: cat.type,
    userId: cat.userId,
    createdAt: cat.createdAt,
    updatedAt: cat.updatedAt,
    deletedAt: cat.deletedAt || undefined,
  }));
}

export async function getCategoryById(
  categoryId: string,
  userId: string
): Promise<CategoryType | null> {
  await connectDB();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const category = await findCategoryById(categoryId, userId) as any;

  if (!category) {
    return null;
  }

  return {
    id: category._id.toString(),
    name: category.name,
    type: category.type,
    userId: category.userId,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
    deletedAt: category.deletedAt || undefined,
  };
}

export async function updateCategory(
  categoryId: string,
  input: UpdateCategoryInput,
  userId: string
): Promise<CategoryType> {
  await connectDB();

  const category = await findCategoryById(categoryId, userId);

  if (!category) {
    throw new Error('Category not found');
  }

  if (input.name || input.type) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const existingCategory = await (Category as any).findOne({
      name: input.name || category.name,
      type: input.type || category.type,
      userId,
      deletedAt: null,
      _id: { $ne: categoryId },
    });

    if (existingCategory) {
      throw new Error('Category with this name and type already exists');
    }
  }

  if (input.name) {
    category.name = input.name;
  }

  if (input.type) {
    category.type = input.type;
  }

  await category.save();

  return {
    id: category._id.toString(),
    name: category.name,
    type: category.type,
    userId: category.userId,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
    deletedAt: category.deletedAt || undefined,
  };
}

export async function deleteCategory(
  categoryId: string,
  userId: string
): Promise<void> {
  await connectDB();

  const category = await findCategoryById(categoryId, userId);

  if (!category) {
    throw new Error('Category not found');
  }

  category.deletedAt = new Date();
  await category.save();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (SubCategory as any).updateMany(
    {
      categoryId: categoryId,
      userId,
      deletedAt: null,
    },
    {
      deletedAt: new Date(),
    }
  );
}

export async function createSubCategory(
  input: CreateSubCategoryInput,
  userId: string
): Promise<SubCategoryType> {
  await connectDB();

  const category = await findCategoryById(input.categoryId, userId);

  if (!category) {
    throw new Error('Category not found');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const existingSubCategory = await (SubCategory as any).findOne({
    name: input.name,
    categoryId: input.categoryId,
    userId,
    deletedAt: null,
  });

  if (existingSubCategory) {
    throw new Error('Subcategory with this name already exists in this category');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const subCategory = await (SubCategory as any).create({
    name: input.name,
    categoryId: input.categoryId,
    userId,
  });

  return {
    id: subCategory._id.toString(),
    name: subCategory.name,
    categoryId: subCategory.categoryId,
    userId: subCategory.userId,
    createdAt: subCategory.createdAt,
    updatedAt: subCategory.updatedAt,
    deletedAt: subCategory.deletedAt || undefined,
  };
}

export async function getSubCategories(
  userId: string,
  categoryId?: string
): Promise<SubCategoryType[]> {
  await connectDB();

  const orConditions: Array<{ userId: string; deletedAt: null; categoryId?: string }> = [
    { userId, deletedAt: null },
    { userId: 'SYSTEM', deletedAt: null },
  ];

  if (categoryId) {
    orConditions.forEach((condition) => {
      condition.categoryId = categoryId;
    });
  }

  const query: {
    $or: Array<{ userId: string; deletedAt: null; categoryId?: string }>;
  } = {
    $or: orConditions,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const subCategories = await (SubCategory as any).find(query).sort({ createdAt: -1 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return subCategories.map((sub: any) => ({
    id: sub._id.toString(),
    name: sub.name,
    categoryId: sub.categoryId,
    userId: sub.userId,
    createdAt: sub.createdAt,
    updatedAt: sub.updatedAt,
    deletedAt: sub.deletedAt || undefined,
  }));
}

export async function getSubCategoryById(
  subCategoryId: string,
  userId: string
): Promise<SubCategoryType | null> {
  await connectDB();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const subCategory = await (SubCategory as any).findOne({
    _id: subCategoryId,
    $or: [{ userId }, { userId: 'SYSTEM' }],
    deletedAt: null,
  });

  if (!subCategory) {
    return null;
  }

  return {
    id: subCategory._id.toString(),
    name: subCategory.name,
    categoryId: subCategory.categoryId,
    userId: subCategory.userId,
    createdAt: subCategory.createdAt,
    updatedAt: subCategory.updatedAt,
    deletedAt: subCategory.deletedAt || undefined,
  };
}

export async function updateSubCategory(
  subCategoryId: string,
  input: UpdateSubCategoryInput,
  userId: string
): Promise<SubCategoryType> {
  await connectDB();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const subCategory = await (SubCategory as any).findOne({
    _id: subCategoryId,
    $or: [{ userId }, { userId: 'SYSTEM' }],
    deletedAt: null,
  });

  if (!subCategory) {
    throw new Error('Subcategory not found');
  }

  if (input.categoryId) {
    const category = await findCategoryById(input.categoryId, userId);

    if (!category) {
      throw new Error('Category not found');
    }
  }

  if (input.name || input.categoryId) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const existingSubCategory = await (SubCategory as any).findOne({
      name: input.name || subCategory.name,
      categoryId: input.categoryId || subCategory.categoryId,
      userId,
      deletedAt: null,
      _id: { $ne: subCategoryId },
    });

    if (existingSubCategory) {
      throw new Error(
        'Subcategory with this name already exists in this category'
      );
    }
  }

  if (input.name) {
    subCategory.name = input.name;
  }

  if (input.categoryId) {
    subCategory.categoryId = input.categoryId;
  }

  await subCategory.save();

  return {
    id: subCategory._id.toString(),
    name: subCategory.name,
    categoryId: subCategory.categoryId,
    userId: subCategory.userId,
    createdAt: subCategory.createdAt,
    updatedAt: subCategory.updatedAt,
    deletedAt: subCategory.deletedAt || undefined,
  };
}

export async function deleteSubCategory(
  subCategoryId: string,
  userId: string
): Promise<void> {
  await connectDB();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const subCategory = await (SubCategory as any).findOne({
    _id: subCategoryId,
    $or: [{ userId }, { userId: 'SYSTEM' }],
    deletedAt: null,
  });

  if (!subCategory) {
    throw new Error('Subcategory not found');
  }

  subCategory.deletedAt = new Date();
  await subCategory.save();
}

