import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '@/services/emailService';
import { DatabaseService } from '@/services/databaseService';

// Generate a 6-digit verification code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const { personalEmail, firstName } = await request.json();

    // Validate input
    if (!personalEmail || !personalEmail.includes('@')) {
      return NextResponse.json(
        { error: 'Valid personal email address is required' },
        { status: 400 }
      );
    }

    // Check if email is NOT .edu domain (personal emails shouldn't be .edu)
    if (personalEmail.toLowerCase().includes('.edu')) {
      return NextResponse.json(
        { error: 'Please use a personal email address, not your .edu email' },
        { status: 400 }
      );
    }

    // Generate new verification code
    const code = generateVerificationCode();

    // Store the code in database (10 minutes expiry)
    // Use fast method if enabled for quicker email delivery
    const useFastMethod = process.env.USE_FAST_VERIFICATION_TEMPLATES === 'true';
    const { success: storeSuccess, error: storeError } = useFastMethod
      ? await DatabaseService.storeVerificationCodeFast(personalEmail, code, 10)
      : await DatabaseService.storeVerificationCode(personalEmail, code, 10);

    if (!storeSuccess) {
      console.error('❌ Failed to store personal email verification code:', storeError);
      return NextResponse.json(
        { error: 'Failed to prepare verification. Please try again.' },
        { status: 500 }
      );
    }

    // Send email
    try {
      await EmailService.sendVerificationCode({
        to: personalEmail,
        code,
        firstName,
        emailType: 'personal'
      });

      console.log(`✅ Personal email verification code sent to ${personalEmail}`);
      
      return NextResponse.json({
        success: true,
        message: 'Personal email verification code sent successfully',
        expiresIn: 600 // 10 minutes in seconds
      });

    } catch (emailError) {
      console.error('❌ Failed to send personal email verification:', emailError);
      
      return NextResponse.json(
        { error: 'Failed to send verification email. Please try again.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ Send personal verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 