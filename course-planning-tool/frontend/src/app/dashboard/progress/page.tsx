"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

interface TransferAnalysisData {
  academic_year: string;
  source_institution: string;
  target_institution: string;
  major: string;
  target_requirements: any[];
  source_requirements: any;
  ai_schedule?: {
    quarter: {
      quarter_name: string;
      courses: Array<{
        course_code: string;
        course_name: string;
        units: number;
        reasoning: string;
      }>;
      total_units: number;
      notes: string;
    };
    recommendations: string[];
  };
  ai_error?: string;
  user_timeline?: {
    target_transfer_quarter: string;
    current_planning_quarter: string;
  };
  analysis_metadata?: {
    quarters_until_transfer: number;
    analysis_date: string;
    requirements_source: string;
  };
}

export default function ProgressPage() {
  const router = useRouter();
  const [analysisData, setAnalysisData] = useState<TransferAnalysisData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get data from localStorage (in production, this would be from a proper state management solution)
    const storedData = localStorage.getItem('transferAnalysis');
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setAnalysisData(data.data || data); // Handle both wrapped and direct data formats
      } catch (error) {
        console.error('Error parsing stored analysis data:', error);
      }
    }
    setLoading(false);
  }, []);

  const handleBackToForm = () => {
    router.push('/dashboard/planning/new');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading Analysis...</h1>
          <p className="text-gray-600">Please wait while we process your transfer requirements.</p>
        </div>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Analysis Data Found</h1>
          <p className="text-gray-600 mb-4">Please complete the transfer planning form first.</p>
          <Button onClick={handleBackToForm}>Go to Transfer Planning</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Transfer Analysis Results</h1>
          <p className="text-gray-600">
            Analysis for {analysisData.major} transfer from {analysisData.source_institution} to {analysisData.target_institution}
          </p>
        </div>

        {/* Timeline Info */}
        {analysisData.user_timeline && (
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-xl font-semibold">Your Transfer Timeline</h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {analysisData.user_timeline.current_planning_quarter}
                  </div>
                  <div className="text-sm text-gray-600">Current Planning Quarter</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {analysisData.analysis_metadata?.quarters_until_transfer || 0}
                  </div>
                  <div className="text-sm text-gray-600">Quarters Until Transfer</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {analysisData.user_timeline.target_transfer_quarter}
                  </div>
                  <div className="text-sm text-gray-600">Target Transfer Quarter</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Fallback Notice */}
        {analysisData?.is_fallback && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50">
            <CardHeader>
              <h2 className="text-lg font-semibold text-yellow-800">⚠️ Using Sample Data</h2>
              <p className="text-sm text-yellow-700">
                ASSIST.org scraping is currently unavailable. Showing sample transfer requirements for demonstration purposes.
                For accurate requirements, please consult ASSIST.org directly or contact your academic counselor.
              </p>
            </CardHeader>
          </Card>
        )}

        {/* Main Transfer Requirements - What you need to take at current institution */}
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-xl font-semibold">Transfer Requirements at {analysisData.target_institution}</h2>
            <p className="text-sm text-gray-600">Courses you need to complete at {analysisData.source_institution}</p>
            {analysisData?.is_fallback && (
              <p className="text-xs text-yellow-600 mt-1">* Sample data - actual requirements may vary</p>
            )}
          </CardHeader>
          <CardContent>
            {Object.keys(analysisData.source_requirements).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(analysisData.source_requirements).map(([requirement, options]: [string, any]) => (
                  <div key={requirement} className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold text-lg mb-2">{requirement}</h3>
                    {Array.isArray(options) && options.map((optionGroup, groupIndex) => (
                      <div key={groupIndex} className="bg-blue-50 p-3 rounded mb-2">
                        {Array.isArray(optionGroup) && optionGroup.map((course, courseIndex) => (
                          <div key={courseIndex} className="flex items-center justify-between py-1">
                            <span className="font-medium">{course.code}</span>
                            <span className="text-gray-600">{course.title}</span>
                            {course.units && <span className="text-sm text-gray-500">{course.units}</span>}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No transfer requirements found.</p>
            )}
          </CardContent>
        </Card>

        {/* AI-Generated Course Schedule */}
        {analysisData.ai_schedule && (
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-xl font-semibold">🤖 AI-Recommended Course Schedule</h2>
              <p className="text-sm text-gray-600">
                Personalized schedule for {analysisData.ai_schedule.quarter.quarter_name}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Quarter Summary */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-lg">{analysisData.ai_schedule.quarter.quarter_name}</h3>
                    <span className="text-blue-600 font-bold">
                      {analysisData.ai_schedule.quarter.total_units} Units Total
                    </span>
                  </div>
                  {analysisData.ai_schedule.quarter.notes && (
                    <p className="text-sm text-gray-600">{analysisData.ai_schedule.quarter.notes}</p>
                  )}
                </div>

                {/* Course List */}
                <div className="space-y-3">
                  {analysisData.ai_schedule.quarter.courses.map((course, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-lg">{course.course_code}</h4>
                          <p className="text-gray-600">{course.course_name}</p>
                        </div>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                          {course.units} units
                        </span>
                      </div>
                      {course.reasoning && (
                        <div className="mt-2 p-3 bg-gray-50 rounded">
                          <p className="text-sm text-gray-700">
                            <strong>Why this course:</strong> {course.reasoning}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* AI Recommendations */}
                {analysisData.ai_schedule.recommendations && analysisData.ai_schedule.recommendations.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">💡 AI Recommendations</h4>
                    <div className="space-y-2">
                      {analysisData.ai_schedule.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <p className="text-sm text-gray-700">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI Error Display */}
        {analysisData.ai_error && (
          <Card className="mb-6 border-orange-200">
            <CardHeader>
              <h2 className="text-xl font-semibold text-orange-600">⚠️ AI Scheduling Issue</h2>
            </CardHeader>
            <CardContent>
              <p className="text-orange-700 mb-4">
                The AI course scheduler encountered an issue: {analysisData.ai_error}
              </p>
              <p className="text-sm text-gray-600">
                You can still view the transfer requirements below and plan your courses manually.
              </p>
            </CardContent>
          </Card>
        )}



        {/* Actions */}
        <div className="flex gap-4">
          <Button onClick={handleBackToForm} variant="outline">
            Analyze Different Transfer
          </Button>
          <Button onClick={() => window.print()}>
            Print Analysis
          </Button>
        </div>
      </div>
    </div>
  );
} 