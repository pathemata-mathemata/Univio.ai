import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, AlertTriangle } from "lucide-react";
import { format, differenceInDays } from "date-fns";

interface Deadline {
  id: string;
  title: string;
  date: Date;
  type: "application" | "registration" | "deadline" | "exam";
  priority: "high" | "medium" | "low";
  description?: string;
}

export function UpcomingDeadlines(): JSX.Element {
  // Default empty state - will be populated from API
  const deadlines: Deadline[] = [];

  const getPriorityColor = (priority: Deadline["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
    }
  };

  const getTypeIcon = (type: Deadline["type"]) => {
    switch (type) {
      case "application":
        return <AlertTriangle className="h-4 w-4" />;
      case "registration":
        return <Calendar className="h-4 w-4" />;
      case "deadline":
        return <Clock className="h-4 w-4" />;
      case "exam":
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getDaysUntil = (date: Date) => {
    const days = differenceInDays(date, new Date());
    if (days < 0) return "Overdue";
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    return `${days} days`;
  };

  const sortedDeadlines = deadlines
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5); // Show only next 5 deadlines

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Upcoming Deadlines
        </CardTitle>
        <CardDescription>
          Important dates and deadlines to keep track of
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sortedDeadlines.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No upcoming deadlines
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Important dates will appear here once you set up your transfer plan.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedDeadlines.map((deadline) => (
              <div key={deadline.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                <div className="flex-shrink-0 mt-1">
                  {getTypeIcon(deadline.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{deadline.title}</h4>
                    <Badge variant="secondary" className={getPriorityColor(deadline.priority)}>
                      {deadline.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(deadline.date, "MMM dd, yyyy")} • {getDaysUntil(deadline.date)}
                  </p>
                  {deadline.description && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {deadline.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 