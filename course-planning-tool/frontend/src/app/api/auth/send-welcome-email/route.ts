import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '@/services/emailService';

export async function POST(request: NextRequest) {
  try {
    const { personalEmail, firstName, eduEmail, emailType = 'welcome' } = await request.json();

    // Validate input
    if (!personalEmail || !firstName) {
      return NextResponse.json(
        { error: 'Personal email and first name are required' },
        { status: 400 }
      );
    }

    try {
      let result;
      
      if (emailType === 'dual-verification-complete' && eduEmail) {
        // Send dual verification complete email
        result = await EmailService.sendDualVerificationCompleteEmail({
          to: personalEmail,
          firstName,
          eduEmail
        });
      } else {
        // Send regular welcome email
        result = await EmailService.sendWelcomeEmail({
          to: personalEmail,
          firstName,
          eduEmail
        });
      }

      if (!result.success) {
        throw new Error(result.error || 'Failed to send email');
      }

      console.log(`✅ ${emailType === 'dual-verification-complete' ? 'Dual verification complete' : 'Welcome'} email sent to ${personalEmail}`);
      
      return NextResponse.json({
        success: true,
        message: `${emailType === 'dual-verification-complete' ? 'Dual verification complete' : 'Welcome'} email sent successfully`,
        messageId: result.messageId
      });

    } catch (emailError) {
      console.error('❌ Failed to send welcome email:', emailError);
      
      return NextResponse.json(
        { error: 'Failed to send welcome email. Please try again.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ Send welcome email error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 