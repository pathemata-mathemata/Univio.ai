"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { EduEmailStep } from './steps/EduEmailStep';
import { PersonalEmailStep } from './steps/PersonalEmailStep';
import { PersonalInfoStep } from './steps/PersonalInfoStep';
import { AcademicInfoStep } from './steps/AcademicInfoStep';
import { ReviewStep } from './steps/ReviewStep';

export interface RegistrationData {
  // Step 1: Educational Email
  eduEmail: string;
  eduEmailVerified: boolean;
  
  // Step 2: Personal Email & Password
  personalEmail: string;
  personalEmailVerified: boolean;
  password: string;
  confirmPassword: string;
  
  // Step 3: Personal Information
  firstName: string;
  lastName: string;
  
  // Step 4: Academic Information
  currentInstitution: string;
  currentMajor: string;
  currentGPA: string;
  expectedTransferYear: string;
  expectedTransferQuarter: string;
  targetInstitution: string;
  targetMajor: string;
}

const initialData: RegistrationData = {
  eduEmail: '',
  eduEmailVerified: false,
  personalEmail: '',
  personalEmailVerified: false,
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
  currentInstitution: '',
  currentMajor: '',
  currentGPA: '',
  expectedTransferYear: '',
  expectedTransferQuarter: '',
  targetInstitution: '',
  targetMajor: '',
};

const steps = [
  { id: 1, title: 'Educational Email', description: 'Verify your student status' },
  { id: 2, title: 'Personal Email', description: 'Set up your account' },
  { id: 3, title: 'Personal Info', description: 'Tell us about yourself' },
  { id: 4, title: 'Academic Info', description: 'Your academic details' },
  { id: 5, title: 'Review', description: 'Confirm and submit' },
];

export function MultiStepRegistration() {
  const [currentStep, setCurrentStep] = useState(1);
  const [registrationData, setRegistrationData] = useState<RegistrationData>(initialData);
  const [isLoading, setIsLoading] = useState(false);

  const updateData = (updates: Partial<RegistrationData>) => {
    setRegistrationData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = (currentStep / steps.length) * 100;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <EduEmailStep
            data={registrationData}
            updateData={updateData}
            onNext={nextStep}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        );
      case 2:
        return (
          <PersonalEmailStep
            data={registrationData}
            updateData={updateData}
            onNext={nextStep}
            onPrev={prevStep}
            isLoading={isLoading}
          />
        );
      case 3:
        return (
          <PersonalInfoStep
            data={registrationData}
            updateData={updateData}
            onNext={nextStep}
            onPrev={prevStep}
            isLoading={isLoading}
          />
        );
      case 4:
        return (
          <AcademicInfoStep
            data={registrationData}
            updateData={updateData}
            onNext={nextStep}
            onPrev={prevStep}
            isLoading={isLoading}
          />
        );
      case 5:
        return (
          <ReviewStep
            data={registrationData}
            onPrev={prevStep}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader className="text-center">
        <div className="flex justify-between items-center mb-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${currentStep >= step.id 
                    ? 'bg-[#111416] text-white' 
                    : 'bg-[#eff2f4] text-[#607589]'
                  }
                `}
              >
                {step.id}
              </div>
              <div className="text-xs text-center mt-2">
                <div className="font-medium text-[#111416]">{step.title}</div>
                <div className="text-[#607589]">{step.description}</div>
              </div>
              {index < steps.length - 1 && (
                                  <div className="hidden sm:block w-full h-px bg-[#e5e8ea] mt-4" />
              )}
            </div>
          ))}
        </div>
        
        <Progress value={progress} className="w-full mt-6" />
        
        <CardTitle className="mt-4">
          Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {renderStep()}
      </CardContent>
    </Card>
  );
} 