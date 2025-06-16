"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Mail, Loader2, AlertTriangle } from 'lucide-react';
import { RegistrationData } from '../MultiStepRegistration';
import { emailValidationService } from '@/services/emailValidation';

interface EduEmailStepProps {
  data: RegistrationData;
  updateData: (updates: Partial<RegistrationData>) => void;
  onNext: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function EduEmailStep({ data, updateData, onNext, isLoading, setIsLoading }: EduEmailStepProps) {
  const [emailError, setEmailError] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [validationResult, setValidationResult] = useState<any>(null);
  const [isValidating, setIsValidating] = useState(false);

  const validateEduEmail = async (email: string): Promise<boolean> => {
    if (!email) return false;
    
    setIsValidating(true);
    setEmailError('');
    
    try {
      console.log('🔍 Validating email:', email);
      const result = await emailValidationService.validateEduEmail(email);
      console.log('📧 Validation result:', result);
      setValidationResult(result);
      
      if (!result.isValid) {
        setEmailError(result.errorMessage || 'Please enter a valid email address');
        return false;
      }
      
      // Be more permissive - allow .edu emails even if not perfectly validated
      if (result.isEduEmail || email.toLowerCase().includes('.edu')) {
        console.log('✅ .edu email detected, allowing validation');
        return true;
      }
      
      if (!result.isStudentEmail) {
        if (!result.isEduEmail) {
          setEmailError('Please use your college .edu email address to verify your student status');
          return false;
        }
        if (result.isDisposable) {
          setEmailError('Disposable email addresses are not allowed. Please use your official college email');
          return false;
        }
      }
      
      if (result.suggestions) {
        setEmailError(`Did you mean: ${result.suggestions}?`);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('❌ Email validation error:', error);
      
      // Show specific error message from validation service
      const errorMessage = error instanceof Error ? error.message : 'Email validation service unavailable';
      setEmailError(errorMessage);
      
      // If API is unavailable and it's clearly a .edu email, allow manual override
      if (email.toLowerCase().endsWith('.edu') && errorMessage.includes('unavailable')) {
        setEmailError(`${errorMessage} - However, this appears to be a .edu email. You may proceed, but verification is recommended when the service is available.`);
        return true; // Allow proceeding with .edu emails when service is down
      }
      
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  // Auto-validate email when user stops typing
  useEffect(() => {
    if (data.eduEmail && data.eduEmail.length > 5 && !data.eduEmailVerified) {
      const timeoutId = setTimeout(() => {
        validateEduEmail(data.eduEmail);
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [data.eduEmail]);

  const handleEmailChange = (email: string) => {
    updateData({ eduEmail: email });
    setEmailError('');
    setVerificationSent(false);
    updateData({ eduEmailVerified: false });
    setValidationResult(null);
  };

  const handleSendVerification = async () => {
    if (!data.eduEmail) {
      setEmailError('Please enter your educational email address');
      return;
    }

    const isValid = await validateEduEmail(data.eduEmail);
    if (!isValid) {
      return;
    }

    setIsLoading(true);
    setEmailError('');

    try {
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          eduEmail: data.eduEmail,
          firstName: data.firstName || 'Student'
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send verification email');
      }
      
      setVerificationSent(true);
      console.log('✅ Verification email sent successfully');
    } catch (error) {
      console.error('❌ Send verification error:', error);
      setEmailError(error instanceof Error ? error.message : 'Failed to send verification email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      setCodeError('Please enter the verification code');
      return;
    }

    if (verificationCode.length !== 6) {
      setCodeError('Verification code must be 6 digits');
      return;
    }

    setIsLoading(true);
    setCodeError('');

    try {
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          eduEmail: data.eduEmail, 
          code: verificationCode 
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Invalid verification code');
      }
      
      updateData({ eduEmailVerified: true });
      console.log('✅ Email verified successfully');
    } catch (error) {
      console.error('❌ Verify code error:', error);
      setCodeError(error instanceof Error ? error.message : 'Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const canProceed = data.eduEmailVerified;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-[#eff2f4] rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-[#111416]" />
        </div>
        <h2 className="text-2xl font-bold text-[#111416] mb-2">Verify Your Student Status</h2>
        <p className="text-[#607589]">
          Enter your college .edu email address to verify that you're a current student
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="eduEmail" className="block text-sm font-medium text-[#111416] mb-2">
            Educational Email Address
          </label>
          <div className="relative">
            <Input
              id="eduEmail"
              type="email"
              placeholder="your.name@college.edu"
              value={data.eduEmail}
              onChange={(e) => handleEmailChange(e.target.value)}
              className={`pl-10 pr-10 ${
                emailError 
                  ? 'border-red-500' 
                  : validationResult?.isStudentEmail 
                  ? 'border-green-500' 
                  : ''
              }`}
              disabled={data.eduEmailVerified}
            />
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#607589]" />
            
            {/* Right side icons */}
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
              {isValidating && (
                <Loader2 className="w-4 h-4 animate-spin text-[#607589]" />
              )}
              {!isValidating && data.eduEmailVerified && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
              {!isValidating && validationResult?.isStudentEmail && !data.eduEmailVerified && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
              {!isValidating && emailError && (
                <AlertTriangle className="w-4 h-4 text-red-500" />
              )}
            </div>
          </div>
          
          {/* Validation feedback */}
          {emailError && (
            <div className="flex items-center mt-2 text-sm text-red-600">
              <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
              <span>{emailError}</span>
            </div>
          )}
          
          {/* Positive feedback */}
          {validationResult?.isStudentEmail && !emailError && !data.eduEmailVerified && (
            <div className="flex items-center mt-2 text-sm text-green-600">
              <CheckCircle className="w-4 h-4 mr-1 flex-shrink-0" />
              <span>Valid .edu email detected!</span>
            </div>
          )}
          
          {/* Additional info */}
          {validationResult && !validationResult.isStudentEmail && validationResult.isValid && (
            <div className="mt-2 space-y-1">
              {validationResult.isDisposable && (
                <div className="flex items-center text-sm text-orange-600">
                  <AlertTriangle className="w-4 h-4 mr-1 flex-shrink-0" />
                  <span>This appears to be a disposable email address</span>
                </div>
              )}
              {!validationResult.isEduEmail && (
                <div className="flex items-center text-sm text-orange-600">
                  <AlertTriangle className="w-4 h-4 mr-1 flex-shrink-0" />
                  <span>Please use your college .edu email address</span>
                </div>
              )}
            </div>
          )}
        </div>

        {!verificationSent && !data.eduEmailVerified && (
          <Button 
            onClick={handleSendVerification}
            disabled={isLoading || isValidating || !data.eduEmail}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending Verification...
              </>
            ) : isValidating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Validating Email...
              </>
            ) : (
              'Send Verification Code'
            )}
          </Button>
        )}

        {verificationSent && !data.eduEmailVerified && (
          <div className="space-y-4">
            <div className="bg-[#f8f9fa] border border-[#e5e8ea] rounded-lg p-4">
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-[#111416] mr-2" />
                <div>
                  <p className="font-medium text-[#111416]">Verification email sent!</p>
                  <p className="text-sm text-[#607589]">
                    Check your inbox at {data.eduEmail} and enter the 6-digit code below.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="verificationCode" className="block text-sm font-medium text-[#111416] mb-2">
                Verification Code
              </label>
              <Input
                id="verificationCode"
                type="text"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => {
                  setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                  setCodeError('');
                }}
                className={`text-center text-lg tracking-wider ${codeError ? 'border-red-500' : ''}`}
                maxLength={6}
              />
              {codeError && (
                <div className="flex items-center mt-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {codeError}
                </div>
              )}
            </div>

            <div className="flex space-x-3">
              <Button 
                onClick={handleVerifyCode}
                disabled={isLoading || verificationCode.length !== 6}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify Code'
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleSendVerification}
                disabled={isLoading}
              >
                Resend
              </Button>
            </div>
          </div>
        )}

        {data.eduEmailVerified && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <div>
                <p className="font-medium text-green-800">Email verified successfully!</p>
                <p className="text-sm text-green-600">
                  Your student status has been confirmed.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between pt-6">
        <div></div>
        <Button 
          onClick={onNext}
          disabled={!canProceed}
          className="px-8"
        >
          Continue
        </Button>
      </div>
    </div>
  );
} 