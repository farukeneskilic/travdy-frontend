// JWT Registration API route for Spring Boot backend integration
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const SPRING_BACKEND_URL = process.env.SPRING_BACKEND_URL || 'http://localhost:8080';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      email, 
      password, 
      fullName, 
      contactNumber, 
      birthDate, 
      countryOfResidence, 
      preferredLanguage, 
      wantsTravelTips 
    } = body;

    // Validate required fields
    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: { message: 'Email, password, and full name are required' } },
        { status: 400 }
      );
    }

    // Prepare data for Spring Boot backend
    const registrationData = {
      email,
      password,
      fullName,
      contactNumber: contactNumber || null,
      birthDate: birthDate ? new Date(birthDate).toISOString() : null,
      countryOfResidence: countryOfResidence || null,
      preferredLanguage: preferredLanguage || 'english',
      wantsTravelTips: wantsTravelTips !== undefined ? wantsTravelTips : true,
    };

    // Forward request to Spring Boot backend
    const response = await fetch(`${SPRING_BACKEND_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { 
          error: { 
            message: errorData.message || 'Registration failed',
            code: errorData.code || 'REGISTRATION_FAILED',
            details: errorData.details || null
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
      message: 'Registration successful'
    });

    // Set HTTP-only cookies for tokens
    const cookieStore = await cookies();
    const tokenExpiry = 24 * 60 * 60 * 1000; // 1 day for initial registration
    
    cookieStore.set('travdy_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: tokenExpiry / 1000,
      path: '/',
    });

    if (refreshToken) {
      cookieStore.set('travdy_refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/',
      });
    }

    return nextResponse;
  } catch (error) {
    console.error('Registration error:', error);
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
