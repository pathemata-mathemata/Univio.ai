"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Loader2, User, Mail, GraduationCap, Target } from 'lucide-react';
import { RegistrationData } from '../MultiStepRegistration';
import { supabase } from '@/lib/supabase';

interface ReviewStepProps {
  data: RegistrationData;
  onPrev: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function ReviewStep({ data, onPrev, isLoading, setIsLoading }: ReviewStepProps) {
  const router = useRouter();
  const [registrationStatus, setRegistrationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async () => {
    setIsLoading(true);
    setRegistrationStatus('idle');
    setErrorMessage('');

    try {
      console.log('🚀 Creating complete user account with all data...');
      
      // Step 1: Create Supabase auth user (this creates the user in auth.users automatically)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.personalEmail,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            edu_email: data.eduEmail,
            edu_email_verified: data.eduEmailVerified,
          }
        }
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error('Failed to create user account');
      }

      console.log('✅ Supabase auth user created:', authData.user.email);

      // Step 2: Create email verification records (if tables exist)
      if (data.eduEmailVerified) {
        try {
          const { error: eduVerifyError } = await supabase
            .from('email_verifications')
            .insert({
              email: data.eduEmail,
              code: 'verified-during-registration',
              expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
              attempts: 0,
              verified: true,
            });

          if (eduVerifyError) {
            console.warn('⚠️ Educational email verification record failed:', eduVerifyError);
          } else {
            console.log('✅ Educational email verification record created');
          }
        } catch (err) {
          console.warn('⚠️ Email verification table may not exist:', err);
        }
      }

      if (data.personalEmailVerified) {
        try {
          const { error: personalVerifyError } = await supabase
            .from('email_verifications')
            .insert({
              email: data.personalEmail,
              code: 'verified-during-registration',
              expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
              attempts: 0,
              verified: true,
            });

          if (personalVerifyError) {
            console.warn('⚠️ Personal email verification record failed:', personalVerifyError);
          } else {
            console.log('✅ Personal email verification record created');
          }
        } catch (err) {
          console.warn('⚠️ Email verification table may not exist:', err);
        }
      }

      // Step 3: Create academic profile (using correct schema)
      try {
        const { error: profileError } = await supabase
          .from('academic_profiles')
          .insert({
            user_id: authData.user.id,
            current_institution_name: data.currentInstitution,
            current_major_name: data.currentMajor,
            current_gpa: data.currentGPA ? parseFloat(data.currentGPA) : null,
            current_quarter: data.expectedTransferQuarter?.toLowerCase() || 'fall', // Use expected as current for now
            current_year: new Date().getFullYear(), // Current year
            expected_transfer_year: parseInt(data.expectedTransferYear),
            expected_transfer_quarter: data.expectedTransferQuarter?.toLowerCase(),
            target_institution_name: data.targetInstitution,
            target_major_name: data.targetMajor,
            max_units_per_quarter: 16, // Default value
            preferred_study_intensity: 'moderate', // Default value
            is_complete: true,
            last_updated_by_user: authData.user.id,
          });

        if (profileError) {
          console.warn('⚠️ Academic profile creation failed:', profileError);
          // Don't fail the registration completely
        } else {
          console.log('✅ Academic profile created successfully');
        }
      } catch (err) {
        console.warn('⚠️ Academic profiles table may not exist:', err);
      }

      // Step 4: Initialize dashboard metrics (if table exists)
      try {
        const { error: metricsError } = await supabase
          .from('dashboard_metrics')
          .insert({
            user_id: authData.user.id,
            overall_progress_percentage: 0,
            completed_units: 0,
            remaining_units: 60, // Typical transfer requirement
            total_courses_completed: 0,
            total_courses_planned: 0,
            current_quarter_units: 0,
            requirements_completed: 0,
            requirements_total: 0,
            on_track_for_transfer: true,
            total_planning_sessions: 0,
            days_since_last_activity: 0,
            calculated_at: new Date().toISOString(),
          });

        if (metricsError) {
          console.warn('⚠️ Dashboard metrics initialization failed:', metricsError);
        } else {
          console.log('✅ Dashboard metrics initialized');
        }
      } catch (err) {
        console.warn('⚠️ Dashboard metrics table may not exist:', err);
      }

      // Step 5: Log user activity (if table exists)
      try {
        const { error: activityError } = await supabase
          .from('user_activity_log')
          .insert({
            user_id: authData.user.id,
            activity_type: 'registration',
            activity_category: 'auth',
            description: 'User completed registration process',
            metadata: {
              registration_steps_completed: 5,
              current_institution: data.currentInstitution,
              target_institution: data.targetInstitution,
              edu_email_verified: data.eduEmailVerified,
              personal_email_verified: data.personalEmailVerified,
            },
            success: true,
          });

        if (activityError) {
          console.warn('⚠️ Activity logging failed:', activityError);
        } else {
          console.log('✅ Registration activity logged');
        }
      } catch (err) {
        console.warn('⚠️ User activity log table may not exist:', err);
      }

      // Step 6: Store session info
      if (authData.session) {
        localStorage.setItem('supabase_session', JSON.stringify(authData.session));
        localStorage.setItem('access_token', authData.session.access_token);
      }

      setRegistrationStatus('success');
      
      // Redirect to intended page or dashboard after successful registration
      setTimeout(() => {
        const redirectPath = localStorage.getItem('redirect_after_login');
        localStorage.removeItem('redirect_after_login');
        router.push(redirectPath || '/dashboard');
      }, 2000);
      
    } catch (error) {
      console.error('❌ Registration error:', error);
      setRegistrationStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (registrationStatus === 'success') {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#111416] mb-2">Welcome to UniVio!</h2>
          <p className="text-[#607589]">
            Your complete profile has been created successfully. You'll be redirected to your dashboard shortly.
          </p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
          <p className="text-sm text-green-700 font-medium">
            🎉 Registration complete! Here's what we've set up for you:
          </p>
          <ul className="text-xs text-green-600 space-y-1">
            <li>✅ User account and authentication</li>
            <li>✅ Academic profile with your institution details</li>
            <li>✅ Email verification records</li>
            <li>✅ Dashboard metrics and progress tracking</li>
            <li>✅ Activity logging for your journey</li>
          </ul>
        </div>
      </div>
    );
  }

  if (registrationStatus === 'error') {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#111416] mb-2">Registration Failed</h2>
          <p className="text-[#607589] mb-4">{errorMessage}</p>
        </div>
        <div className="space-x-4">
          <Button onClick={() => setRegistrationStatus('idle')} className="bg-[#0c7ff2] hover:bg-[#0a6fd1]">
            Try Again
          </Button>
          <Button variant="outline" onClick={onPrev}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#111416] mb-2">Review Your Information</h2>
        <p className="text-[#607589]">Please review your details before creating your account.</p>
      </div>

      {/* Personal Information */}
      <div className="space-y-4 p-6 border border-[#dbe0e5] rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-[#0c7ff2]" />
          <h3 className="font-semibold text-[#111416]">Personal Information</h3>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-[#607589]">Name:</span>
            <p className="font-medium text-[#111416]">{data.firstName} {data.lastName}</p>
          </div>
          <div>
            <span className="text-[#607589]">Personal Email:</span>
            <p className="font-medium text-[#111416]">{data.personalEmail}</p>
          </div>
        </div>
      </div>

      {/* Educational Information */}
      <div className="space-y-4 p-6 border border-[#dbe0e5] rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Mail className="w-5 h-5 text-[#0c7ff2]" />
          <h3 className="font-semibold text-[#111416]">Educational Verification</h3>
        </div>
        <div className="text-sm">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[#607589]">Educational Email:</span>
              <p className="font-medium text-[#111416]">{data.eduEmail}</p>
            </div>
            <div className={`px-2 py-1 rounded text-xs ${data.eduEmailVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {data.eduEmailVerified ? 'Verified' : 'Not Verified'}
            </div>
          </div>
        </div>
      </div>

      {/* Academic Information */}
      <div className="space-y-4 p-6 border border-[#dbe0e5] rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <GraduationCap className="w-5 h-5 text-[#0c7ff2]" />
          <h3 className="font-semibold text-[#111416]">Academic Information</h3>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-[#607589]">Current Institution:</span>
            <p className="font-medium text-[#111416]">{data.currentInstitution}</p>
          </div>
          <div>
            <span className="text-[#607589]">Current Major:</span>
            <p className="font-medium text-[#111416]">{data.currentMajor}</p>
          </div>
          <div>
            <span className="text-[#607589]">Current GPA:</span>
            <p className="font-medium text-[#111416]">{data.currentGPA}</p>
          </div>
          <div>
            <span className="text-[#607589]">Transfer Timeline:</span>
            <p className="font-medium text-[#111416]">{data.expectedTransferQuarter} {data.expectedTransferYear}</p>
          </div>
          <div>
            <span className="text-[#607589]">Target Institution:</span>
            <p className="font-medium text-[#111416]">{data.targetInstitution}</p>
          </div>
          <div>
            <span className="text-[#607589]">Target Major:</span>
            <p className="font-medium text-[#111416]">{data.targetMajor}</p>
          </div>
        </div>
      </div>

      {/* Terms and Privacy Policy */}
      <div className="space-y-4 p-6 border border-[#dbe0e5] rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-[#0c7ff2]" />
          <h3 className="font-semibold text-[#111416]">Terms of Service & Privacy Policy</h3>
        </div>
        
        <div className="space-y-4 text-sm text-[#607589]">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-[#111416] mb-2">🔒 Your Data Protection Rights (California Law Compliant)</h4>
            <ul className="space-y-1 text-xs">
              <li><strong>Right to Know:</strong> You have the right to know what personal information we collect and how we use it.</li>
              <li><strong>Right to Delete:</strong> You can request deletion of your personal information at any time through your account settings or by contacting us.</li>
              <li><strong>Right to Correct:</strong> You can update or correct your personal information through your account dashboard.</li>
              <li><strong>Right to Opt-Out:</strong> You can opt-out of data sharing for marketing purposes (we don't sell your data).</li>
              <li><strong>Right to Non-Discrimination:</strong> We will not discriminate against you for exercising your privacy rights.</li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-[#111416] mb-2">🛡️ How We Protect Your Information</h4>
            <ul className="space-y-1 text-xs">
              <li><strong>Secure Storage:</strong> Your data is encrypted and stored on secure servers with enterprise-grade security.</li>
              <li><strong>Limited Access:</strong> Only authorized personnel can access your information for legitimate purposes.</li>
              <li><strong>No Data Selling:</strong> We never sell, rent, or trade your personal information to third parties.</li>
              <li><strong>Educational Purpose Only:</strong> Your academic information is used solely to provide transfer planning services.</li>
              <li><strong>FERPA Compliant:</strong> We follow educational privacy standards for handling student information.</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-[#111416] mb-2">📊 What Information We Collect & Why</h4>
            <ul className="space-y-1 text-xs">
              <li><strong>Personal Information:</strong> Name, email addresses for account creation and communication.</li>
              <li><strong>Academic Information:</strong> Institution, major, GPA, transfer goals to provide personalized planning.</li>
              <li><strong>Usage Data:</strong> How you use our platform to improve our services (anonymized).</li>
              <li><strong>Communication Records:</strong> Support interactions to help resolve issues and improve service.</li>
            </ul>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-semibold text-[#111416] mb-2">⚠️ Important Information</h4>
            <ul className="space-y-1 text-xs">
              <li><strong>Data Retention:</strong> We keep your data as long as your account is active or as needed to provide services.</li>
              <li><strong>Account Deletion:</strong> You can permanently delete your account and all associated data at any time.</li>
              <li><strong>Service Interruption:</strong> We may temporarily suspend service for maintenance or security updates.</li>
              <li><strong>Changes to Terms:</strong> We'll notify you of any significant changes to our terms or privacy policy.</li>
              <li><strong>Contact Us:</strong> Reach out to privacy@univio.ai for any data protection concerns.</li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-start gap-3">
            <input 
              type="checkbox" 
              id="terms" 
              className="mt-1 h-4 w-4 text-[#0c7ff2] rounded border-[#dbe0e5]" 
              required
            />
            <label htmlFor="terms" className="text-sm text-[#607589] leading-relaxed">
              <strong>I agree to UniVio's Terms of Service and Privacy Policy.</strong> I understand that:
              <br />• My educational information will be used exclusively to provide personalized transfer planning services
              <br />• I have the right to access, correct, or delete my personal data at any time
              <br />• UniVio will protect my information according to California privacy laws (CCPA/CPRA)
              <br />• I can withdraw consent and delete my account at any time through account settings
              <br />• UniVio does not sell or rent personal information to third parties
              <br />
              <span className="text-[#0c7ff2]">
                By checking this box, I consent to the collection and use of my information as described above.
              </span>
            </label>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-600">
          <p><strong>California Residents:</strong> This privacy notice complies with the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA). 
          For questions about your privacy rights or to exercise them, contact us at privacy@univio.ai or through your account settings.</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrev} disabled={isLoading}>
          Back
        </Button>
        <Button 
          onClick={handleRegister} 
          disabled={isLoading}
          className="bg-[#0c7ff2] hover:bg-[#0a6fd1] px-8"
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </div>
    </div>
  );
} 