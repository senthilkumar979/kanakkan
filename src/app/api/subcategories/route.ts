import { NextRequest } from 'next/server';
import {
  createSubCategoryController,
  getSubCategoriesController,
} from '@/modules/category/category.controller';
import { createSubCategorySchema } from '@/modules/category/category.schema';

export async function GET(req: NextRequest) {
  return getSubCategoriesController(req);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validationResult = createSubCategorySchema.safeParse(body);

    if (!validationResult.success) {
      return Response.json(
        {
          success: false,
          error: 'Validation failed',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    return createSubCategoryController(req);
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: 'Invalid request',
      },
      { status: 400 }
    );
  }
}

