import { Progress } from "@/components/ui/progress";
import React from "react";

export const ChecklistWrapperSection = (): JSX.Element => {
  // Progress percentage data - will be calculated based on completed classes in the future
  const progressPercentage = 0;

  return (
    <section className="flex flex-col items-start gap-3 p-4 w-full">
      <div className="flex items-start w-full">
        <h3 className="font-medium text-base leading-6 text-[#111416]">
          Transfer Readiness
        </h3>
      </div>

      <Progress
        value={progressPercentage}
        className="w-full h-2 bg-[#dbe0e5]"
      />

      <div className="w-full">
        <p className="text-sm text-[#607589] leading-[21px]">
          {progressPercentage}%
        </p>
      </div>
    </section>
  );
};

export default ChecklistWrapperSection; 