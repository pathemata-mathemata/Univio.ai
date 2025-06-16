import { Progress } from "@/components/ui/progress";
import React from "react";

export default function TransferReadinessSection(): JSX.Element {
  // Progress percentage data - will be calculated based on completed classes in the future
  const progressPercentage = 0;

  return (
    <section className="flex flex-col items-start gap-3 p-4 w-full">
      <div className="flex items-start w-full">
        <h3 className="font-medium text-base leading-6 text-[#111416]">
          Overall Transfer Readiness
        </h3>
      </div>

      <Progress
        value={progressPercentage}
        className="w-full h-2 bg-[#dbe0e5]"
        indicatorClassName="bg-[#111416]"
      />

      <div className="w-full">
        <p className="text-sm text-[#607589] leading-[21px]">
          {progressPercentage}% complete
        </p>
      </div>
    </section>
  );
} 