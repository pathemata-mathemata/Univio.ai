import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, GraduationCap, FileText, Settings, Plus } from "lucide-react";
import Link from "next/link";

export function QuickActions(): JSX.Element {
  const actions = [
    {
      title: "Plan Transfer",
      description: "Start planning your transfer requirements",
      icon: <GraduationCap className="h-6 w-6" />,
      href: "/dashboard/planning/new",
      variant: "default" as const,
    },
    {
      title: "View Schedule",
      description: "See your quarterly course schedule",
      icon: <Calendar className="h-6 w-6" />,
      href: "/dashboard/schedule",
      variant: "outline" as const,
    },
    {
      title: "Add Completed Courses",
      description: "Enter courses you've already completed",
      icon: <Plus className="h-6 w-6" />,
      href: "/dashboard/courses/completed",
      variant: "outline" as const,
    },
    {
      title: "Settings",
      description: "Manage your profile and preferences",
      icon: <Settings className="h-6 w-6" />,
      href: "/dashboard/settings",
      variant: "outline" as const,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Get started with planning your academic journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {actions.map((action, index) => (
            <Link key={index} href={action.href}>
              <Button
                variant={action.variant}
                className="w-full h-auto p-4 flex flex-col items-start space-y-2 text-left"
              >
                <div className="flex items-center gap-2 w-full">
                  {action.icon}
                  <span className="font-medium">{action.title}</span>
                </div>
                <span className="text-sm text-muted-foreground font-normal">
                  {action.description}
                </span>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 