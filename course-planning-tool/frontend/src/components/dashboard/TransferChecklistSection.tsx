import { Card, CardContent } from "@/components/ui/card";
import React from "react";

export default function TransferChecklistSection(): JSX.Element {
  // Additional universities data will be populated from user's planning
  const additionalUniversities: Array<{ name: string; deadlineLabel: string; deadlineDate: string }> = [];

  return (
    <div className="w-full">
      {additionalUniversities.length === 0 ? (
        <Card className="border-0 shadow-none rounded-none">
          <CardContent className="flex items-center justify-center p-4 h-[72px]">
            <p className="text-sm text-[#607589] leading-[21px]">
              No additional universities in your checklist.
            </p>
          </CardContent>
        </Card>
      ) : (
        additionalUniversities.map((university, index) => (
          <Card key={index} className="border-0 shadow-none rounded-none">
            <CardContent className="flex items-center justify-between p-4 h-[72px]">
              <div className="flex flex-col gap-0.5">
                <h3 className="font-medium text-base text-[#111416] leading-6">
                  {university.name}
                </h3>
                <p className="text-sm text-[#607589] leading-[21px]">
                  {university.deadlineLabel}
                </p>
              </div>

              <div className="text-sm text-[#607589] leading-[21px]">
                {university.deadlineDate}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
} 