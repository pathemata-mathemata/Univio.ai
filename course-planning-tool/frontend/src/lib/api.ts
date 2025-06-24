import { ApiResponse, PaginatedResponse } from "@/types";
import { supabase } from "@/lib/supabase";

// Use Next.js API routes for all requests - let Next.js handle the routing
const API_BASE_URL = "/api";

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Debug logging
  console.log(`🔄 API Request: ${options.method || 'GET'} ${url}`);
  
  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  // Add timeout for long-running requests (like ASSIST.org scraping)
  const timeoutMs = endpoint.includes('/backend/transfer/analyze') ? 300000 : 30000; // 5 minutes for analysis, 30 seconds for others
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  config.signal = controller.signal;

  // Add Supabase authentication token if available
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${session.access_token}`,
      };
      console.log(`🔑 Added auth token for ${url}`);
    } else {
      console.log(`⚠️ No auth token available for ${url}`);
    }
  } catch (error) {
    console.warn("Could not get session for API request:", error);
  }

  try {
    const response = await fetch(url, config);
    clearTimeout(timeoutId);
    
    console.log(`📡 API Response: ${response.status} ${response.statusText} for ${url}`);
    
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.detail || errorMessage;
        console.error(`❌ API Error Details:`, errorData);
      } catch {
        // If we can't parse the error response, use the default message
        console.error(`❌ API Error: Could not parse error response for ${url}`);
      }
      throw new ApiError(response.status, errorMessage);
    }

    const data = await response.json();
    console.log(`✅ API Success for ${url}:`, data);
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error(`💥 API Request Failed for ${url}:`, error);
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError(408, `Request timeout after ${timeoutMs / 1000} seconds`);
    }
    
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(0, "Network error or unexpected error occurred");
  }
}

// Auth API - Uses Next.js API routes
export const authApi = {
  login: async (email: string, password: string) => {
    return fetchApi<{ token: string; user: any }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (email: string, password: string, name: string) => {
    return fetchApi<{ token: string; user: any }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    });
  },

  logout: async () => {
    return fetchApi<void>("/auth/logout", { method: "POST" });
  },
};

// Transfer Planning API - Routes through Next.js rewrites to FastAPI backend
export const transferApi = {
  analyzeRequirements: async (data: {
    current_institution: string;
    target_institution: string;
    major: string;
    academic_year: string;
  }) => {
    return fetchApi<ApiResponse<any>>("/backend/transfer/analyze", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  analyzePublic: async (data: {
    target_transfer_quarter: string;
    current_planning_quarter: string;
    current_major: string;
    current_institution: string;
    intended_transfer_institution: string;
    completed_courses: any[];
  }) => {
    return fetchApi<ApiResponse<any>>("/backend/transfer/analyze-public", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getTransferProgress: async () => {
    return fetchApi<ApiResponse<any>>("/backend/transfer/progress");
  },
};

// Course Planning API - Routes through Next.js rewrites to FastAPI backend  
export const courseApi = {
  generatePlan: async (data: {
    current_quarter: string;
    current_year: number;
    transfer_quarter: string;
    transfer_year: number;
    completed_courses: string[];
    transfer_requirements: any[];
  }) => {
    return fetchApi<ApiResponse<any>>("/backend/planning/generate", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getCourses: async (params?: {
    institution?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const query = searchParams.toString();
    return fetchApi<PaginatedResponse<any>>(`/backend/courses${query ? `?${query}` : ""}`);
  },
};

// Profile API - Uses Next.js API routes
export const profileApi = {
  getProfile: async () => {
    return fetchApi<ApiResponse<any>>("/users/profile");
  },

  updateProfile: async (data: any) => {
    return fetchApi<ApiResponse<any>>("/users/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
};

export { ApiError }; 