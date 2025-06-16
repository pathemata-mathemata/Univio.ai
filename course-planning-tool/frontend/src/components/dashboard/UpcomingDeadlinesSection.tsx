import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle } from "lucide-react";
import React from "react";

export default function UpcomingDeadlinesSection(): JSX.Element {
  // Task data will be populated from user's transfer planning data
  const tasks: Array<{ id: number; text: string; completed: boolean }> = [];

  return (
    <div className="flex flex-col items-start w-full">
      {tasks.length === 0 ? (
        <div className="flex items-center justify-center w-full py-8">
          <p className="text-sm text-[#607589] leading-[21px]">
            No upcoming deadlines yet. Complete your transfer planning to see personalized deadlines.
          </p>
        </div>
      ) : (
        tasks.map((task) => (
          <div key={task.id} className="flex items-start gap-3 py-3 w-full">
            {task.completed ? (
              <CheckCircle className="w-5 h-5 text-primary" />
            ) : (
              <Checkbox
                id={`task-${task.id}`}
                className="w-5 h-5 rounded border-2 border-[#dbe0e5]"
              />
            )}
            <label
              htmlFor={`task-${task.id}`}
              className="font-normal text-[#111416] text-base leading-6"
            >
              {task.text}
            </label>
          </div>
        ))
      )}
    </div>
  );
} 