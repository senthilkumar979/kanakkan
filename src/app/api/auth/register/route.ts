import { NextRequest } from 'next/server';
import { registerController } from '@/modules/auth/auth.controller';
import { registerSchema } from '@/modules/auth/auth.schema';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validationResult = registerSchema.safeParse(body);

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

    return await registerController(validationResult.data);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred';

    return Response.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
