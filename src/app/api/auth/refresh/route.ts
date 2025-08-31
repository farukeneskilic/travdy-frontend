// JWT Token Refresh API route for Spring Boot backend integration
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const SPRING_BACKEND_URL = process.env.SPRING_BACKEND_URL || 'http://localhost:8080';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('travdy_refresh_token')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: { message: 'Refresh token not found', code: 'NO_REFRESH_TOKEN' } },
        { status: 401 }
      );
    }

    // Forward request to Spring Boot backend
    const response = await fetch(`${SPRING_BACKEND_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${refreshToken}`,
      },
    });

    if (!response.ok) {
      // Clear invalid refresh token
      cookieStore.delete('travdy_refresh_token');
      cookieStore.delete('travdy_token');

      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { 
          error: { 
            message: errorData.message || 'Token refresh failed',
            code: errorData.code || 'REFRESH_FAILED'
          } 
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    const { token, user, refreshToken: newRefreshToken } = data;

    // Create the response
    const nextResponse = NextResponse.json({
      user,
      token,
      message: 'Token refreshed successfully'
    });

    // Update cookies with new tokens
    cookieStore.set('travdy_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 1 day
      path: '/',
    });

    if (newRefreshToken) {
      cookieStore.set('travdy_refresh_token', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/',
      });
    }

    return nextResponse;
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { 
        error: { 
          message: 'Internal server error',
          code: 'INTERNAL_ERROR'
        } 
      },
      { status: 500 }
    );
  }
}
