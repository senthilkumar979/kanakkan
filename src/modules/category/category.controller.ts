import { NextRequest, NextResponse } from 'next/server';
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  createSubCategory,
  getSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory as deleteSubCategoryService,
} from './category.service';
import { getCurrentUser } from '@/lib/auth';
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
  CreateSubCategoryInput,
  UpdateSubCategoryInput,
} from './category.schema';

export async function createCategoryController(
  req: NextRequest
): Promise<NextResponse> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    const body = await req.json();
    const input: CreateCategoryInput = {
      name: body.name,
      type: body.type,
    };

    const category = await createCategory(input, user.userId);

    return NextResponse.json(
      {
        success: true,
        data: category,
      },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to create category';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 400 }
    );
  }
}

export async function getCategoriesController(
  req: NextRequest
): Promise<NextResponse> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') as 'EXPENSE' | 'INCOME' | null;

    const categories = await getCategories(user.userId, type || undefined);

    return NextResponse.json(
      {
        success: true,
        data: categories,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch categories';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function getCategoryController(
  req: NextRequest,
  categoryId: string
): Promise<NextResponse> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    const category = await getCategoryById(categoryId, user.userId);

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: 'Category not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: category,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch category';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function updateCategoryController(
  input: UpdateCategoryInput,
  categoryId: string
): Promise<NextResponse> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    const category = await updateCategory(categoryId, input, user.userId);

    return NextResponse.json(
      {
        success: true,
        data: category,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to update category';

    const statusCode = error instanceof Error && error.message.includes('not found')
      ? 404
      : 400;

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: statusCode }
    );
  }
}

export async function deleteCategoryController(
  _req: NextRequest,
  categoryId: string
): Promise<NextResponse> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    await deleteCategory(categoryId, user.userId);

    return NextResponse.json(
      {
        success: true,
        data: { message: 'Category deleted successfully' },
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to delete category';

    const statusCode = error instanceof Error && error.message.includes('not found')
      ? 404
      : 400;

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: statusCode }
    );
  }
}

export async function createSubCategoryController(
  req: NextRequest
): Promise<NextResponse> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    const body = await req.json();
    const input: CreateSubCategoryInput = {
      name: body.name,
      categoryId: body.categoryId,
    };

    const subCategory = await createSubCategory(input, user.userId);

    return NextResponse.json(
      {
        success: true,
        data: subCategory,
      },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to create subcategory';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 400 }
    );
  }
}

export async function getSubCategoriesController(
  req: NextRequest
): Promise<NextResponse> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId') || undefined;

    const subCategories = await getSubCategories(user.userId, categoryId);

    return NextResponse.json(
      {
        success: true,
        data: subCategories,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch subcategories';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function getSubCategoryController(
  _req: NextRequest,
  subCategoryId: string
): Promise<NextResponse> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    const subCategory = await getSubCategoryById(subCategoryId, user.userId);

    if (!subCategory) {
      return NextResponse.json(
        {
          success: false,
          error: 'Subcategory not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: subCategory,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch subcategory';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function updateSubCategoryController(
  input: UpdateSubCategoryInput,
  subCategoryId: string
): Promise<NextResponse> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    const subCategory = await updateSubCategory(
      subCategoryId,
      input,
      user.userId
    );

    return NextResponse.json(
      {
        success: true,
        data: subCategory,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to update subcategory';

    const statusCode = error instanceof Error && error.message.includes('not found')
      ? 404
      : 400;

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: statusCode }
    );
  }
}

export async function deleteSubCategoryController(
  _req: NextRequest,
  subCategoryId: string
): Promise<NextResponse> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    await deleteSubCategoryService(subCategoryId, user.userId);

    return NextResponse.json(
      {
        success: true,
        data: { message: 'Subcategory deleted successfully' },
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to delete subcategory';

    const statusCode = error instanceof Error && error.message.includes('not found')
      ? 404
      : 400;

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: statusCode }
    );
  }
}

