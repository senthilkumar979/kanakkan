export type CategoryType = 'EXPENSE' | 'INCOME';

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface SubCategory {
  id: string;
  name: string;
  categoryId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface CreateCategoryInput {
  name: string;
  type: CategoryType;
}

export interface UpdateCategoryInput {
  name?: string;
  type?: CategoryType;
}

export interface CreateSubCategoryInput {
  name: string;
  categoryId: string;
}

export interface UpdateSubCategoryInput {
  name?: string;
  categoryId?: string;
}

