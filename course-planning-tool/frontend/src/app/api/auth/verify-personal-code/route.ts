import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/services/databaseService';

export async function POST(request: NextRequest) {
  try {
    const { personalEmail, code } = await request.json();

    // Validate input
    if (!personalEmail || !code) {
      return NextResponse.json(
        { error: 'Personal email and verification code are required' },
        { status: 400 }
      );
    }

    // Verify the code using the database
    const { success, error } = await DatabaseService.verifyEmailCode(personalEmail, code);
    
    if (!success) {
      const statusCode = error?.includes('expired') ? 410 :
                        error?.includes('Too many') ? 429 :
                        error?.includes('No verification') ? 404 : 400;
      
      return NextResponse.json(
        { error },
        { status: statusCode }
      );
    }

    console.log(`✅ Personal email verified successfully: ${personalEmail}`);

    return NextResponse.json({
      success: true,
      message: 'Personal email verified successfully',
      verified: true
    });

  } catch (error) {
    console.error('❌ Verify personal email code error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 