import { NextRequest } from 'next/server';
import { loginController } from '@/modules/auth/auth.controller';
import { loginSchema } from '@/modules/auth/auth.schema';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validationResult = loginSchema.safeParse(body);

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

    return loginController(validationResult.data);
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

