import { NextRequest, NextResponse } from 'next/server';
import {
  registerUser,
  loginUser,
  refreshTokens,
  logoutUser,
} from './auth.service';
import {
  setAuthCookies,
  clearAuthCookies,
  getRefreshTokenFromCookie,
} from '@/lib/cookies';
import { verifyAccessToken } from '@/lib/jwt';
import { sendWelcomeEmail } from '@/modules/email/email.service';
import type { RegisterInput, LoginInput } from './auth.schema';

export async function registerController(
  input: RegisterInput
): Promise<NextResponse> {
  try {
    const result = await registerUser(input);

    await setAuthCookies(result.tokens.accessToken, result.tokens.refreshToken);

    // Send welcome email (non-blocking, optional)
    sendWelcomeEmail({ email: result.user.email }).catch((error) => {
      console.error('Failed to send welcome email:', error);
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          user: result.user,
          accessToken: result.tokens.accessToken,
          refreshToken: result.tokens.refreshToken,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Registration failed. Please try again.';

    const statusCode =
      error instanceof Error &&
      (error.message.includes('already exists') ||
        error.message.includes('Invalid') ||
        error.message.includes('Validation'))
        ? 400
        : 500;

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: statusCode }
    );
  }
}

export async function loginController(
  input: LoginInput
): Promise<NextResponse> {
  try {
    const result = await loginUser(input);

    await setAuthCookies(result.tokens.accessToken, result.tokens.refreshToken);

    return NextResponse.json(
      {
        success: true,
        data: {
          user: result.user,
          accessToken: result.tokens.accessToken,
          refreshToken: result.tokens.refreshToken,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Login failed',
      },
      { status: 500 }
    );
  }
}

export async function refreshController(
  _req: NextRequest
): Promise<NextResponse> {
  try {
    const refreshToken = await getRefreshTokenFromCookie();

    if (!refreshToken) {
      return NextResponse.json(
        {
          success: false,
          error: 'Refresh token not found',
        },
        { status: 401 }
      );
    }

    const tokens = await refreshTokens(refreshToken);

    await setAuthCookies(tokens.accessToken, tokens.refreshToken);

    return NextResponse.json(
      {
        success: true,
        data: {
          message: 'Tokens refreshed successfully',
        },
      },
      { status: 200 }
    );
  } catch (error) {
    await clearAuthCookies();

    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Token refresh failed',
      },
      { status: 500 }
    );
  }
}

export async function logoutController(
  req: NextRequest
): Promise<NextResponse> {
  try {
    const accessToken = req.cookies.get('accessToken')?.value;

    if (accessToken) {
      try {
        const decoded = verifyAccessToken(accessToken);
        await logoutUser(decoded.userId);
      } catch {
        // Token invalid or expired, continue with logout
      }
    }

    await clearAuthCookies();

    return NextResponse.json(
      {
        success: true,
        data: {
          message: 'Logged out successfully',
        },
      },
      { status: 200 }
    );
  } catch (error) {
    await clearAuthCookies();

    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Logout failed',
      },
      { status: 500 }
    );
  }
}
