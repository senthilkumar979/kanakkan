import { NextRequest } from 'next/server';
import {
  createCategoryController,
  getCategoriesController,
} from '@/modules/category/category.controller';
import { createCategorySchema } from '@/modules/category/category.schema';

export async function GET(req: NextRequest) {
  return getCategoriesController(req);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validationResult = createCategorySchema.safeParse(body);

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

    return createCategoryController(req);
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

