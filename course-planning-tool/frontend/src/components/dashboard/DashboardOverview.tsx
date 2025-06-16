import React from "react";
import { TransferProgress } from "./TransferProgress";
import { QuickActions } from "./QuickActions";
import { UpcomingDeadlines } from "./UpcomingDeadlines";

export function DashboardOverview(): JSX.Element {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's your transfer planning progress and what needs your attention.
        </p>
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Transfer Progress */}
        <TransferProgress />
        
        {/* Upcoming Deadlines */}
        <UpcomingDeadlines />
      </div>
    </div>
  );
} 