// JWT Logout API route for Spring Boot backend integration
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const SPRING_BACKEND_URL = process.env.SPRING_BACKEND_URL || 'http://localhost:8080';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('travdy_token')?.value;

    // Even if no token, we'll clear cookies and return success
    if (token) {
      try {
        // Notify Spring Boot backend about logout (optional - for token blacklisting)
        await fetch(`${SPRING_BACKEND_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
      } catch (error) {
        // If backend logout fails, we still proceed to clear cookies
        console.warn('Backend logout failed:', error);
      }
    }

    // Clear authentication cookies
    cookieStore.delete('travdy_token');
    cookieStore.delete('travdy_refresh_token');

    return NextResponse.json({
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    
    // Even on error, try to clear cookies
    try {
      const cookieStore = await cookies();
      cookieStore.delete('travdy_token');
      cookieStore.delete('travdy_refresh_token');
    } catch (cookieError) {
      console.error('Failed to clear cookies:', cookieError);
    }

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
