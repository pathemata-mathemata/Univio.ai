"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Loader2, User, Mail, GraduationCap, Target } from 'lucide-react';
import { RegistrationData } from '../MultiStepRegistration';

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
      // Prepare registration payload for backend
      const registrationPayload = {
        email: data.personalEmail,
        password: data.password,
        name: `${data.firstName} ${data.lastName}`,
        eduEmail: data.eduEmail,
        eduEmailVerified: data.eduEmailVerified,
        profile: {
          currentInstitution: data.currentInstitution,
          currentMajor: data.currentMajor,
          currentQuarter: data.currentQuarter.toLowerCase(),
          currentYear: parseInt(data.currentYear),
          expectedTransferYear: parseInt(data.expectedTransferYear),
          expectedTransferQuarter: data.expectedTransferQuarter.toLowerCase(),
          targetInstitution: data.targetInstitution,
          targetMajor: data.targetMajor,
        }
      };

      console.log('🚀 Sending registration request to backend...');
      
      // Call the backend registration endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/auth/register-extended`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationPayload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || result.error || 'Registration failed');
      }

      console.log('✅ Registration successful:', result);

      // Store the authentication token
      if (result.access_token) {
        localStorage.setItem('access_token', result.access_token);
        localStorage.setItem('authToken', result.access_token); // For compatibility
      }

      setRegistrationStatus('success');
      
      // Redirect to intended page or dashboard after successful registration
      setTimeout(() => {
        const redirectPath = localStorage.getItem('redirect_after_login');
        localStorage.removeItem('redirect_after_login'); // Clean up
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
            Your account has been created successfully. You'll be redirected to your dashboard shortly.
          </p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-700">
            🎉 Registration complete! Get ready to plan your transfer journey with AI-powered insights.
          </p>
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

      {/* Terms and Conditions */}
      <div className="p-4 bg-[#f8f9fa] border border-[#dbe0e5] rounded-lg">
        <div className="flex items-start gap-3">
          <input 
            type="checkbox" 
            id="terms" 
            className="mt-1 h-4 w-4 text-[#0c7ff2] rounded border-[#dbe0e5]" 
            defaultChecked 
          />
          <label htmlFor="terms" className="text-sm text-[#607589]">
            I agree to the <a href="#" className="text-[#0c7ff2] hover:underline">Terms of Service</a> and <a href="#" className="text-[#0c7ff2] hover:underline">Privacy Policy</a>. 
            I understand that my educational information will be used to provide personalized transfer planning services.
          </label>
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