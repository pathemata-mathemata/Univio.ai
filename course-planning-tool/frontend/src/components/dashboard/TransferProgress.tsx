import React from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Clock } from "lucide-react";

interface RequirementStatus {
  category: string;
  completed: number;
  total: number;
  status: "completed" | "in-progress" | "not-started";
}

export function TransferProgress(): JSX.Element {
  // Default empty state - will be populated from API
  const requirements: RequirementStatus[] = [];

  const overallProgress = requirements.length > 0 
    ? Math.round(
        (requirements.reduce((acc, req) => acc + req.completed, 0) /
          requirements.reduce((acc, req) => acc + req.total, 0)) * 100
      )
    : 0;

  const getStatusIcon = (status: RequirementStatus["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "not-started":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
    }
  };

  const getStatusBadge = (status: RequirementStatus["status"]) => {
    switch (status) {
      case "completed":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Complete</Badge>;
      case "in-progress":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">In Progress</Badge>;
      case "not-started":
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Not Started</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Transfer Readiness
          <Badge variant="outline">{overallProgress}% Complete</Badge>
        </CardTitle>
        <CardDescription>
          Track your progress towards transfer requirements
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Overall Progress</span>
            <span className="text-muted-foreground">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>

        {/* Requirement Categories */}
        <div className="space-y-4">
          {requirements.length > 0 ? (
            requirements.map((req, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(req.status)}
                    <span className="font-medium">{req.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {req.completed}/{req.total}
                    </span>
                    {getStatusBadge(req.status)}
                  </div>
                </div>
                <Progress 
                  value={(req.completed / req.total) * 100} 
                  className="h-1.5" 
                />
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No transfer requirements loaded yet.
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Complete your profile setup to see your transfer progress.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 