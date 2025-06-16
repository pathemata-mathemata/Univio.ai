import { ApiResponse, PaginatedResponse } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

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
  
  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  // Add authentication token if available
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new ApiError(response.status, `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(0, "Network error or unexpected error occurred");
  }
}

// Auth API
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

// Transfer Planning API
export const transferApi = {
  analyzeRequirements: async (data: {
    current_institution: string;
    target_institution: string;
    major: string;
    academic_year: string;
  }) => {
    return fetchApi<ApiResponse<any>>("/transfer/analyze", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getTransferProgress: async () => {
    return fetchApi<ApiResponse<any>>("/transfer/progress");
  },
};

// Course Planning API
export const courseApi = {
  generatePlan: async (data: {
    current_quarter: string;
    current_year: number;
    transfer_quarter: string;
    transfer_year: number;
    completed_courses: string[];
    transfer_requirements: any[];
  }) => {
    return fetchApi<ApiResponse<any>>("/planning/generate", {
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
    return fetchApi<PaginatedResponse<any>>(`/courses${query ? `?${query}` : ""}`);
  },
};

// Profile API
export const profileApi = {
  getProfile: async () => {
    return fetchApi<ApiResponse<any>>("/profile");
  },

  updateProfile: async (data: any) => {
    return fetchApi<ApiResponse<any>>("/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
};

export { ApiError }; 