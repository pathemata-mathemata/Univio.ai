"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Trash2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Course {
  id: string;
  courseNumber: string;
  credits: string;
  grade: string;
}

export default function CoursesPage(): JSX.Element {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [newCourse, setNewCourse] = useState<Omit<Course, 'id'>>({
    courseNumber: '',
    credits: '',
    grade: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTime, setLoadingTime] = useState(0);

  // Timer effect for loading page
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading]);

  // Navigation items data
  const navItems = [
    { label: "AI Scheduler", href: "#" },
    { label: "Find Professor", href: "#" },
    { label: "Find Classmate", href: "#" },
  ];

  const addCourse = () => {
    if (newCourse.courseNumber && newCourse.credits && newCourse.grade) {
      const course: Course = {
        id: Date.now().toString(),
        ...newCourse
      };
      setCourses([...courses, course]);
      setNewCourse({ courseNumber: '', credits: '', grade: '' });
    }
  };

  const removeCourse = (id: string) => {
    setCourses(courses.filter(course => course.id !== id));
  };

  const handleDone = async () => {
    // Get transfer planning data from localStorage
    const transferPlanningData = localStorage.getItem('transferPlanningData');
    if (!transferPlanningData) {
      alert('Transfer planning data not found. Please start over.');
      router.push('/dashboard/planning/new');
      return;
    }

    const planningData = JSON.parse(transferPlanningData);

    // Log all the data being sent
    console.log('=== FRONTEND DATA BEING SENT ===');
    console.log('Planning Data from localStorage:', planningData);
    console.log('Completed Courses:', courses);
    
    const requestData = {
      target_transfer_quarter: planningData.year,
      current_planning_quarter: planningData.quarter,
      current_major: planningData.major,
      current_institution: planningData.institution,
      intended_transfer_institution: planningData.transfer,
      completed_courses: courses,
    };
    
    console.log('Full Request Data:', requestData);
    console.log('API URL:', `${process.env.NEXT_PUBLIC_API_URL}/api/v1/transfer/analyze-public`);

    // Start loading state
    setIsLoading(true);
    setLoadingTime(0);

    try {
      // Call API to analyze transfer requirements with all data
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/transfer/analyze-public`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        const result = await response.json();
        console.log('API Response:', result);
        // Store the complete analysis result
        localStorage.setItem('transferAnalysis', JSON.stringify(result));
        setIsLoading(false);
        router.push('/dashboard/progress');
      } else {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        setIsLoading(false);
        throw new Error(`Failed to analyze transfer requirements: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      alert(`Error analyzing transfer requirements: ${errorMessage}`);
    }
  };

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Loading page component
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-white">
        {/* Header/Navigation */}
        <header className="flex items-center justify-between px-10 py-3 border-b border-[#e5e8ea]">
          <div className="flex items-center">
            <Image
              src="/images/univio-logo.png"
              alt="UniVio.AI"
              width={200}
              height={82}
              className="h-10 w-auto"
              priority
            />
          </div>
        </header>

        {/* Loading Content */}
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            {/* Loading Animation */}
            <div className="mb-8">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-[#dbe0e5] rounded-full"></div>
                <div className="absolute inset-0 border-4 border-[#0c7ff2] border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>

            {/* Title and Description */}
            <h1 className="font-bold text-2xl text-[#111416] mb-4">
              Analyzing Transfer Requirements
            </h1>
            <p className="text-[#607589] text-base mb-8 leading-relaxed">
              We're analyzing your transfer requirements using ASSIST.org data. 
              This process may take a few moments as we gather the most up-to-date 
              information for your transfer path.
            </p>

            {/* Timer */}
            <div className="bg-[#f8f9fa] rounded-lg p-6 mb-8">
              <div className="text-3xl font-bold text-[#0c7ff2] mb-2">
                {formatTime(loadingTime)}
              </div>
              <div className="text-sm text-[#607589]">
                Processing time
              </div>
            </div>

            {/* Progress Steps */}
            <div className="space-y-4 text-left">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#0c7ff2] rounded-full"></div>
                <span className="text-sm text-[#607589]">Connecting to ASSIST.org</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#0c7ff2] rounded-full"></div>
                <span className="text-sm text-[#607589]">Retrieving transfer agreements</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#dbe0e5] rounded-full"></div>
                <span className="text-sm text-[#607589]">Processing course requirements</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#dbe0e5] rounded-full"></div>
                <span className="text-sm text-[#607589]">Generating your personalized plan</span>
              </div>
            </div>

            {/* Tip */}
            <div className="mt-8 p-4 bg-[#eff2f4] rounded-lg">
              <p className="text-sm text-[#607589]">
                💡 <strong>Tip:</strong> This analysis will help you understand exactly 
                which courses you need to complete for your transfer goals.
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[800px] w-full bg-white">
      {/* Header/Navigation */}
      <header className="flex items-center justify-between px-10 py-3 border-b border-[#e5e8ea]">
        <div className="flex items-center">
          <Image
            src="/images/univio-logo.svg"
            alt="UniVio.AI"
            width={140}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </div>

        <div className="flex items-center justify-end gap-8 flex-1">
          <nav className="flex items-center gap-9 h-10">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="font-medium text-sm text-[#111416]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center bg-[#eff2f4] rounded-[20px] px-2.5 py-0 h-10 max-w-[480px]">
            <Search className="w-[15px] h-4 mr-2" />
            <Input
              className="border-0 bg-transparent h-full focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
              placeholder="Search..."
            />
          </div>

          <Avatar className="w-10 h-10">
            <AvatarImage src="/depth-4-frame-2.png" alt="User profile" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex justify-center px-40 py-5 h-[735px]">
        <div className="flex flex-col max-w-[960px] h-[695px] flex-1">
          {/* Header Section */}
          <div className="flex flex-wrap items-start justify-around gap-[12px] p-4 w-full">
            <div className="flex flex-col min-w-72 gap-3">
              <h2 className="font-bold text-[32px] text-[#111416] leading-10">
                Add Completed Courses
              </h2>
              <p className="font-normal text-sm text-[#6b7582] leading-[21px]">
                Enter the courses you've completed at your current institution.
                This information will help us match you with potential transfer
                opportunities.
              </p>
            </div>
          </div>

          {/* Course Information Section */}
          <div className="flex flex-col pt-4 pb-2 px-4 w-full">
            <h3 className="font-bold text-lg text-[#111416] leading-[23px]">
              Course Information
            </h3>
          </div>

          {/* Add New Course Form */}
          <div className="px-4 py-3 w-full">
            <Card className="border border-solid border-[#dde0e2] rounded-xl p-4 mb-4">
              <div className="grid grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-[#111416] mb-2">
                    Course Number
                  </label>
                  <Input
                    value={newCourse.courseNumber}
                    onChange={(e) => setNewCourse({ ...newCourse, courseNumber: e.target.value })}
                    placeholder="e.g., MATH 1A"
                    className="h-10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#111416] mb-2">
                    Credits
                  </label>
                  <Input
                    value={newCourse.credits}
                    onChange={(e) => setNewCourse({ ...newCourse, credits: e.target.value })}
                    placeholder="e.g., 4"
                    className="h-10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#111416] mb-2">
                    Grade
                  </label>
                  <Input
                    value={newCourse.grade}
                    onChange={(e) => setNewCourse({ ...newCourse, grade: e.target.value })}
                    placeholder="e.g., A"
                    className="h-10"
                  />
                </div>
                <div>
                  <Button
                    onClick={addCourse}
                    className="h-10 bg-[#0c7ff2] text-white hover:bg-[#0a6fd1]"
                  >
                    Add Course
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Course Table */}
          <div className="px-4 py-3 w-full flex-1 overflow-auto">
            <Card className="border border-solid border-[#dde0e2] rounded-xl overflow-hidden">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[310px] px-4 py-3 font-medium text-sm text-[#111416]">
                        Course Number
                      </TableHead>
                      <TableHead className="w-[309px] px-4 py-3 font-medium text-sm text-[#111416]">
                        Credits
                      </TableHead>
                      <TableHead className="w-[207px] px-4 py-3 font-medium text-sm text-[#111416]">
                        Grade
                      </TableHead>
                      <TableHead className="w-[100px] px-4 py-3 font-medium text-sm text-[#111416]">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                          No courses added yet. Use the form above to add your completed courses.
                        </TableCell>
                      </TableRow>
                    ) : (
                      courses.map((course) => (
                        <TableRow key={course.id}>
                          <TableCell className="px-4 py-3 font-medium">
                            {course.courseNumber}
                          </TableCell>
                          <TableCell className="px-4 py-3">
                            {course.credits}
                          </TableCell>
                          <TableCell className="px-4 py-3">
                            {course.grade}
                          </TableCell>
                          <TableCell className="px-4 py-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeCourse(course.id)}
                              className="text-red-600 hover:text-red-800 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Done Button */}
          <div className="flex justify-end px-4 py-3 w-full">
            <Button
              onClick={handleDone}
              className="h-10 min-w-[84px] max-w-[480px] px-4 py-0 bg-[#0c7ff2] rounded-[20px] font-bold text-sm text-white hover:bg-[#0a6fd1]"
            >
              Done
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
} 