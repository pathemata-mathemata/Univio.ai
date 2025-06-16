import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";

export default function TransferPlanningWrapperSection(): JSX.Element {
  // Data for tabs to make the component more maintainable
  const tabItems = [
    { id: "progress", label: "My Progress", isActive: true },
    { id: "applications", label: "My Applications", isActive: false },
    { id: "schools", label: "My Schools", isActive: false },
  ];

  return (
    <div className="flex flex-col items-start w-full pb-3">
      <Tabs defaultValue="progress" className="w-full">
        <TabsList className="flex h-auto justify-start gap-8 px-4 border-b border-[#dbe0e5] bg-transparent">
          {tabItems.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className={`pt-4 pb-[13px] border-b-[3px] border-[#e5e8ea] rounded-none data-[state=active]:border-[#111416] data-[state=active]:text-[#111416] text-[#607589] font-bold text-sm leading-[21px] [font-family:'Public_Sans-Bold',Helvetica]`}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
} 