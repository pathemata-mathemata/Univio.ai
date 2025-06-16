import React from "react";
import { ChecklistComponentSection } from "./ChecklistComponentSection";
import { ChecklistWrapperSection } from "./ChecklistWrapperSection";
import TransferChecklistSection from "./TransferChecklistSection";
import TransferPlanningSection from "./TransferPlanningSection";
import TransferPlanningWrapperSection from "./TransferPlanningWrapperSection";
import TransferReadinessSection from "./TransferReadinessSection";
import UpcomingDeadlinesSection from "./UpcomingDeadlinesSection";

export default function Dashboard(): JSX.Element {
  return (
    <div className="flex flex-col w-full bg-white">
      <TransferPlanningSection />
      <div className="flex flex-col w-full bg-white">
        <div className="flex flex-col w-full">
          <div className="flex justify-center px-40 py-5 w-full">
            <div className="flex flex-col max-w-[960px] w-full">
              <section className="flex flex-wrap justify-around gap-[12px] p-4 w-full">
                <div className="flex flex-col w-72">
                  <h1 className="font-sans font-bold text-[32px] leading-10 text-[#111416] tracking-[0]">
                    Transfer Planning
                  </h1>
                </div>
              </section>

              <TransferPlanningWrapperSection />
              <ChecklistWrapperSection />

              <section className="flex flex-col pt-5 pb-3 px-4 w-full">
                <h2 className="font-sans font-bold text-[22px] leading-7 text-[#111416] tracking-[0]">
                  Transfer Checklist
                </h2>
              </section>

              <ChecklistComponentSection />

              <section className="flex flex-col pt-5 pb-3 px-4 w-full">
                <h2 className="font-sans font-bold text-[22px] leading-7 text-[#111416] tracking-[0]">
                  Upcoming Deadlines
                </h2>
              </section>

              <UpcomingDeadlinesSection />
              <TransferReadinessSection />
              <TransferChecklistSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 