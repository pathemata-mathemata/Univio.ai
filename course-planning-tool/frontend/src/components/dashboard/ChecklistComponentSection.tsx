import { Card, CardContent } from "@/components/ui/card";
import React from "react";

export const ChecklistComponentSection = (): JSX.Element => {
  // University application data will be populated from user's transfer planning
  const universities: Array<{ name: string; deadlineLabel: string; deadlineDate: string }> = [];

  return (
    <div className="w-full">
      {universities.length === 0 ? (
        <Card className="border-0 shadow-none rounded-none">
          <CardContent className="flex items-center justify-center p-4 h-[72px]">
            <p className="text-sm text-[#607589] leading-[21px]">
              No universities added yet. Use the AI Scheduler to add target universities.
            </p>
          </CardContent>
        </Card>
      ) : (
        universities.map((university, index) => (
          <Card key={index} className="border-0 shadow-none rounded-none">
            <CardContent className="flex items-center justify-between p-4 h-[72px]">
              <div className="flex flex-col">
                <h3 className="font-medium text-base text-[#111416] leading-6">
                  {university.name}
                </h3>
                <p className="text-sm text-[#607589] leading-[21px]">
                  {university.deadlineLabel}
                </p>
              </div>

              <div className="flex flex-col">
                <p className="text-sm text-[#607589] leading-[21px]">
                  {university.deadlineDate}
                </p>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default ChecklistComponentSection; 