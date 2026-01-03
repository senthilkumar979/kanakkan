import { NextRequest, NextResponse } from 'next/server';
import { requestPasswordReset } from '@/modules/auth/auth.service';
import { forgotPasswordSchema } from '@/modules/auth/auth.schema';
import { sendPasswordResetEmail } from '@/modules/email/email.service';
import { User } from '@/modules/auth/auth.model';
import connectDB from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validationResult = forgotPasswordSchema.safeParse(body);

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

    await connectDB();

    // Get user to include name in email if available
    const user = await User.findOne({ email: validationResult.data.email });

    try {
      const { token } = await requestPasswordReset(validationResult.data.email);

      // Send password reset email (non-blocking)
      sendPasswordResetEmail({
        email: validationResult.data.email,
        name: user?.name || undefined,
        resetToken: token,
      }).catch((error) => {
        console.error('Failed to send password reset email:', error);
      });

      // Always return success (security best practice - don't reveal if email exists)
      return NextResponse.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.',
      });
    } catch (error) {
      // Still return success to prevent email enumeration
      // The error message from requestPasswordReset already doesn't reveal if email exists
      return NextResponse.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.',
      });
    }
  } catch (error) {
    console.error('Error in forgot password:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred. Please try again later.',
      },
      { status: 500 }
    );
  }
}

