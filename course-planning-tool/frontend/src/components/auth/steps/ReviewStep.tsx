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
      // In production, replace this with actual API call
      const registrationPayload = {
        // Personal email and password for account creation
        email: data.personalEmail,
        password: data.password,
        name: `${data.firstName} ${data.lastName}`,
        
        // Educational verification
        eduEmail: data.eduEmail,
        eduEmailVerified: data.eduEmailVerified,
        
        // Academic profile information
        profile: {
          firstName: data.firstName,
          lastName: data.lastName,
          currentInstitution: data.currentInstitution,
          currentMajor: data.currentMajor,
          currentGPA: parseFloat(data.currentGPA),
          expectedTransferYear: parseInt(data.expectedTransferYear),
          expectedTransferQuarter: data.expectedTransferQuarter,
          targetInstitution: data.targetInstitution,
          targetMajor: data.targetMajor,
        }
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // In production, you would call your backend API here:
      // const response = await fetch('/api/v1/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(registrationPayload)
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Registration failed');
      // }
      // 
      // const result = await response.json();
      
      setRegistrationStatus('success');
      
      // Redirect to intended page or dashboard after successful registration
      setTimeout(() => {
        const redirectPath = localStorage.getItem('redirect_after_login');
        localStorage.removeItem('redirect_after_login'); // Clean up
        router.push(redirectPath || '/dashboard');
      }, 2000);
      
    } catch (error) {
      setRegistrationStatus('error');
      setErrorMessage('Registration failed. Please try again.');
      console.error('Registration error:', error);
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

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-[#eff2f4] rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-[#111416]" />
        </div>
        <h2 className="text-2xl font-bold text-[#111416] mb-2">Review Your Information</h2>
        <p className="text-[#607589]">
          Please review all your information before creating your account
        </p>
      </div>

      <div className="space-y-6">
        {/* Student Verification */}
        <div className="bg-[#f8f9fa] border border-[#e5e8ea] rounded-lg p-4">
          <div className="flex items-center mb-3">
            <Mail className="w-5 h-5 text-[#111416] mr-2" />
            <h3 className="font-semibold text-[#111416]">Student Verification</h3>
            <Badge variant="outline" className="ml-auto text-green-600 border-green-600">
              ✓ Verified
            </Badge>
          </div>
          <p className="text-sm text-[#607589]">
            <strong>Educational Email:</strong> {data.eduEmail}
          </p>
        </div>

        {/* Account Information */}
        <div className="bg-[#f8f9fa] border border-[#e5e8ea] rounded-lg p-4">
          <div className="flex items-center mb-3">
            <User className="w-5 h-5 text-[#111416] mr-2" />
            <h3 className="font-semibold text-[#111416]">Account Information</h3>
          </div>
          <div className="space-y-2 text-sm text-[#607589]">
            <p><strong>Name:</strong> {data.firstName} {data.lastName}</p>
            <p><strong>Personal Email:</strong> {data.personalEmail}</p>
            <p><strong>Password:</strong> ••••••••</p>
          </div>
        </div>

        {/* Current Academic Status */}
        <div className="bg-[#f8f9fa] border border-[#e5e8ea] rounded-lg p-4">
          <div className="flex items-center mb-3">
            <GraduationCap className="w-5 h-5 text-[#111416] mr-2" />
            <h3 className="font-semibold text-[#111416]">Current Academic Status</h3>
          </div>
          <div className="space-y-2 text-sm text-[#607589]">
            <p><strong>Institution:</strong> {data.currentInstitution}</p>
            <p><strong>Major:</strong> {data.currentMajor}</p>
            <p><strong>GPA:</strong> {data.currentGPA}</p>
          </div>
        </div>

        {/* Transfer Goals */}
        <div className="bg-[#f8f9fa] border border-[#e5e8ea] rounded-lg p-4">
          <div className="flex items-center mb-3">
            <Target className="w-5 h-5 text-[#111416] mr-2" />
            <h3 className="font-semibold text-[#111416]">Transfer Goals</h3>
          </div>
          <div className="space-y-2 text-sm text-[#607589]">
            <p><strong>Target Institution:</strong> {data.targetInstitution}</p>
            <p><strong>Target Major:</strong> {data.targetMajor}</p>
            <p><strong>Expected Transfer:</strong> {data.expectedTransferQuarter} {data.expectedTransferYear}</p>
          </div>
        </div>
      </div>

      {registrationStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <div>
              <p className="font-medium text-red-800">Registration Failed</p>
              <p className="text-sm text-red-600">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#f8f9fa] border border-[#e5e8ea] rounded-lg p-4">
        <div className="text-sm text-[#607589]">
          <p className="font-medium mb-2 text-[#111416]">By creating your account, you agree to:</p>
          <ul className="space-y-1 text-xs">
            <li>• UniVio's Terms of Service and Privacy Policy</li>
            <li>• Receive course planning recommendations and updates</li>
            <li>• Allow us to help you plan your academic transfer journey</li>
          </ul>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrev} disabled={isLoading}>
          Back
        </Button>
        <Button 
          onClick={handleRegister} 
          disabled={isLoading}
          className="px-8 bg-[#111416] hover:bg-[#111416]/90"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating Account...
            </>
          ) : (
            'Create My Account'
          )}
        </Button>
      </div>
    </div>
  );
} 