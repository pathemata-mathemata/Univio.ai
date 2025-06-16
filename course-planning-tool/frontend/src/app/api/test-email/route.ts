import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '@/services/emailService';

export async function POST(request: NextRequest) {
  try {
    const { email, type = 'verification' } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      );
    }

    if (type === 'verification') {
      // Test verification email
      await EmailService.sendVerificationCode({
        to: email,
        code: '123456',
        firstName: 'Test User'
      });

      return NextResponse.json({
        success: true,
        message: 'Test verification email sent successfully',
        type: 'verification'
      });
    } else if (type === 'welcome') {
      // Test welcome email
      await EmailService.sendWelcomeEmail({
        to: email,
        firstName: 'Test User'
      });

      return NextResponse.json({
        success: true,
        message: 'Test welcome email sent successfully',
        type: 'welcome'
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid email type. Use "verification" or "welcome"' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('❌ Test email error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send test email',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 