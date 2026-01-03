import { NextRequest } from 'next/server';
import {
  getSubCategoryController,
  updateSubCategoryController,
  deleteSubCategoryController,
} from '@/modules/category/category.controller';
import { updateSubCategorySchema } from '@/modules/category/category.schema';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return getSubCategoryController(req, params.id);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const validationResult = updateSubCategorySchema.safeParse(body);

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

    return updateSubCategoryController(validationResult.data, params.id);
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return deleteSubCategoryController(req, params.id);
}

