import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '@/services/emailService';

export async function POST(request: NextRequest) {
  try {
    const { 
      email, 
      firstName = 'Test User',
      eduEmail = 'test@college.edu',
      type = 'verification-edu' 
    } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case 'verification-edu':
        // Test educational email verification
        result = await EmailService.sendVerificationCode({
          to: email,
          code: '123456',
          firstName,
          emailType: 'edu'
        });
        break;

      case 'verification-personal':
        // Test personal email verification
        result = await EmailService.sendVerificationCode({
          to: email,
          code: '654321',
          firstName,
          emailType: 'personal'
        });
        break;

      case 'welcome':
        // Test welcome email
        result = await EmailService.sendWelcomeEmail({
          to: email,
          firstName,
          eduEmail
        });
        break;

      case 'dual-verification-complete':
        // Test dual verification complete email
        result = await EmailService.sendDualVerificationCompleteEmail({
          to: email,
          firstName,
          eduEmail
        });
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid email type. Use: verification-edu, verification-personal, welcome, or dual-verification-complete' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: `Test ${type} email sent successfully`,
      type,
      messageId: result.messageId
    });

  } catch (error) {
    console.error('❌ Test dual email error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send test email',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 