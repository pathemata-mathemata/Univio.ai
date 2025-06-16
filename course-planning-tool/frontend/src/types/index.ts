// User and Profile Types
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentProfile {
  id: string;
  userId: string;
  currentInstitution: string;
  targetInstitution: string;
  currentMajor: string;
  targetMajor: string;
  expectedTransferYear: number;
  expectedTransferQuarter: "fall" | "winter" | "spring" | "summer";
  currentQuarter: "fall" | "winter" | "spring" | "summer";
  currentYear: number;
}

// Course and Planning Types
export interface Course {
  id: string;
  code: string;
  title: string;
  units: number;
  description?: string;
  prerequisites: string[];
  institution: string;
  transferable: boolean;
  category?: string;
}

export interface EnrolledCourse {
  id: string;
  courseId: string;
  course: Course;
  quarter: string;
  year: number;
  grade?: string;
  status: "planned" | "enrolled" | "completed" | "dropped";
}

export interface TransferRequirement {
  id: string;
  category: string;
  description: string;
  requiredUnits?: number;
  requiredCourses: string[];
  status: "completed" | "in-progress" | "not-started";
  completedUnits: number;
  completedCourses: string[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Form Types
export interface TransferPlanningFormData {
  currentInstitution: string;
  targetInstitution: string;
  currentMajor: string;
  targetMajor: string;
  expectedTransferYear: number;
  expectedTransferQuarter: "fall" | "winter" | "spring" | "summer";
  currentQuarter: "fall" | "winter" | "spring" | "summer";
  currentYear: number;
} 