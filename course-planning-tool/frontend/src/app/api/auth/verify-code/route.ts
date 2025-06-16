import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/services/databaseService';

export async function POST(request: NextRequest) {
  try {
    const { eduEmail, code } = await request.json();

    // Validate input
    if (!eduEmail || !code) {
      return NextResponse.json(
        { error: 'Email and verification code are required' },
        { status: 400 }
      );
    }

    // Verify the code using the database
    const { success, error } = await DatabaseService.verifyEmailCode(eduEmail, code);
    
    if (!success) {
      const statusCode = error?.includes('expired') ? 410 :
                        error?.includes('Too many') ? 429 :
                        error?.includes('No verification') ? 404 : 400;
      
      return NextResponse.json(
        { error },
        { status: statusCode }
      );
    }

    console.log(`✅ Email verified successfully: ${eduEmail}`);

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully',
      verified: true
    });

  } catch (error) {
    console.error('❌ Verify code error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 