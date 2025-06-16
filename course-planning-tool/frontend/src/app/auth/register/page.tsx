"use client";

import { useState } from 'react';
import { MultiStepRegistration } from '@/components/auth/MultiStepRegistration';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#111416] mb-2">Join UniVio</h1>
          <p className="text-lg text-[#607589]">Your AI-powered transfer planning companion</p>
        </div>
        
        <MultiStepRegistration />
      </div>
    </div>
  );
} 