"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, User } from 'lucide-react';
import { RegistrationData } from '../MultiStepRegistration';

interface PersonalInfoStepProps {
  data: RegistrationData;
  updateData: (updates: Partial<RegistrationData>) => void;
  onNext: () => void;
  onPrev: () => void;
  isLoading: boolean;
}

export function PersonalInfoStep({ data, updateData, onNext, onPrev, isLoading }: PersonalInfoStepProps) {
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
  }>({});

  const validateName = (name: string): boolean => {
    return name.length >= 2 && /^[a-zA-Z\s'-]+$/.test(name);
  };

  const handleFirstNameChange = (firstName: string) => {
    updateData({ firstName });
    if (errors.firstName) {
      setErrors(prev => ({ ...prev, firstName: undefined }));
    }
  };

  const handleLastNameChange = (lastName: string) => {
    updateData({ lastName });
    if (errors.lastName) {
      setErrors(prev => ({ ...prev, lastName: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    // First name validation
    if (!data.firstName) {
      newErrors.firstName = 'First name is required';
    } else if (!validateName(data.firstName)) {
      newErrors.firstName = 'Please enter a valid first name (letters only, at least 2 characters)';
    }

    // Last name validation
    if (!data.lastName) {
      newErrors.lastName = 'Last name is required';
    } else if (!validateName(data.lastName)) {
      newErrors.lastName = 'Please enter a valid last name (letters only, at least 2 characters)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const formatName = (input: string): string => {
    // Remove non-letter characters except spaces, hyphens, and apostrophes
    return input.replace(/[^a-zA-Z\s'-]/g, '');
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-[#eff2f4] rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-[#111416]" />
        </div>
        <h2 className="text-2xl font-bold text-[#111416] mb-2">Personal Information</h2>
        <p className="text-[#607589]">
          Let us know how you'd like to be addressed
        </p>
      </div>

      <div className="space-y-5">
        {/* First Name */}
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-[#111416] mb-2">
            First Name
          </label>
          <div className="relative">
            <Input
              id="firstName"
              type="text"
              placeholder="Enter your first name"
              value={data.firstName}
              onChange={(e) => handleFirstNameChange(formatName(e.target.value))}
              className={`pl-10 ${errors.firstName ? 'border-red-500' : ''}`}
            />
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#607589]" />
          </div>
          {errors.firstName && (
            <div className="flex items-center mt-2 text-sm text-red-600">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.firstName}
            </div>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-[#111416] mb-2">
            Last Name
          </label>
          <div className="relative">
            <Input
              id="lastName"
              type="text"
              placeholder="Enter your last name"
              value={data.lastName}
              onChange={(e) => handleLastNameChange(formatName(e.target.value))}
              className={`pl-10 ${errors.lastName ? 'border-red-500' : ''}`}
            />
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#607589]" />
          </div>
          {errors.lastName && (
            <div className="flex items-center mt-2 text-sm text-red-600">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.lastName}
            </div>
          )}
        </div>

        {/* Name Preview */}
        {data.firstName && data.lastName && (
                     <div className="bg-[#f8f9fa] border border-[#e5e8ea] rounded-lg p-4">
             <div className="flex items-center">
               <User className="w-5 h-5 text-[#111416] mr-2" />
               <div>
                 <p className="font-medium text-[#111416]">
                   Hello, {data.firstName} {data.lastName}!
                 </p>
                 <p className="text-sm text-[#607589]">
                  This is how your name will appear on your profile
                </p>
              </div>
            </div>
          </div>
        )}
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