import { NextRequest } from 'next/server';
import {
  getCategoryController,
  updateCategoryController,
  deleteCategoryController,
} from '@/modules/category/category.controller';
import { updateCategorySchema } from '@/modules/category/category.schema';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return getCategoryController(req, params.id);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const validationResult = updateCategorySchema.safeParse(body);

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

    return updateCategoryController(validationResult.data, params.id);
  } catch {
    return Response.json(
      {
        success: false,
        error: 'Invalid request',
      },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return deleteCategoryController(req, params.id);
}

