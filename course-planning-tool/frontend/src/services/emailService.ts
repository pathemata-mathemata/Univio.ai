import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';

// Initialize Resend with your API key, handle build time gracefully
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

interface VerificationEmailData {
  to: string;
  code: string;
  firstName?: string;
  emailType?: 'edu' | 'personal';
}

interface WelcomeEmailData {
  to: string;
  firstName: string;
  eduEmail?: string;
}

export class EmailService {
  /**
   * Get logo URL for emails - using a reliable public URL
   */
  private static getLogoUrl() {
    // For production, you should use a CDN or public URL
    // For now, we'll use a simple text-based logo as fallback
    return null; // We'll use text-based branding instead
  }

  /**
   * Send verification code to user's email (edu or personal)
   */
  static async sendVerificationCode({ to, code, firstName, emailType = 'edu' }: VerificationEmailData) {
    try {
      if (!resend) {
        throw new Error('Email service not available - missing API key');
      }

      const isEduEmail = emailType === 'edu';
      const subject = isEduEmail 
        ? 'Verify Your Student Email - UniVio' 
        : 'Verify Your Personal Email - UniVio';

      const emailData: any = {
        from: `UniVio <noreply@univio.ai>`,
        to: [to],
        subject,
        html: isEduEmail 
          ? this.getEduVerificationEmailTemplate(code, firstName)
          : this.getPersonalVerificationEmailTemplate(code, firstName),
        text: `Your UniVio verification code is: ${code}. This code will expire in 10 minutes.`,
      };

      const { data, error } = await resend.emails.send(emailData);

      if (error) {
        console.error('❌ Email sending error:', error);
        throw new Error(`Failed to send email: ${error.message}`);
      }

      console.log(`✅ ${isEduEmail ? 'Educational' : 'Personal'} verification email sent successfully:`, data);
      return { success: true, messageId: data?.id };
    } catch (error) {
      console.error('❌ Email service error:', error);
      throw error;
    }
  }

  /**
   * Send welcome email after successful verification
   */
  static async sendWelcomeEmail({ to, firstName, eduEmail }: WelcomeEmailData) {
    try {
      if (!resend) {
        return { success: false, error: 'Email service not available - missing API key' };
      }

      const emailData: any = {
        from: `UniVio <noreply@univio.ai>`,
        to: [to],
        subject: '🎓 Welcome to UniVio - Your Transfer Journey Begins!',
        html: this.getWelcomeEmailTemplate(firstName, eduEmail),
        text: `Welcome to UniVio, ${firstName}! Your account has been successfully created and verified.`,
      };

      const { data, error } = await resend.emails.send(emailData);

      if (error) {
        console.error('❌ Welcome email error:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Welcome email sent successfully:', data);
      return { success: true, messageId: data?.id };
    } catch (error) {
      console.error('❌ Welcome email service error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Send dual verification completion email
   */
  static async sendDualVerificationCompleteEmail({ to, firstName, eduEmail }: WelcomeEmailData) {
    try {
      if (!resend) {
        return { success: false, error: 'Email service not available - missing API key' };
      }

      const emailData: any = {
        from: `UniVio <noreply@univio.ai>`,
        to: [to],
        subject: '✅ Both Emails Verified - UniVio Account Ready!',
        html: this.getDualVerificationCompleteTemplate(firstName, eduEmail),
        text: `Great news ${firstName}! Both your personal and educational emails have been verified. Your UniVio account is now fully activated.`,
      };

      const { data, error } = await resend.emails.send(emailData);

      if (error) {
        console.error('❌ Dual verification email error:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Dual verification complete email sent successfully:', data);
      return { success: true, messageId: data?.id };
    } catch (error) {
      console.error('❌ Dual verification email service error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * HTML template for educational email verification
   */
  private static getEduVerificationEmailTemplate(code: string, firstName?: string): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email - UniVio</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8f9fa;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #2B4F7D 0%, #1E3A5F 100%); padding: 40px 30px; text-align: center;">
          <!-- Logo -->
          <div style="margin-bottom: 20px;">
            <div style="background: linear-gradient(135deg, #FFE066 0%, #FCD34D 100%); color: #1E3A5F; padding: 15px 25px; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 24px; letter-spacing: 2px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              UNIVIO.AI
            </div>
          </div>
          <h1 style="color: #FFE066; margin: 0; font-size: 28px; font-weight: bold;">UNIVIO.AI</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Your AI-Powered Transfer Planning Companion</p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
          <h2 style="color: #111416; margin: 0 0 20px 0; font-size: 24px;">
            ${firstName ? `Hi ${firstName}!` : 'Hi there!'}
          </h2>
          
          <p style="color: #607589; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
            Thanks for joining UniVio! To complete your registration and verify your student status, please use the verification code below:
          </p>

          <!-- Verification Code Box -->
          <div style="background-color: #f8f9fa; border: 2px solid #e5e8ea; border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0;">
            <p style="color: #607589; margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
              Your Verification Code
            </p>
            <div style="font-size: 36px; font-weight: bold; color: #111416; letter-spacing: 8px; font-family: 'Courier New', monospace;">
              ${code}
            </div>
            <p style="color: #607589; margin: 15px 0 0 0; font-size: 14px;">
              This code will expire in 10 minutes
            </p>
          </div>

          <div style="background-color: #e8f4fd; border-left: 4px solid #2B4F7D; padding: 20px; margin: 30px 0;">
            <h3 style="color: #1E3A5F; margin: 0 0 10px 0; font-size: 16px;">🎓 Why verify your .edu email?</h3>
            <ul style="color: #607589; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.6;">
              <li>Confirms your current student status</li>
              <li>Unlocks student-specific features</li>
              <li>Ensures accurate transfer planning</li>
              <li>Connects you with your institution's resources</li>
            </ul>
          </div>

          <p style="color: #607589; font-size: 16px; line-height: 1.6; margin: 30px 0 0 0;">
            If you didn't request this verification, you can safely ignore this email.
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e5e8ea;">
          <p style="color: #607589; margin: 0; font-size: 14px;">
            © 2024 UniVio. All rights reserved.
          </p>
          <p style="color: #607589; margin: 10px 0 0 0; font-size: 12px;">
            This email was sent to verify your student status for UniVio.
          </p>
        </div>
      </div>
    </body>
    </html>
    `;
  }

  /**
   * HTML template for personal email verification
   */
  private static getPersonalVerificationEmailTemplate(code: string, firstName?: string): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Personal Email - UniVio</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8f9fa;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); padding: 40px 30px; text-align: center;">
          <!-- Logo -->
          <div style="margin-bottom: 20px;">
            <div style="background: linear-gradient(135deg, #FFE066 0%, #FCD34D 100%); color: #1E3A5F; padding: 15px 25px; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 24px; letter-spacing: 2px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              UNIVIO.AI
            </div>
          </div>
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Verify Personal Email</h1>
          <p style="color: #e0f2fe; margin: 10px 0 0 0; font-size: 16px;">Secure your UniVio account</p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
          <h2 style="color: #111416; margin: 0 0 20px 0; font-size: 24px;">
            ${firstName ? `Hi ${firstName}!` : 'Hi there!'}
          </h2>
          
          <p style="color: #607589; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
            We need to verify your personal email address to secure your account and enable important notifications. Please use the verification code below:
          </p>

          <!-- Verification Code Box -->
          <div style="background-color: #f8f9fa; border: 2px solid #e5e8ea; border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0;">
            <p style="color: #607589; margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
              Your Verification Code
            </p>
            <div style="font-size: 36px; font-weight: bold; color: #111416; letter-spacing: 8px; font-family: 'Courier New', monospace;">
              ${code}
            </div>
            <p style="color: #607589; margin: 15px 0 0 0; font-size: 14px;">
              This code will expire in 10 minutes
            </p>
          </div>

          <div style="background-color: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 20px; margin: 30px 0;">
            <h3 style="color: #0c4a6e; margin: 0 0 10px 0; font-size: 16px;">🔒 Why verify your personal email?</h3>
            <ul style="color: #607589; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.6;">
              <li>Secure your account with two-factor authentication</li>
              <li>Receive important account notifications</li>
              <li>Enable password reset functionality</li>
              <li>Get updates about your transfer planning progress</li>
            </ul>
          </div>

          <p style="color: #607589; font-size: 16px; line-height: 1.6; margin: 30px 0 0 0;">
            If you didn't request this verification, you can safely ignore this email.
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e5e8ea;">
          <p style="color: #607589; margin: 0; font-size: 14px;">
            © 2024 UniVio. All rights reserved.
          </p>
          <p style="color: #607589; margin: 10px 0 0 0; font-size: 12px;">
            This email was sent to secure your personal account for UniVio.
          </p>
        </div>
      </div>
    </body>
    </html>
    `;
  }

  /**
   * HTML template for welcome email
   */
  private static getWelcomeEmailTemplate(firstName: string, eduEmail?: string): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to UniVio!</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8f9fa;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        
                 <!-- Header -->
         <div style="background: linear-gradient(135deg, #2B4F7D 0%, #1E3A5F 100%); padding: 50px 30px; text-align: center;">
           <!-- Logo -->
           <div style="margin-bottom: 25px;">
             <div style="background: linear-gradient(135deg, #FFE066 0%, #FCD34D 100%); color: #1E3A5F; padding: 18px 30px; border-radius: 10px; display: inline-block; font-weight: bold; font-size: 28px; letter-spacing: 2px; box-shadow: 0 3px 6px rgba(0,0,0,0.15);">
               UNIVIO.AI
             </div>
           </div>
           <h1 style="color: #FFE066; margin: 0; font-size: 32px; font-weight: bold;">🎉 WELCOME TO UNIVIO!</h1>
           <p style="color: white; margin: 15px 0 0 0; font-size: 18px;">Your transfer journey starts here</p>
         </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
          <h2 style="color: #111416; margin: 0 0 20px 0; font-size: 26px;">
            Welcome aboard, ${firstName}! 🚀
          </h2>
          
          <p style="color: #607589; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
            Congratulations on taking the first step toward your transfer success! Your UniVio account is now active and ready to help you navigate your academic journey.
          </p>

          <!-- What's Next Section -->
          <div style="background-color: #f8f9fa; border-radius: 8px; padding: 30px; margin: 30px 0;">
            <h3 style="color: #111416; margin: 0 0 20px 0; font-size: 20px;">🎯 What's next?</h3>
            <div style="space-y: 15px;">
              <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
                <div style="background-color: #2B4F7D; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; margin-right: 15px; flex-shrink: 0;">1</div>
                <div>
                  <h4 style="color: #111416; margin: 0 0 5px 0; font-size: 16px;">Complete Your Academic Profile</h4>
                  <p style="color: #607589; margin: 0; font-size: 14px;">Add your current courses, GPA, and transfer goals</p>
                </div>
              </div>
              <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
                <div style="background-color: #2B4F7D; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; margin-right: 15px; flex-shrink: 0;">2</div>
                <div>
                  <h4 style="color: #111416; margin: 0 0 5px 0; font-size: 16px;">Explore Transfer Requirements</h4>
                  <p style="color: #607589; margin: 0; font-size: 14px;">Discover what courses you need for your target schools</p>
                </div>
              </div>
              <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
                <div style="background-color: #2B4F7D; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; margin-right: 15px; flex-shrink: 0;">3</div>
                <div>
                  <h4 style="color: #111416; margin: 0 0 5px 0; font-size: 16px;">Get AI-Powered Recommendations</h4>
                  <p style="color: #607589; margin: 0; font-size: 14px;">Receive personalized course planning and transfer advice</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Features Highlight -->
          <div style="background: linear-gradient(135deg, #e8f4fd 0%, #f0f9ff 100%); border-radius: 8px; padding: 30px; margin: 30px 0;">
            <h3 style="color: #1E3A5F; margin: 0 0 20px 0; font-size: 20px;">✨ What makes UniVio special?</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div>
                <h4 style="color: #2B4F7D; margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">🤖 AI-Powered Planning</h4>
                <p style="color: #607589; margin: 0; font-size: 13px;">Smart recommendations tailored to your goals</p>
              </div>
              <div>
                <h4 style="color: #2B4F7D; margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">📊 Real-Time Tracking</h4>
                <p style="color: #607589; margin: 0; font-size: 13px;">Monitor your transfer progress instantly</p>
              </div>
              <div>
                <h4 style="color: #2B4F7D; margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">🎯 Goal-Oriented</h4>
                <p style="color: #607589; margin: 0; font-size: 13px;">Stay focused on your transfer objectives</p>
              </div>
              <div>
                <h4 style="color: #2B4F7D; margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">📚 Comprehensive Data</h4>
                <p style="color: #607589; margin: 0; font-size: 13px;">Access to extensive course and school info</p>
              </div>
            </div>
          </div>

          ${eduEmail ? `
          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 30px 0;">
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
              <span style="font-size: 20px; margin-right: 10px;">🎓</span>
              <h4 style="color: #15803d; margin: 0; font-size: 16px;">Student Status Verified</h4>
            </div>
            <p style="color: #166534; margin: 0; font-size: 14px;">
              Your student email <strong>${eduEmail}</strong> has been verified, unlocking all student-specific features and resources.
            </p>
          </div>
          ` : ''}

          <!-- CTA Button -->
          <div style="text-align: center; margin: 40px 0;">
            <a href="https://univio.ai/dashboard" style="background: linear-gradient(135deg, #2B4F7D 0%, #1E3A5F 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
              Start Your Transfer Journey →
            </a>
          </div>

          <p style="color: #607589; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0; text-align: center;">
            Need help getting started? Reply to this email or visit our <a href="https://univio.ai/help" style="color: #2B4F7D;">Help Center</a>.
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e5e8ea;">
          <p style="color: #607589; margin: 0 0 10px 0; font-size: 14px;">
            © 2024 UniVio. All rights reserved.
          </p>
          <p style="color: #607589; margin: 0; font-size: 12px;">
            You're receiving this because you created a UniVio account.
          </p>
          <div style="margin-top: 20px;">
            <a href="https://univio.ai" style="color: #607589; text-decoration: none; margin: 0 10px; font-size: 12px;">Website</a>
            <a href="https://univio.ai/help" style="color: #607589; text-decoration: none; margin: 0 10px; font-size: 12px;">Help</a>
            <a href="https://univio.ai/privacy" style="color: #607589; text-decoration: none; margin: 0 10px; font-size: 12px;">Privacy</a>
          </div>
        </div>
      </div>
    </body>
    </html>
    `;
  }

  /**
   * HTML template for dual verification complete email
   */
  private static getDualVerificationCompleteTemplate(firstName: string, eduEmail?: string): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Account Fully Verified - UniVio</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8f9fa;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        
                 <!-- Header -->
         <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 40px 30px; text-align: center;">
           <!-- Logo -->
           <div style="margin-bottom: 20px;">
             <div style="background: linear-gradient(135deg, #FFE066 0%, #FCD34D 100%); color: #1E3A5F; padding: 15px 25px; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 24px; letter-spacing: 2px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
               UNIVIO.AI
             </div>
           </div>
           <div style="font-size: 48px; margin-bottom: 10px;">🎉</div>
           <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Account Fully Verified!</h1>
           <p style="color: #d1fae5; margin: 10px 0 0 0; font-size: 16px;">Both emails confirmed - You're all set!</p>
         </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
          <h2 style="color: #111416; margin: 0 0 20px 0; font-size: 24px;">
            Excellent work, ${firstName}! ✅
          </h2>
          
          <p style="color: #607589; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
            Both your personal and educational email addresses have been successfully verified. Your UniVio account is now fully activated and ready to help you achieve your transfer goals!
          </p>

          <!-- Verification Status -->
          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 25px; margin: 30px 0;">
            <h3 style="color: #15803d; margin: 0 0 15px 0; font-size: 18px;">✅ Verification Complete</h3>
            <div style="space-y: 10px;">
              <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <span style="color: #15803d; margin-right: 10px; font-size: 16px;">✓</span>
                <span style="color: #166534; font-size: 14px;"><strong>Personal Email:</strong> Verified for account security</span>
              </div>
              ${eduEmail ? `
              <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <span style="color: #15803d; margin-right: 10px; font-size: 16px;">✓</span>
                <span style="color: #166534; font-size: 14px;"><strong>Student Email:</strong> ${eduEmail} - Student status confirmed</span>
              </div>
              ` : ''}
              <div style="display: flex; align-items: center;">
                <span style="color: #15803d; margin-right: 10px; font-size: 16px;">✓</span>
                <span style="color: #166534; font-size: 14px;"><strong>Account Status:</strong> Fully activated and ready to use</span>
              </div>
            </div>
          </div>

          <!-- Next Steps -->
          <div style="background: linear-gradient(135deg, #e8f4fd 0%, #f0f9ff 100%); border-radius: 8px; padding: 30px; margin: 30px 0;">
            <h3 style="color: #1E3A5F; margin: 0 0 20px 0; font-size: 20px;">🚀 Ready to start planning?</h3>
            <div style="space-y: 15px;">
              <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
                <div style="background-color: #2B4F7D; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; margin-right: 15px; flex-shrink: 0;">1</div>
                <div>
                  <h4 style="color: #111416; margin: 0 0 5px 0; font-size: 16px;">Set Up Your Academic Profile</h4>
                  <p style="color: #607589; margin: 0; font-size: 14px;">Tell us about your current courses and transfer goals</p>
                </div>
              </div>
              <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
                <div style="background-color: #2B4F7D; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; margin-right: 15px; flex-shrink: 0;">2</div>
                <div>
                  <h4 style="color: #111416; margin: 0 0 5px 0; font-size: 16px;">Get Your Personalized Plan</h4>
                  <p style="color: #607589; margin: 0; font-size: 14px;">Receive AI-powered course recommendations</p>
                </div>
              </div>
              <div style="display: flex; align-items: flex-start;">
                <div style="background-color: #2B4F7D; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; margin-right: 15px; flex-shrink: 0;">3</div>
                <div>
                  <h4 style="color: #111416; margin: 0 0 5px 0; font-size: 16px;">Track Your Progress</h4>
                  <p style="color: #607589; margin: 0; font-size: 14px;">Monitor your transfer readiness in real-time</p>
                </div>
              </div>
            </div>
          </div>

          <!-- CTA Button -->
          <div style="text-align: center; margin: 40px 0;">
            <a href="https://univio.ai/dashboard" style="background: linear-gradient(135deg, #2B4F7D 0%, #1E3A5F 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
              Access Your Dashboard →
            </a>
          </div>

          <p style="color: #607589; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0; text-align: center;">
            Questions? We're here to help! Reply to this email or visit our <a href="https://univio.ai/support" style="color: #2B4F7D;">Support Center</a>.
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e5e8ea;">
          <p style="color: #607589; margin: 0 0 10px 0; font-size: 14px;">
            © 2024 UniVio. All rights reserved.
          </p>
          <p style="color: #607589; margin: 0; font-size: 12px;">
            Your transfer success is our mission.
          </p>
        </div>
      </div>
    </body>
    </html>
    `;
  }
} 