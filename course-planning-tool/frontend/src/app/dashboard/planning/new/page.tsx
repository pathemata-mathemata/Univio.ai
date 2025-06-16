"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TransferPlanningSection from "@/components/dashboard/TransferPlanningSection";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface FormData {
  year: string;
  quarter: string;
  major: string;
  institution: string;
  transfer: string;
}

const TransferPlanningPage = (): JSX.Element => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    year: "",
    quarter: "",
    major: "",
    institution: "",
    transfer: "",
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    // Basic validation
    if (!formData.year || !formData.quarter || !formData.major || !formData.institution || !formData.transfer) {
      alert("Please fill in all fields");
      return;
    }

    // Store form data locally (no API call yet)
    localStorage.setItem('transferPlanningData', JSON.stringify(formData));
    
    // Navigate directly to courses page
    router.push('/dashboard/courses');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handleNext();
  };

  return (
    <div className="flex flex-col w-full bg-white">
      <TransferPlanningSection />

      <div className="flex flex-col w-full bg-white">
        <div className="flex flex-col w-full">
          <div className="flex justify-center px-40 py-5 w-full">
            <div className="flex flex-col max-w-[960px] w-full">
              <section className="flex flex-col gap-4 p-4 w-full">
                <Link href="/dashboard" className="flex items-center gap-2 text-[#607589] hover:text-[#111416] transition-colors w-fit">
                  <ChevronLeft className="h-4 w-4" />
                  <span className="text-sm font-medium">Back to Dashboard</span>
                </Link>
                <div className="flex flex-col w-72">
                  <h1 className="font-sans font-bold text-[32px] leading-10 text-[#111416] tracking-[0]">
                    AI Transfer Scheduler
                  </h1>
                </div>
              </section>

                        <form onSubmit={handleSubmit} className="w-full px-4">
            {/* Year of Transfer - Row 1 */}
            <div className="flex flex-col items-start px-4 py-3 w-full">
              <label
                htmlFor="year"
                className="font-medium text-[#111416] text-base mb-2"
              >
                Year of Transfer
              </label>
              <Input
                id="year"
                value={formData.year}
                onChange={(e) => handleInputChange("year", e.target.value)}
                className="h-14 bg-white rounded-lg border border-solid border-[#dbe0e5] w-full"
                placeholder="Enter the year you want to transfer"
                required
              />
            </div>

            {/* Quarter - Row 2 */}
            <div className="flex flex-col items-start px-4 py-3 w-full">
              <label
                htmlFor="quarter"
                className="font-medium text-[#111416] text-base mb-2"
              >
                Quarter
              </label>
              <Input
                id="quarter"
                value={formData.quarter}
                onChange={(e) => handleInputChange("quarter", e.target.value)}
                className="h-14 bg-white rounded-lg border border-solid border-[#dbe0e5] w-full"
                placeholder="Enter your current Quarter"
                required
              />
            </div>

            {/* Current Major - Row 3 */}
            <div className="flex flex-col items-start px-4 py-3 w-full">
              <label
                htmlFor="major"
                className="font-medium text-[#111416] text-base mb-2"
              >
                Current Major
              </label>
              <Input
                id="major"
                value={formData.major}
                onChange={(e) => handleInputChange("major", e.target.value)}
                className="h-14 bg-white rounded-lg border border-solid border-[#dbe0e5] w-full"
                placeholder="Enter your current major"
                required
              />
            </div>

            {/* Current Institution - Row 4 */}
            <div className="flex flex-col items-start px-4 py-3 w-full">
              <label
                htmlFor="institution"
                className="font-medium text-[#111416] text-base mb-2"
              >
                Current Institution
              </label>
              <Input
                id="institution"
                value={formData.institution}
                onChange={(e) => handleInputChange("institution", e.target.value)}
                className="h-14 bg-white rounded-lg border border-solid border-[#dbe0e5] w-full"
                placeholder="Enter your current institution"
                required
              />
            </div>

            {/* Intended Transfer Institution - Row 5 */}
            <div className="flex flex-col items-start px-4 py-3 w-full">
              <label
                htmlFor="transfer"
                className="font-medium text-[#111416] text-base mb-2"
              >
                Intended Transfer Institution
              </label>
              <Input
                id="transfer"
                value={formData.transfer}
                onChange={(e) => handleInputChange("transfer", e.target.value)}
                className="h-14 bg-white rounded-lg border border-solid border-[#dbe0e5] w-full"
                placeholder="Enter your intended transfer institution"
                required
              />
            </div>

                <div className="flex items-start justify-end px-4 py-3 relative self-stretch w-full flex-[0_0_auto]">
                  <Button 
                    type="button"
                    onClick={handleNext}
                    className="w-[84px] h-10 bg-[#0c7ff2] rounded-lg text-white font-bold hover:bg-[#0a6fd1] transition-colors"
                  >
                    Next
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransferPlanningPage; 