// JWT Authentication API route for Spring Boot backend integration
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const SPRING_BACKEND_URL = process.env.SPRING_BACKEND_URL || 'http://localhost:8080';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, remember } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: { message: 'Email and password are required' } },
        { status: 400 }
      );
    }

    // Forward request to Spring Boot backend
    const response = await fetch(`${SPRING_BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, remember }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { 
          error: { 
            message: errorData.message || 'Authentication failed',
            code: errorData.code || 'AUTH_FAILED'
          } 
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    const { token, user, refreshToken } = data;

    // Create the response
    const nextResponse = NextResponse.json({
      user,
      token,
      message: 'Login successful'
    });

    // Set HTTP-only cookies for tokens (more secure than localStorage)
    const cookieStore = await cookies();
    const tokenExpiry = remember ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 30 days or 1 day
    
    cookieStore.set('travdy_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: tokenExpiry / 1000, // maxAge is in seconds
      path: '/',
    });

    if (refreshToken) {
      cookieStore.set('travdy_refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: (remember ? 30 : 7) * 24 * 60 * 60, // 30 days or 7 days
        path: '/',
      });
    }

    return nextResponse;
  } catch (error) {
    console.error('Login error:', error);
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
