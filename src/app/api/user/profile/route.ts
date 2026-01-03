import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getUserProfile, updateUserProfile } from '@/modules/auth/auth.service';
import { updateProfileSchema } from '@/modules/auth/auth.schema';
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import { setAuthCookies } from '@/lib/cookies';
import type { UserPayload } from '@/modules/auth/auth.types';

export async function GET() {
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

    const profile = await getUserProfile(user.userId);

    return NextResponse.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch profile',
      },
      { status: 500 }
    );
  }
}

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
    console.log('API Route - Raw body received:', JSON.stringify(body));

    const validationResult = updateProfileSchema.safeParse(body);

    if (!validationResult.success) {
      console.log('API Route - Validation failed:', validationResult.error.errors);
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    console.log('API Route - Validation result data:', JSON.stringify(validationResult.data));
    console.log('API Route - "name" in validationResult.data?', 'name' in validationResult.data);
    console.log('API Route - validationResult.data.name value:', validationResult.data.name);
    console.log('API Route - validationResult.data.name type:', typeof validationResult.data.name);

    // Build update data - always include name if it exists in the body (even if empty string)
    const updateData: { email?: string; name?: string } = {};
    if (validationResult.data.email !== undefined) {
      updateData.email = validationResult.data.email;
    }
    // Always check the original body for name first, as Zod might strip empty strings
    if ('name' in body) {
      updateData.name = body.name;
    } else if ('name' in validationResult.data) {
      updateData.name = validationResult.data.name;
    }

    console.log('API Route - Update data being sent to service:', JSON.stringify(updateData));

    const updatedProfile = await updateUserProfile(user.userId, updateData);
    
    console.log('API Route - Updated profile returned:', updatedProfile);

    // If email changed, generate new tokens
    if (validationResult.data.email && validationResult.data.email !== user.email) {
      const payload: UserPayload = {
        userId: updatedProfile.id,
        email: updatedProfile.email,
      };

      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      await setAuthCookies(accessToken, refreshToken);

      // Update refresh token in database
      const { User } = await import('@/modules/auth/auth.model');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const userDoc = await (User as any).findById(updatedProfile.id);
      if (userDoc) {
        userDoc.refreshToken = refreshToken;
        await userDoc.save({ validateBeforeSave: false });
      }
    }

    return NextResponse.json({
      success: true,
      data: updatedProfile,
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update profile',
      },
      { status: 400 }
    );
  }
}

