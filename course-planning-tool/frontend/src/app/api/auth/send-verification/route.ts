import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '@/services/emailService';
import { DatabaseService } from '@/services/databaseService';

// Generate a 6-digit verification code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const { eduEmail, firstName } = await request.json();

    // Validate input
    if (!eduEmail || !eduEmail.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      );
    }

    // Check if email is .edu domain
    if (!eduEmail.toLowerCase().includes('.edu')) {
      return NextResponse.json(
        { error: 'Please use your college .edu email address' },
        { status: 400 }
      );
    }

    // Generate new verification code
    const code = generateVerificationCode();

    // Store the code in database (10 minutes expiry)
    // Use fast method if enabled for quicker email delivery
    const useFastMethod = process.env.USE_FAST_VERIFICATION_TEMPLATES === 'true';
    const { success: storeSuccess, error: storeError } = useFastMethod
      ? await DatabaseService.storeVerificationCodeFast(eduEmail, code, 10)
      : await DatabaseService.storeVerificationCode(eduEmail, code, 10);

    if (!storeSuccess) {
      console.error('❌ Failed to store verification code:', storeError);
      return NextResponse.json(
        { error: 'Failed to prepare verification. Please try again.' },
        { status: 500 }
      );
    }

    // Send email
    try {
      await EmailService.sendVerificationCode({
        to: eduEmail,
        code,
        firstName
      });

      console.log(`✅ Verification code sent to ${eduEmail}`);
      
      return NextResponse.json({
        success: true,
        message: 'Verification code sent successfully',
        expiresIn: 600 // 10 minutes in seconds
      });

    } catch (emailError) {
      console.error('❌ Failed to send email:', emailError);
      
      return NextResponse.json(
        { error: 'Failed to send verification email. Please try again.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ Send verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to check if code exists (for debugging)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  
  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 });
  }
  
  // This would require a database query - for now just return basic info
  return NextResponse.json({
    message: 'Verification status check - database integration active'
  });
} 