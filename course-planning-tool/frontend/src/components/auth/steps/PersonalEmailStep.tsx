"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, Eye, EyeOff, Lock, Mail, CheckCircle, Loader2, AlertTriangle } from 'lucide-react';
import { RegistrationData } from '../MultiStepRegistration';
import { emailValidationService } from '@/services/emailValidation';

interface PersonalEmailStepProps {
  data: RegistrationData;
  updateData: (updates: Partial<RegistrationData>) => void;
  onNext: () => void;
  onPrev: () => void;
  isLoading: boolean;
}

export function PersonalEmailStep({ data, updateData, onNext, onPrev, isLoading }: PersonalEmailStepProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    personalEmail?: string;
    password?: string;
    confirmPassword?: string;
    verificationCode?: string;
  }>({});
  const [emailValidationResult, setEmailValidationResult] = useState<any>(null);
  const [isValidatingEmail, setIsValidatingEmail] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [personalEmailVerified, setPersonalEmailVerified] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);

  const validateEmailWithAPI = async (email: string): Promise<boolean> => {
    if (!email) return false;
    
    setIsValidatingEmail(true);
    
    try {
      const result = await emailValidationService.validatePersonalEmail(email);
      setEmailValidationResult(result);
      
      if (!result.isValid) {
        setErrors(prev => ({ 
          ...prev, 
          personalEmail: result.errorMessage || 'Please enter a valid email address' 
        }));
        return false;
      }
      
      if (result.isDisposable) {
        setErrors(prev => ({ 
          ...prev, 
          personalEmail: 'Disposable email addresses are not recommended for account security' 
        }));
        return false;
      }
      
      if (result.suggestions) {
        setErrors(prev => ({ 
          ...prev, 
          personalEmail: `Did you mean: ${result.suggestions}?` 
        }));
        return false;
      }
      
      // Clear any previous errors if validation passes
      setErrors(prev => ({ ...prev, personalEmail: undefined }));
      return true;
    } catch (error) {
      console.error('Email validation error:', error);
      // Don't block the user if API fails, use basic validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValid = emailRegex.test(email);
      if (!isValid) {
        setErrors(prev => ({ 
          ...prev, 
          personalEmail: 'Please enter a valid email address' 
        }));
      }
      return isValid;
    } finally {
      setIsValidatingEmail(false);
    }
  };

  const validatePassword = (password: string): string[] => {
    const issues = [];
    if (password.length < 8) issues.push('At least 8 characters');
    if (!/[A-Z]/.test(password)) issues.push('One uppercase letter');
    if (!/[a-z]/.test(password)) issues.push('One lowercase letter');
    if (!/\d/.test(password)) issues.push('One number');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) issues.push('One special character');
    return issues;
  };

  const handleEmailChange = (email: string) => {
    updateData({ personalEmail: email });
    setEmailValidationResult(null);
    if (errors.personalEmail) {
      setErrors(prev => ({ ...prev, personalEmail: undefined }));
    }
    
    // Debounced validation - validate after user stops typing
    if (email) {
      const timeoutId = setTimeout(() => {
        validateEmailWithAPI(email);
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  };

  const handlePasswordChange = (password: string) => {
    updateData({ password });
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: undefined }));
    }
  };

  const handleConfirmPasswordChange = (confirmPassword: string) => {
    updateData({ confirmPassword });
    if (errors.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: undefined }));
    }
  };

  const validateForm = async (): Promise<boolean> => {
    const newErrors: typeof errors = {};

    // Email validation
    if (!data.personalEmail) {
      newErrors.personalEmail = 'Personal email is required';
    } else if (data.personalEmail === data.eduEmail) {
      newErrors.personalEmail = 'Personal email must be different from your .edu email';
    } else if (!emailValidationResult || !emailValidationResult.isValid) {
      // If we don't have validation results, validate now
      if (!emailValidationResult) {
        const isValid = await validateEmailWithAPI(data.personalEmail);
        if (!isValid) {
          // Error will be set by validateEmailWithAPI
          return false;
        }
      } else {
        newErrors.personalEmail = emailValidationResult.errorMessage || 'Please enter a valid email address';
      }
    }

    // Password validation
    if (!data.password) {
      newErrors.password = 'Password is required';
    } else {
      const passwordIssues = validatePassword(data.password);
      if (passwordIssues.length > 0) {
        newErrors.password = `Password must have: ${passwordIssues.join(', ')}`;
      }
    }

    // Confirm password validation
    if (!data.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (data.password !== data.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendPersonalVerification = async () => {
    if (!data.personalEmail) {
      setErrors(prev => ({ ...prev, personalEmail: 'Please enter your personal email address' }));
      return;
    }

    const isValid = await validateEmailWithAPI(data.personalEmail);
    if (!isValid) {
      return;
    }

    setIsLoading2(true);
    setErrors(prev => ({ ...prev, personalEmail: undefined }));

    try {
      const response = await fetch('/api/auth/send-personal-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          personalEmail: data.personalEmail,
          firstName: data.firstName || 'User'
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send verification email');
      }
      
      setVerificationSent(true);
      console.log('✅ Personal email verification sent successfully');
    } catch (error) {
      console.error('❌ Send personal verification error:', error);
      setErrors(prev => ({ 
        ...prev, 
        personalEmail: error instanceof Error ? error.message : 'Failed to send verification email. Please try again.' 
      }));
    } finally {
      setIsLoading2(false);
    }
  };

  const handleVerifyPersonalCode = async () => {
    if (!verificationCode) {
      setErrors(prev => ({ ...prev, verificationCode: 'Please enter the verification code' }));
      return;
    }

    if (verificationCode.length !== 6) {
      setErrors(prev => ({ ...prev, verificationCode: 'Verification code must be 6 digits' }));
      return;
    }

    setIsLoading2(true);
    setErrors(prev => ({ ...prev, verificationCode: undefined }));

    try {
      const response = await fetch('/api/auth/verify-personal-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          personalEmail: data.personalEmail, 
          code: verificationCode 
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Invalid verification code');
      }
      
      setPersonalEmailVerified(true);
      updateData({ personalEmailVerified: true });
      console.log('✅ Personal email verified successfully');

      // If both emails are verified, send dual verification complete email
      if (data.eduEmailVerified) {
        try {
          await fetch('/api/auth/send-welcome-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              personalEmail: data.personalEmail,
              firstName: data.firstName || 'User',
              eduEmail: data.eduEmail,
              emailType: 'dual-verification-complete'
            })
          });
          console.log('✅ Dual verification complete email sent');
        } catch (error) {
          console.warn('⚠️ Failed to send dual verification complete email:', error);
          // Don't fail the verification for email issues
        }
      }
    } catch (error) {
      console.error('❌ Verify personal email code error:', error);
      setErrors(prev => ({ 
        ...prev, 
        verificationCode: error instanceof Error ? error.message : 'Invalid verification code. Please try again.' 
      }));
    } finally {
      setIsLoading2(false);
    }
  };

  const handleNext = async () => {
    if (!personalEmailVerified) {
      setErrors(prev => ({ ...prev, personalEmail: 'Please verify your personal email first' }));
      return;
    }

    const isValid = await validateForm();
    if (isValid) {
      onNext();
    }
  };

  const passwordIssues = data.password ? validatePassword(data.password) : [];
  const isPasswordValid = passwordIssues.length === 0;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-[#eff2f4] rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-[#111416]" />
        </div>
        <h2 className="text-2xl font-bold text-[#111416] mb-2">Create Your Account</h2>
        <p className="text-[#607589]">
          Set up your personal account details for UniVio
        </p>
      </div>

      <div className="space-y-5">
        {/* Personal Email */}
        <div>
          <label htmlFor="personalEmail" className="block text-sm font-medium text-[#111416] mb-2">
            Personal Email Address
          </label>
          <div className="relative">
            <Input
              id="personalEmail"
              type="email"
              placeholder="your.personal@email.com"
              value={data.personalEmail}
              onChange={(e) => handleEmailChange(e.target.value)}
              className={`pl-10 pr-10 ${
                errors.personalEmail 
                  ? 'border-red-500' 
                  : emailValidationResult?.isRecommended 
                  ? 'border-green-500' 
                  : emailValidationResult?.isValid
                  ? 'border-orange-500'
                  : ''
              }`}
            />
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#607589]" />
            
            {/* Right side icons */}
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
              {isValidatingEmail && (
                <Loader2 className="w-4 h-4 animate-spin text-[#607589]" />
              )}
              {!isValidatingEmail && emailValidationResult?.isRecommended && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
              {!isValidatingEmail && emailValidationResult?.isValid && !emailValidationResult?.isRecommended && (
                <AlertTriangle className="w-4 h-4 text-orange-500" />
              )}
              {!isValidatingEmail && errors.personalEmail && (
                <AlertTriangle className="w-4 h-4 text-red-500" />
              )}
            </div>
          </div>
          
          {/* Validation feedback */}
          {errors.personalEmail && (
            <div className="flex items-center mt-2 text-sm text-red-600">
              <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
              <span>{errors.personalEmail}</span>
            </div>
          )}
          
          {/* Positive feedback */}
          {emailValidationResult?.isRecommended && !errors.personalEmail && (
            <div className="flex items-center mt-2 text-sm text-green-600">
              <CheckCircle className="w-4 h-4 mr-1 flex-shrink-0" />
              <span>Excellent email choice! Quality score: {Math.round(emailValidationResult.qualityScore * 100)}%</span>
            </div>
          )}
          
          {/* Warning for valid but not recommended emails */}
          {emailValidationResult?.isValid && !emailValidationResult?.isRecommended && !errors.personalEmail && (
            <div className="mt-2 space-y-1">
              {emailValidationResult.isDisposable && (
                <div className="flex items-center text-sm text-orange-600">
                  <AlertTriangle className="w-4 h-4 mr-1 flex-shrink-0" />
                  <span>This appears to be a disposable email. Consider using a permanent address.</span>
                </div>
              )}
              {emailValidationResult.isFreeEmail && (
                <div className="flex items-center text-sm text-orange-600">
                  <AlertTriangle className="w-4 h-4 mr-1 flex-shrink-0" />
                  <span>Free email detected. Consider using a professional email address.</span>
                </div>
              )}
              {emailValidationResult.deliverability === 'RISKY' && (
                <div className="flex items-center text-sm text-orange-600">
                  <AlertTriangle className="w-4 h-4 mr-1 flex-shrink-0" />
                  <span>This email may have deliverability issues.</span>
                </div>
              )}
            </div>
          )}
          
          <p className="text-xs text-[#607589] mt-1">
            This will be used for account notifications and login
          </p>

          {/* Verification Button */}
          {!verificationSent && !personalEmailVerified && data.personalEmail && !errors.personalEmail && (
            <div className="mt-3">
              <Button 
                onClick={handleSendPersonalVerification}
                disabled={isLoading2 || isValidatingEmail}
                variant="outline"
                size="sm"
                className="w-full"
              >
                {isLoading2 ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Verification Code'
                )}
              </Button>
            </div>
          )}

          {/* Verification Code Input */}
          {verificationSent && !personalEmailVerified && (
            <div className="mt-4 space-y-4">
              <div className="bg-[#f8f9fa] border border-[#e5e8ea] rounded-lg p-4">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-[#111416] mr-2" />
                  <div>
                    <p className="font-medium text-[#111416]">Verification email sent!</p>
                    <p className="text-sm text-[#607589]">
                      Check your inbox at {data.personalEmail} and enter the 6-digit code below.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="personalVerificationCode" className="block text-sm font-medium text-[#111416] mb-2">
                  Verification Code
                </label>
                <Input
                  id="personalVerificationCode"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => {
                    setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                    setErrors(prev => ({ ...prev, verificationCode: undefined }));
                  }}
                  className={`text-center text-lg tracking-wider ${errors.verificationCode ? 'border-red-500' : ''}`}
                  maxLength={6}
                />
                {errors.verificationCode && (
                  <div className="flex items-center mt-2 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.verificationCode}
                  </div>
                )}
              </div>

              <div className="flex space-x-3">
                <Button 
                  onClick={handleVerifyPersonalCode}
                  disabled={isLoading2 || verificationCode.length !== 6}
                  className="flex-1"
                >
                  {isLoading2 ? (
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
                  onClick={handleSendPersonalVerification}
                  disabled={isLoading2}
                >
                  Resend
                </Button>
              </div>
            </div>
          )}

          {/* Verification Success */}
          {personalEmailVerified && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <div>
                  <p className="font-medium text-green-800">Personal email verified!</p>
                  <p className="text-sm text-green-600">
                    Your personal email has been confirmed.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Password */}
        <div>
                     <label htmlFor="password" className="block text-sm font-medium text-[#111416] mb-2">
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a strong password"
              value={data.password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
            />
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#607589]" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#607589] hover:text-[#111416]"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          
          {/* Password Requirements */}
          <div className="mt-2 space-y-1">
            {data.password && (
              <div className="text-xs space-y-1">
                {['At least 8 characters', 'One uppercase letter', 'One lowercase letter', 'One number', 'One special character'].map((requirement, index) => {
                  const checks = [
                    data.password.length >= 8,
                    /[A-Z]/.test(data.password),
                    /[a-z]/.test(data.password),
                    /\d/.test(data.password),
                    /[!@#$%^&*(),.?":{}|<>]/.test(data.password)
                  ];
                  
                  return (
                    <div key={requirement} className={`flex items-center ${checks[index] ? 'text-green-600' : 'text-[#607589]'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full mr-2 ${checks[index] ? 'bg-green-500' : 'bg-[#e5e8ea]'}`} />
                      {requirement}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          {errors.password && (
            <div className="flex items-center mt-2 text-sm text-red-600">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.password}
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#111416] mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              value={data.confirmPassword}
              onChange={(e) => handleConfirmPasswordChange(e.target.value)}
              className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
            />
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#607589]" />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#607589] hover:text-[#111416]"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <div className="flex items-center mt-2 text-sm text-red-600">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.confirmPassword}
            </div>
          )}
          {data.confirmPassword && data.password === data.confirmPassword && (
            <div className="flex items-center mt-2 text-sm text-green-600">
              <div className="w-4 h-4 mr-1 flex items-center justify-center">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
              </div>
              Passwords match
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrev} disabled={isLoading}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={isLoading} className="px-8">
          Continue
        </Button>
      </div>
    </div>
  );
} 