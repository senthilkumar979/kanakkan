import { NextRequest, NextResponse } from 'next/server';
import { resetPasswordWithToken } from '@/modules/auth/auth.service';
import { resetPasswordSchema } from '@/modules/auth/auth.schema';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validationResult = resetPasswordSchema.safeParse(body);

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

    await resetPasswordWithToken(
      validationResult.data.token,
      validationResult.data.newPassword
    );

    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully. You can now login with your new password.',
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to reset password. The link may be invalid or expired.',
      },
      { status: 400 }
    );
  }
}

