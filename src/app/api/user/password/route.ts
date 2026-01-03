import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { updateUserPassword } from '@/modules/auth/auth.service';
import { updatePasswordSchema } from '@/modules/auth/auth.schema';

export async function PATCH(req: NextRequest) {
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
    const validationResult = updatePasswordSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    await updateUserPassword(
      user.userId,
      validationResult.data.currentPassword,
      validationResult.data.newPassword
    );

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    console.error('Error updating password:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update password',
      },
      { status: 400 }
    );
  }
}

