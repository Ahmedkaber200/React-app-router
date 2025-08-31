import Cookies from "js-cookie";
import { toast } from "sonner";

// const BASE_URL = "https://test-be-dashboard.forweb.tech/api";
const BASE_URL = "http://192.168.1.41:8000/api";
// const BASE_URL = "http://localhost:8000/api";

interface ApiResponse<T> {
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

type RequestConfig = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
  req?: Request; // 👈 SSR support
};

// ✅ Auth Token Getter (CSR + SSR)
export const getAuthToken = (req?: Request): string | undefined => {
  if (req) {
    const cookieHeader = req.headers.get("cookie");
    if (!cookieHeader) return undefined;

    const match = cookieHeader
      .split(";")
      .find((c) => c.trim().startsWith("auth_token="));
    return match ? decodeURIComponent(match.split("=")[1]) : undefined;
  }

  if (typeof window !== "undefined") {
    return Cookies.get("auth_token");
  }

  return undefined;
};

// ✅ Request Interceptor
const requestInterceptor = (config: RequestConfig): RequestConfig => {
  const token = getAuthToken(config.req);
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...config.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return {
    ...config,
    headers,
  };
};

// ✅ Response Interceptor
const responseInterceptor = async <T>(response: Response): Promise<T> => {
  let data: ApiResponse<T>;

  try {
    data = await response.json();
  } catch {
    throw new Error("Invalid JSON response from server");
  }

  if (!response.ok) {
    const error = new Error(data.message || "Request failed");
    Object.assign(error, {
      status: response.status,
      errors: data.errors,
    });
    throw error;
  }

  if (data.data === undefined) {
    throw new Error(data.message || "No data received from API");
  }

  return data.data;
};

// ✅ Error Interceptor
const errorInterceptor = (error: unknown): never => {
  if (error instanceof Error) {
    toast.error(error.message);
    throw error;
  } else {
    throw new Error("Unknown API error");
  }
};

// ✅ Main API Client
export const apiClient = async <T>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<T> => {
  try {
    const interceptedConfig = requestInterceptor(config);
    const response = await fetch(`${BASE_URL}${endpoint}`, interceptedConfig);

    console.log(
      `Request → ${BASE_URL}${endpoint}`,
      interceptedConfig,
      "Status:",
      response.status
    );

    return await responseInterceptor<T>(response);
  } catch (error) {
    return errorInterceptor(error);
  }
};

// ✅ Helper Methods
export const get = <T>(endpoint: string, config?: RequestConfig) =>
  apiClient<T>(endpoint, { ...config, method: "GET" });

export const post = <T>(endpoint: string, body: any, config?: RequestConfig) =>
  apiClient<T>(endpoint, {
    ...config,
    method: "POST",
    body: JSON.stringify(body),
  });

export const put = <T>(endpoint: string, body: any, config?: RequestConfig) =>
  apiClient<T>(endpoint, {
    ...config,
    method: "PUT",
    body: JSON.stringify(body),
  });

export const del = <T>(endpoint: string, config?: RequestConfig) =>
  apiClient<T>(endpoint, { ...config, method: "DELETE" });

// ✅ Auth Token Setter
export const setAuthToken = (token: string) => {
  Cookies.set("auth_token", token,
    
  );
};
